/** Result metadata comes exclusively from the backend question bank. */
import { computed, ref, shallowRef } from 'vue'
import {
  buildQuestionnaireIndex, fetchQuestionnaireStructure, type QuestionnaireIndex,
} from '@touhou-vote/shared/api/questionnaire'

export const questionnaireIndex = shallowRef<QuestionnaireIndex | null>(null)
export const questionnaireLoading = ref(false)
export const questionnaireError = ref<string | null>(null)
let inflight: Promise<QuestionnaireIndex> | null = null

export function ensureQuestionnaireStructure(): Promise<QuestionnaireIndex> {
  if (questionnaireIndex.value) return Promise.resolve(questionnaireIndex.value)
  if (inflight) return inflight
  questionnaireLoading.value = true
  questionnaireError.value = null
  inflight = fetchQuestionnaireStructure('/res-be/api/v1/questionnaire/structure')
    .then((tree) => {
      const index = buildQuestionnaireIndex(tree)
      questionnaireIndex.value = index
      return index
    })
    .catch((error) => {
      questionnaireError.value = error instanceof Error ? error.message : String(error)
      throw error
    })
    .finally(() => {
      questionnaireLoading.value = false
      inflight = null
    })
  return inflight
}

export const allQuestionnaireIDList = computed(() =>
  (questionnaireIndex.value?.questions ?? [])
    .filter(({ question }) => question.code)
    .map(({ question }) => 'q' + question.code)
)

export function qIDToID(qID: string): string {
  return qID.startsWith('q') ? qID.slice(1) : qID
}

export function findQuestionWithQuestionID(code: string) {
  const entry = questionnaireIndex.value?.questionByCode.get(qIDToID(code))
  if (!entry) return null
  return {
    id: entry.question.code!, question: entry.question.content, type: entry.question.type,
    options: entry.question.options.filter((o) => o.code).map((o) => ({ id: o.code!, content: o.content })),
  }
}

export function getSmallQuestionnaireChineseName(key: string): string {
  return questionnaireIndex.value?.questionnaireByKey.get(key)?.title ?? key
}

export interface QuestionStatistics {
  questionId: string
  answersCat: { aid: string; totalVotes: number; maleVotes: number; femaleVotes: number }[]
  totalAnswers: number
  totalMale: number
  totalFemale: number
}

/** Only call after a successful statistics response; errors are not zero votes. */
export function buildQuestionnaireResultItems(index: QuestionnaireIndex, entries: QuestionStatistics[]) {
  const statistics = new Map(entries.map((entry) => [qIDToID(entry.questionId), entry]))
  return index.questions.map(({ question }) => {
    const code = question.code || null
    const entry = code ? statistics.get(code) : undefined
    return {
      code,
      questionId: code ? 'q' + code : 'uncoded-' + question.id,
      question: question.content,
      type: question.type,
      hasUncodedOptions: question.options.some((option) => !option.code),
      answersCat: question.options.filter((option) => option.code).map((option) => {
        const answer = entry?.answersCat.find((item) => item.aid === option.code)
        return { aid: option.code!, content: option.content, totalVotes: answer?.totalVotes ?? 0,
          maleVotes: answer?.maleVotes ?? 0, femaleVotes: answer?.femaleVotes ?? 0 }
      }),
      totalAnswers: entry?.totalAnswers ?? 0,
      totalMale: entry?.totalMale ?? 0,
      totalFemale: entry?.totalFemale ?? 0,
    }
  }).sort((a, b) => (a.code ? Number(a.code) : Infinity) - (b.code ? Number(b.code) : Infinity))
}
