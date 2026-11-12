// V2 问卷响应式引擎:从后端拉取结构(平铺数组) + 复用 questionnaireV2Parser 规则引擎 + 草稿持久化。
import { computed, ref } from 'vue'
import type {
  QuestionnaireAnswerDraftV2,
  QuestionnaireAnswerRowV2,
  QuestionnaireDefinitionV2,
} from '@touhou-vote/shared/data/questionnaireV2'
import { fetchQuestionnaireStructure, meetsQuestionnaireCompletionPolicy } from '@touhou-vote/shared/api/questionnaire'
import {
  normalizeQuestionnaireDraftV2,
  parseQuestionnaireRuntimeV2,
  setQuestionInputV2,
  toggleQuestionOptionV2,
} from '@/questionnaire/lib/questionnaireV2Parser'
import type { QuestionnaireRuntimeV2 } from '@/questionnaire/lib/questionnaireV2Parser'
import { API_PREFIX } from '@/common/lib/apiPrefix'
import { createApollo, gql } from '@/graphql'

const LOCALSTORAGE_KEY = 'questionnaireDataLocalV2'
const SESSIONSTORAGE_KEY = 'questionnaireStructureV2'
const STRUCTURE_URL = `${API_PREFIX}/questionnaire/structure`

// ---------------- 结构 ----------------
export const questionnaires = ref<QuestionnaireDefinitionV2[]>([])
export const structureLoading = ref(false)
export const structureError = ref<string | null>(null)

let resolveStructureReady: () => void = () => {}
// 成功 / 缓存命中 / 出错 都会 resolve,绝不挂起守卫。
export const structureReady: Promise<void> = new Promise((resolve) => {
  resolveStructureReady = resolve
})
let structureReadyResolved = false
let loadPromise: Promise<void> | null = null
let structureLoaded = false

function markStructureReady(): void {
  if (!structureReadyResolved) {
    structureReadyResolved = true
    resolveStructureReady()
  }
}

export function loadQuestionnaireStructure(force = false): Promise<void> {
  if (loadPromise) return loadPromise
  if (structureLoaded && !force) return Promise.resolve()

  loadPromise = (async () => {
    structureLoading.value = true
    structureError.value = null
    try {
      sessionStorage.removeItem(SESSIONSTORAGE_KEY)
      const json = await fetchQuestionnaireStructure(STRUCTURE_URL)
      questionnaires.value = json.questionnaires
      ensureAnswerState()
      structureLoaded = true
    } catch (err) {
      structureError.value = err instanceof Error ? err.message : String(err)
      console.error('[questionnaireV2] 拉取结构失败:', err)
    } finally {
      structureLoading.value = false
      markStructureReady()
    }
  })()

  const pending = loadPromise
  void pending.then(() => { loadPromise = null })
  return pending
}

// ---------------- 答案状态 ----------------
// undefined 是旧缓存，null 是已同步的答案，字符串是未提交修改的版本。
type LocalDraft = QuestionnaireAnswerDraftV2 & { editRevision?: string | null }
type LocalDrafts = Record<number, LocalDraft>
export const drafts = ref<LocalDrafts>({})
let draftSession = 0

function createEmptyDraft(questionnaire: QuestionnaireDefinitionV2): LocalDraft {
  return {
    questionnaireId: questionnaire.id,
    editRevision: null,
    groups: questionnaire.questionGroups.map((group) => ({
      groupId: group.id,
      activeQuestionId: null,
      selectedOptionIds: [],
      input: '',
    })),
  }
}

function reconcileDraft(definition: QuestionnaireDefinitionV2, draft: LocalDraft): LocalDraft {
  try {
    return { ...normalizeQuestionnaireDraftV2(definition, draft), editRevision: draft.editRevision }
  } catch (err) {
    console.error(`[questionnaireV2] 归一化 questionnaire ${definition.id} 失败:`, err)
    return draft
  }
}

export function ensureAnswerState(): void {
  if (!questionnaires.value.length) return
  const fromLocal = loadDraftsFromLocalStorage()
  for (const questionnaire of questionnaires.value) {
    const existing = fromLocal?.[questionnaire.id] ?? drafts.value[questionnaire.id]
    const base = existing ?? createEmptyDraft(questionnaire)
    drafts.value[questionnaire.id] = reconcileDraft(questionnaire, base)
  }
  persistDrafts()
}

// ---------------- 运行时(复用 parser) ----------------
export const runtimeById = computed<Record<number, QuestionnaireRuntimeV2 | null>>(() => {
  const result: Record<number, QuestionnaireRuntimeV2 | null> = {}
  for (const questionnaire of questionnaires.value) {
    const draft = drafts.value[questionnaire.id]
    if (!draft) {
      result[questionnaire.id] = null
      continue
    }
    try {
      result[questionnaire.id] = parseQuestionnaireRuntimeV2(questionnaire, draft)
    } catch (err) {
      console.error(`[questionnaireV2] 解析运行时 questionnaire ${questionnaire.id} 失败:`, err)
      result[questionnaire.id] = null
    }
  }
  return result
})

export function getRuntime(questionnaireId: number): QuestionnaireRuntimeV2 | null {
  return runtimeById.value[questionnaireId] ?? null
}

// ---------------- 变更(写回 + 持久化) ----------------
function newEditRevision(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function saveEdit(previous: LocalDraft, next: QuestionnaireAnswerDraftV2): void {
  if (JSON.stringify(previous.groups) === JSON.stringify(next.groups)) return
  drafts.value[next.questionnaireId] = { ...next, editRevision: newEditRevision() }
  persistDrafts()
}

export function toggleOption(questionnaireId: number, groupId: number, optionId: number): void {
  const questionnaire = questionnaires.value.find((q) => q.id === questionnaireId)
  const draft = drafts.value[questionnaireId]
  if (!questionnaire || !draft) return
  saveEdit(draft, toggleQuestionOptionV2(questionnaire, draft, groupId, optionId))
}

export function setInput(questionnaireId: number, groupId: number, input: string): void {
  const questionnaire = questionnaires.value.find((q) => q.id === questionnaireId)
  const draft = drafts.value[questionnaireId]
  if (!questionnaire || !draft) return
  saveEdit(draft, setQuestionInputV2(questionnaire, draft, groupId, input))
}

// ---------------- 完成判定(仅本地预判,权威以后端为准) ----------------
export function isQuestionnaireDoneV2(questionnaireId: number): boolean {
  return getRuntime(questionnaireId)?.done ?? false
}

// 整体预判：全部必填完成，并至少完成一份 extra 选填问卷。
export const isQuestionnaireAllDoneV2 = computed<boolean>(() => {
  const completed = new Set(questionnaires.value.filter((q) => getRuntime(q.id)?.done).map((q) => q.id))
  return meetsQuestionnaireCompletionPolicy(questionnaires.value, completed)
})

// 是否第一次完成全部问卷(用于提交成功弹窗的引导文案)
export const firstCompleteQuestionnaireAll = ref(true)

// 问卷名称列表(供切换抽屉/首页使用)
export const questionnaireKeyToNameV2 = computed<{ questionnaireId: number; key: string; name: string; category: string }[]>(
  () => questionnaires.value.map((q) => ({ questionnaireId: q.id, key: q.key, name: q.title, category: q.category }))
)

// ---------------- 持久化 ----------------
export function persistDrafts(): void {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(drafts.value))
}

export function loadDraftsFromLocalStorage(): LocalDrafts | null {
  const raw = localStorage.getItem(LOCALSTORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    // Validate it's an object with numeric keys (flat Record<number, draft>)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as LocalDrafts
    }
    return null
  } catch {
    return null
  }
}

export function clearQuestionnaireV2LocalData(): void {
  draftSession++
  localStorage.removeItem(LOCALSTORAGE_KEY)
  sessionStorage.removeItem(SESSIONSTORAGE_KEY)
  drafts.value = {}
}

// ---------------- 提交 / 回填(后端) ----------------
// 同时捕获扁平提交数据和各问卷的编辑版本。
export function preparePaperSubmission() {
  if (!questionnaires.value.length) return null
  const answers: QuestionnaireAnswerRowV2[] = []
  const revisions = new Map<number, LocalDraft['editRevision']>()
  for (const questionnaire of questionnaires.value) {
    const draft = drafts.value[questionnaire.id]
    if (!draft) continue
    revisions.set(questionnaire.id, draft.editRevision)
    for (const group of questionnaire.questionGroups) {
      const groupDraft = draft.groups.find((g) => g.groupId === group.id)
      answers.push({
        questionnaireId: questionnaire.id,
        groupId: group.id,
        activeQuestionId: groupDraft?.activeQuestionId ?? null,
        selectedOptionIds: [...(groupDraft?.selectedOptionIds ?? [])],
        input: groupDraft?.input ?? '',
      })
    }
  }
  return { answers, revisions, session: draftSession }
}

export function markPaperSubmitted(submission: NonNullable<ReturnType<typeof preparePaperSubmission>>): void {
  if (submission.session !== draftSession) return
  const stored = loadDraftsFromLocalStorage()
  let storageChanged = false
  for (const [id, revision] of submission.revisions) {
    const current = drafts.value[id]
    if (current && current.editRevision === revision) current.editRevision = null
    const cached = stored?.[id]
    if (cached && cached.editRevision === revision && revision !== null) {
      cached.editRevision = null
      storageChanged = true
    }
  }
  if (storageChanged) localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(stored))
}

let restoreClient: ReturnType<typeof createApollo> | null = null
function getRestoreClient(): ReturnType<typeof createApollo> {
  return (restoreClient ??= createApollo())
}

const GET_PAPER_V2 = gql`
  query ($voteToken: String!) {
    getPaperV2(voteToken: $voteToken)
  }
`

// getPaperV2 返回扁平 snake_case 行,映射回各草稿。
function applyPaperRows(rows: any[]): void {
  const restored = new Map<number, LocalDraft>()
  for (const row of rows) {
    if (row == null) continue
    const questionnaireId = Number(row.questionnaire_id)
    const draft = drafts.value[questionnaireId]
    if (!draft || typeof draft.editRevision === 'string') continue
    let candidate = restored.get(questionnaireId)
    if (!candidate) {
      candidate = { ...draft, groups: draft.groups.map(group => ({ ...group })) }
      restored.set(questionnaireId, candidate)
    }
    const groupDraft = candidate.groups.find((group) => group.groupId === Number(row.group_id))
    if (!groupDraft) continue
    if (row.active_question_id != null) groupDraft.activeQuestionId = Number(row.active_question_id)
    groupDraft.selectedOptionIds = Array.isArray(row.selected_option_ids)
      ? row.selected_option_ids.map(Number)
      : []
    groupDraft.input = typeof row.input_text === 'string' ? row.input_text : ''
  }
  for (const questionnaire of questionnaires.value) {
    const id = questionnaire.id
    const candidate = restored.get(id)
    if (!candidate) continue
    const local = drafts.value[id]
    const saved = reconcileDraft(questionnaire, candidate)
    // 旧缓存没有编辑版本。存在差异时保留本地答案，以免升级时丢失草稿。
    if (local.editRevision === undefined && JSON.stringify(local.groups) !== JSON.stringify(saved.groups)) {
      local.editRevision = newEditRevision()
    } else {
      drafts.value[id] = { ...saved, editRevision: null }
    }
  }
}

// 启动时回填已提交的答案，保留有未提交修改的整份问卷。
export async function restorePaperV2(token: string): Promise<void> {
  const session = draftSession
  await structureReady
  if (session !== draftSession || !questionnaires.value.length || !token) return
  ensureAnswerState()
  try {
    const res = await getRestoreClient().query<{ getPaperV2: unknown }>({
      query: GET_PAPER_V2,
      variables: { voteToken: token },
      fetchPolicy: 'network-only',
    })
    if (session !== draftSession) return
    const rows = res.data?.getPaperV2
    if (Array.isArray(rows) && rows.length > 0) {
      applyPaperRows(rows)
      persistDrafts()
      return
    }
    // 后端无数据且本地有草稿 → 保留本地,不再写回
  } catch (err) {
    console.error('[questionnaireV2] getPaperV2 回填失败,fallback 本地草稿:', err)
  }
}
