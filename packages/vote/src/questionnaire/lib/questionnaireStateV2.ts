// V2 问卷响应式引擎:从后端拉取结构 + 复用 questionnaireV2Parser 规则引擎 + 草稿持久化。
// 取代旧版 questionnaireData.ts 在问卷流程中的地位(旧版保留为休眠文件)。
import { computed, ref } from 'vue'
import type {
  QuestionnaireAnswerDraftV2,
  QuestionnaireAnswerStateV2,
  QuestionnaireDefinitionAllV2,
  QuestionnaireDefinitionV2,
} from '@touhou-vote/shared/data/questionnaireV2'
import { createQuestionnaireAnswerStateV2 } from '@touhou-vote/shared/data/questionnaireV2'
import {
  normalizeQuestionnaireDraftV2,
  parseQuestionnaireRuntimeV2,
  setQuestionInputV2,
  toggleQuestionOptionV2,
} from '@/questionnaire/lib/questionnaireV2Parser'
import type { QuestionnaireRuntimeV2 } from '@/questionnaire/lib/questionnaireV2Parser'
import { voteYear } from '@/common/lib/voteYear'
import { createApollo, gql } from '@/graphql'

export type BigKey = 'mainQuestionnaire' | 'extraQuestionnaire'
export type MainSmallKey = 'requiredQuestionnaire' | 'optionalQuestionnaire1' | 'optionalQuestionnaire2'
export type ExtraSmallKey =
  | 'exQuestionnaire1'
  | 'exQuestionnaire2'
  | 'exQuestionnaire3'
  | 'exQuestionnaire4'
  | 'exQuestionnaire5'
export type SmallKey = MainSmallKey | ExtraSmallKey

const MAIN_SLOTS: MainSmallKey[] = ['requiredQuestionnaire', 'optionalQuestionnaire1', 'optionalQuestionnaire2']
const EXTRA_SLOTS: ExtraSmallKey[] = [
  'exQuestionnaire1',
  'exQuestionnaire2',
  'exQuestionnaire3',
  'exQuestionnaire4',
  'exQuestionnaire5',
]

export const ALL_SLOTS: { big: BigKey; small: SmallKey }[] = [
  ...MAIN_SLOTS.map((small) => ({ big: 'mainQuestionnaire' as BigKey, small })),
  ...EXTRA_SLOTS.map((small) => ({ big: 'extraQuestionnaire' as BigKey, small })),
]

// questionnaire_id ↔ 槽位:11=必填,12=官作,13=二创,21~25=ex1~ex5(回填用)
export const SLOT_BY_QUESTIONNAIRE_ID: Record<number, { big: BigKey; small: SmallKey }> = {
  11: { big: 'mainQuestionnaire', small: 'requiredQuestionnaire' },
  12: { big: 'mainQuestionnaire', small: 'optionalQuestionnaire1' },
  13: { big: 'mainQuestionnaire', small: 'optionalQuestionnaire2' },
  21: { big: 'extraQuestionnaire', small: 'exQuestionnaire1' },
  22: { big: 'extraQuestionnaire', small: 'exQuestionnaire2' },
  23: { big: 'extraQuestionnaire', small: 'exQuestionnaire3' },
  24: { big: 'extraQuestionnaire', small: 'exQuestionnaire4' },
  25: { big: 'extraQuestionnaire', small: 'exQuestionnaire5' },
}

const LOCALSTORAGE_KEY = 'questionnaireDataLocalV2'
const SESSIONSTORAGE_KEY = `questionnaireStructureV2:${voteYear}`
const STRUCTURE_URL = `/v11-be/questionnaire/structure?vote_year=${voteYear}`

// ---------------- 结构 ----------------
export const definitionAll = ref<QuestionnaireDefinitionAllV2 | null>(null)
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
          definitionAll.value = JSON.parse(cached) as QuestionnaireDefinitionAllV2
          ensureAnswerState()
          return
        }
      }
      const res = await fetch(STRUCTURE_URL, { credentials: 'include' })
      if (!res.ok) throw new Error(`structure HTTP ${res.status}`)
      const json = (await res.json()) as QuestionnaireDefinitionAllV2
      definitionAll.value = json
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
export const answerState = ref<QuestionnaireAnswerStateV2 | null>(null)

function reconcileState(state: QuestionnaireAnswerStateV2): QuestionnaireAnswerStateV2 {
  // 用当前结构归一化每个槽位草稿(结构可能已变);单槽出错不影响其它槽位。
  for (const { big, small } of ALL_SLOTS) {
    const def = getDefinition(big, small)
    if (!def) continue
    const draft = (state as any)[big][small] as QuestionnaireAnswerDraftV2
    try {
      ;(state as any)[big][small] = normalizeQuestionnaireDraftV2(def, draft)
    } catch (err) {
      console.error(`[questionnaireV2] 归一化 ${big}.${small} 失败:`, err)
    }
  }
  return state
}

export function ensureAnswerState(): void {
  if (!definitionAll.value) return
  if (!answerState.value) {
    const fromLocal = loadDraftsFromLocalStorage()
    answerState.value = reconcileState(fromLocal ?? createQuestionnaireAnswerStateV2(definitionAll.value))
  } else {
    answerState.value = reconcileState(answerState.value)
  }
  persistDrafts()
}

export function getDefinition(big: BigKey, small: SmallKey): QuestionnaireDefinitionV2 | null {
  if (!definitionAll.value) return null
  return ((definitionAll.value as any)[big]?.[small] as QuestionnaireDefinitionV2) ?? null
}

export function getDraft(big: BigKey, small: SmallKey): QuestionnaireAnswerDraftV2 | null {
  if (!answerState.value) return null
  return ((answerState.value as any)[big]?.[small] as QuestionnaireAnswerDraftV2) ?? null
}

function setDraft(big: BigKey, small: SmallKey, draft: QuestionnaireAnswerDraftV2): void {
  if (!answerState.value) return
  ;(answerState.value as any)[big][small] = draft
  persistDrafts()
}

// ---------------- 运行时(复用 parser) ----------------
export type RuntimeAll = Record<BigKey, Record<string, QuestionnaireRuntimeV2 | null>>

export const runtimeAll = computed<RuntimeAll | null>(() => {
  if (!definitionAll.value || !answerState.value) return null
  const result: RuntimeAll = { mainQuestionnaire: {}, extraQuestionnaire: {} }
  for (const { big, small } of ALL_SLOTS) {
    const def = getDefinition(big, small)
    const draft = getDraft(big, small)
    if (!def || !draft) {
      result[big][small] = null
      continue
    }
    try {
      result[big][small] = parseQuestionnaireRuntimeV2(def, draft)
    } catch (err) {
      console.error(`[questionnaireV2] 解析运行时 ${big}.${small} 失败:`, err)
      result[big][small] = null
    }
  }
  return result
})

export function getRuntime(big: BigKey, small: SmallKey): QuestionnaireRuntimeV2 | null {
  return runtimeAll.value?.[big]?.[small] ?? null
}

// ---------------- 变更(写回 + 持久化) ----------------
export function toggleOption(big: BigKey, small: SmallKey, groupId: number, optionId: number): void {
  const def = getDefinition(big, small)
  const draft = getDraft(big, small)
  if (!def || !draft) return
  setDraft(big, small, toggleQuestionOptionV2(def, draft, groupId, optionId))
}

export function setInput(big: BigKey, small: SmallKey, groupId: number, input: string): void {
  const def = getDefinition(big, small)
  const draft = getDraft(big, small)
  if (!def || !draft) return
  setDraft(big, small, setQuestionInputV2(def, draft, groupId, input))
}

// ---------------- 完成判定(仅本地预判,权威以后端为准) ----------------
export function isQuestionnaireDoneV2(big: BigKey, small: SmallKey): boolean {
  return getRuntime(big, small)?.done ?? false
}

// 复刻 V1 规则:必填完成 且 (官作/二创任一完成) 且 (ex1~5 任一完成)。
export const isQuestionnaireAllDoneV2 = computed<boolean>(() => {
  const required = isQuestionnaireDoneV2('mainQuestionnaire', 'requiredQuestionnaire')
  const optional =
    isQuestionnaireDoneV2('mainQuestionnaire', 'optionalQuestionnaire1') ||
    isQuestionnaireDoneV2('mainQuestionnaire', 'optionalQuestionnaire2')
  const extra = EXTRA_SLOTS.some((small) => isQuestionnaireDoneV2('extraQuestionnaire', small))
  return required && optional && extra
})

// 是否第一次完成全部问卷(用于提交成功弹窗的引导文案)
export const firstCompleteQuestionnaireAll = ref(true)

// 槽位名称(供切换抽屉/首页使用)
export const questionnaireKeyToNameV2 = computed<{ bigQuestionnaire: BigKey; smallQuestionnaire: SmallKey; name: string }[]>(
  () =>
    ALL_SLOTS.map(({ big, small }) => ({
      bigQuestionnaire: big,
      smallQuestionnaire: small,
      name: getDefinition(big, small)?.name ?? '',
    })).filter((item) => item.name !== '')
)

// ---------------- 持久化 ----------------
export function persistDrafts(): void {
  if (!answerState.value) return
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(answerState.value))
}

export function loadDraftsFromLocalStorage(): QuestionnaireAnswerStateV2 | null {
  const raw = localStorage.getItem(LOCALSTORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as QuestionnaireAnswerStateV2
    if (parsed && parsed.mainQuestionnaire && parsed.extraQuestionnaire) return parsed
    return null
  } catch {
    return null
  }
}

export function clearQuestionnaireV2LocalData(): void {
  localStorage.removeItem(LOCALSTORAGE_KEY)
  sessionStorage.removeItem(SESSIONSTORAGE_KEY)
  answerState.value = null
}

// ---------------- 提交 / 回填(后端) ----------------
// 返回归一化后的答案状态快照,直接作为 submitPaperV2 的 answers(契约即此 camelCase 形状)。
export function buildAnswerStatePayload(): QuestionnaireAnswerStateV2 | null {
  if (!answerState.value || !definitionAll.value) return null
  const snapshot = JSON.parse(JSON.stringify(answerState.value)) as QuestionnaireAnswerStateV2
  return reconcileState(snapshot)
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

// getPaperV2 返回扁平 snake_case 行,映射回各槽位草稿。
function applyPaperRows(rows: any[]): void {
  if (!answerState.value) return
  for (const row of rows) {
    if (row == null) continue
    if (row.vote_year != null && Number(row.vote_year) !== voteYear) continue
    const slot = SLOT_BY_QUESTIONNAIRE_ID[Number(row.questionnaire_id)]
    if (!slot) continue
    const draft = getDraft(slot.big, slot.small)
    if (!draft) continue
    const groupDraft = draft.groups.find((group) => group.groupId === Number(row.group_id))
    if (!groupDraft) continue
    if (row.active_question_id != null) groupDraft.activeQuestionId = Number(row.active_question_id)
    groupDraft.selectedOptionIds = Array.isArray(row.selected_option_ids)
      ? row.selected_option_ids.map(Number)
      : []
    groupDraft.input = typeof row.input_text === 'string' ? row.input_text : ''
  }
  answerState.value = reconcileState(answerState.value)
}

// 启动时回填(于 checkLoginStatus 内触发)。本地已有草稿则不覆盖,与 V1 一致。
export async function restorePaperV2(token: string): Promise<void> {
  await structureReady
  if (!definitionAll.value || !token) return
  const hadLocalDraft = !!localStorage.getItem(LOCALSTORAGE_KEY)
  ensureAnswerState()
  if (hadLocalDraft) return
  try {
    const res = await getRestoreClient().query<{ getPaperV2: unknown }>({
      query: GET_PAPER_V2,
      variables: { voteToken: token },
      fetchPolicy: 'network-only',
    })
    const rows = res.data?.getPaperV2
    if (!Array.isArray(rows)) return
    applyPaperRows(rows)
    persistDrafts()
  } catch (err) {
    console.error('[questionnaireV2] getPaperV2 回填失败:', err)
  }
}
