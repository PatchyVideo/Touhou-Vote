// V2 问卷响应式引擎:从后端拉取结构(平铺数组) + 复用 questionnaireV2Parser 规则引擎 + 草稿持久化。
import { computed, ref } from 'vue'
import type {
  QuestionnaireAnswerDraftV2,
  QuestionnaireAnswerRowV2,
  QuestionnaireDefinitionV2,
  QuestionnaireDrafts,
} from '@touhou-vote/shared/data/questionnaireV2'
import type { QuestionnaireStructureResponse } from '@touhou-vote/shared/data/questionnaireV2'
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

function markStructureReady(): void {
  if (!structureReadyResolved) {
    structureReadyResolved = true
    resolveStructureReady()
  }
}

export function loadQuestionnaireStructure(force = false): Promise<void> {
  if (loadPromise && !force) return loadPromise

  loadPromise = (async () => {
    structureLoading.value = true
    structureError.value = null
    try {
      if (!force) {
        const cached = sessionStorage.getItem(SESSIONSTORAGE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached) as QuestionnaireStructureResponse
          questionnaires.value = parsed.questionnaires
          ensureAnswerState()
          return
        }
      }
      const res = await fetch(STRUCTURE_URL, { credentials: 'include' })
      if (!res.ok) throw new Error(`structure HTTP ${res.status}`)
      const json = (await res.json()) as QuestionnaireStructureResponse
      questionnaires.value = json.questionnaires
      sessionStorage.setItem(SESSIONSTORAGE_KEY, JSON.stringify(json))
      ensureAnswerState()
    } catch (err) {
      structureError.value = err instanceof Error ? err.message : String(err)
      console.error('[questionnaireV2] 拉取结构失败,进入降级模式:', err)
    } finally {
      structureLoading.value = false
      markStructureReady()
    }
  })()

  return loadPromise
}

// ---------------- 答案状态 ----------------
export const drafts = ref<QuestionnaireDrafts>({})

function createEmptyDraft(questionnaire: QuestionnaireDefinitionV2): QuestionnaireAnswerDraftV2 {
  return {
    questionnaireId: questionnaire.id,
    groups: questionnaire.questionGroups.map((group) => ({
      groupId: group.id,
      activeQuestionId: null,
      selectedOptionIds: [],
      input: '',
    })),
  }
}

function reconcileDraft(definition: QuestionnaireDefinitionV2, draft: QuestionnaireAnswerDraftV2): QuestionnaireAnswerDraftV2 {
  try {
    return normalizeQuestionnaireDraftV2(definition, draft)
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
export function toggleOption(questionnaireId: number, groupId: number, optionId: number): void {
  const questionnaire = questionnaires.value.find((q) => q.id === questionnaireId)
  const draft = drafts.value[questionnaireId]
  if (!questionnaire || !draft) return
  drafts.value[questionnaireId] = toggleQuestionOptionV2(questionnaire, draft, groupId, optionId)
  persistDrafts()
}

export function setInput(questionnaireId: number, groupId: number, input: string): void {
  const questionnaire = questionnaires.value.find((q) => q.id === questionnaireId)
  const draft = drafts.value[questionnaireId]
  if (!questionnaire || !draft) return
  drafts.value[questionnaireId] = setQuestionInputV2(questionnaire, draft, groupId, input)
  persistDrafts()
}

// ---------------- 完成判定(仅本地预判,权威以后端为准) ----------------
export function isQuestionnaireDoneV2(questionnaireId: number): boolean {
  return getRuntime(questionnaireId)?.done ?? false
}

// 所有 required=true 的问卷完成即视为全部完成
export const isQuestionnaireAllDoneV2 = computed<boolean>(() => {
  return questionnaires.value.filter((q) => q.required).every((q) => getRuntime(q.id)?.done ?? false)
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

export function loadDraftsFromLocalStorage(): QuestionnaireDrafts | null {
  const raw = localStorage.getItem(LOCALSTORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    // Validate it's an object with numeric keys (flat Record<number, draft>)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as QuestionnaireDrafts
    }
    return null
  } catch {
    return null
  }
}

export function clearQuestionnaireV2LocalData(): void {
  localStorage.removeItem(LOCALSTORAGE_KEY)
  sessionStorage.removeItem(SESSIONSTORAGE_KEY)
  drafts.value = {}
}

// ---------------- 提交 / 回填(后端) ----------------
// 返回扁平行数组,直接作为 submitPaperV2 的 answers。
export function buildAnswerStatePayload(): QuestionnaireAnswerRowV2[] | null {
  if (!questionnaires.value.length) return null
  const rows: QuestionnaireAnswerRowV2[] = []
  for (const questionnaire of questionnaires.value) {
    const draft = drafts.value[questionnaire.id]
    if (!draft) continue
    for (const group of questionnaire.questionGroups) {
      const groupDraft = draft.groups.find((g) => g.groupId === group.id)
      rows.push({
        questionnaireId: questionnaire.id,
        groupId: group.id,
        activeQuestionId: groupDraft?.activeQuestionId ?? null,
        selectedOptionIds: groupDraft?.selectedOptionIds ?? [],
        input: groupDraft?.input ?? '',
      })
    }
  }
  return rows
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
  for (const row of rows) {
    if (row == null) continue
    const questionnaireId = Number(row.questionnaire_id)
    const draft = drafts.value[questionnaireId]
    if (!draft) continue
    const groupDraft = draft.groups.find((group) => group.groupId === Number(row.group_id))
    if (!groupDraft) continue
    if (row.active_question_id != null) groupDraft.activeQuestionId = Number(row.active_question_id)
    groupDraft.selectedOptionIds = Array.isArray(row.selected_option_ids)
      ? row.selected_option_ids.map(Number)
      : []
    groupDraft.input = typeof row.input_text === 'string' ? row.input_text : ''
  }
  // Re-normalize all questionnaires after restore
  for (const questionnaire of questionnaires.value) {
    const draft = drafts.value[questionnaire.id]
    if (!draft) continue
    drafts.value[questionnaire.id] = reconcileDraft(questionnaire, draft)
  }
}

// 启动时回填(于 checkLoginStatus 内触发)。优先后端,本地草稿仅在后端空时兜底。
export async function restorePaperV2(token: string): Promise<void> {
  await structureReady
  if (!questionnaires.value.length || !token) return
  ensureAnswerState()
  try {
    const res = await getRestoreClient().query<{ getPaperV2: unknown }>({
      query: GET_PAPER_V2,
      variables: { voteToken: token },
      fetchPolicy: 'network-only',
    })
    const rows = res.data?.getPaperV2
    if (Array.isArray(rows) && rows.length > 0) {
      // 后端有数据则以之为准,清掉本地草稿
      applyPaperRows(rows)
      persistDrafts()
      return
    }
    // 后端无数据且本地有草稿 → 保留本地,不再写回
  } catch (err) {
    console.error('[questionnaireV2] getPaperV2 回填失败,fallback 本地草稿:', err)
  }
}
