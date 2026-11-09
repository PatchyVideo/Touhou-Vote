import type {
  QuestionnaireDefinitionV2, QuestionnaireGroupV2, QuestionnaireOptionV2,
  QuestionnaireQuestionV2, QuestionnaireStructureResponse,
} from '../data/questionnaireV2'

export interface IndexedQuestion {
  questionnaire: QuestionnaireDefinitionV2
  group: QuestionnaireGroupV2
  question: QuestionnaireQuestionV2
}

export interface QuestionnaireIndex {
  questions: IndexedQuestion[]
  questionByCode: Map<string, IndexedQuestion>
  optionByCode: Map<string, QuestionnaireOptionV2>
  questionnaireByKey: Map<string, QuestionnaireDefinitionV2>
}

/** A view over the backend definition, never a second question bank. */
export function buildQuestionnaireIndex(structure: QuestionnaireStructureResponse): QuestionnaireIndex {
  const index: QuestionnaireIndex = {
    questions: [], questionByCode: new Map(), optionByCode: new Map(), questionnaireByKey: new Map(),
  }
  for (const questionnaire of structure.questionnaires) {
    index.questionnaireByKey.set(questionnaire.key, questionnaire)
    for (const group of questionnaire.questionGroups) {
      for (const question of group.questions) {
        const entry = { questionnaire, group, question }
        index.questions.push(entry)
        if (question.code) {
          if (index.questionByCode.has(question.code)) throw new Error(`题目编号重复：${question.code}`)
          index.questionByCode.set(question.code, entry)
        }
        for (const option of question.options) {
          if (!option.code) continue
          if (index.optionByCode.has(option.code)) throw new Error(`选项编号重复：${option.code}`)
          index.optionByCode.set(option.code, option)
        }
      }
    }
  }
  return index
}

/** Both applications supply their own existing API prefix. */
export async function fetchQuestionnaireStructure(
  url: string, init?: RequestInit,
): Promise<QuestionnaireStructureResponse> {
  const response = await fetch(url, { credentials: 'include', ...init })
  if (!response.ok) throw new Error(`questionnaire structure HTTP ${response.status}`)
  const data = await response.json()
  const validCode = (code: unknown) => code == null || typeof code === 'string'
  if (!Array.isArray(data?.questionnaires) || !data.questionnaires.every((qn: QuestionnaireDefinitionV2) =>
    qn && typeof qn.id === 'number' && typeof qn.key === 'string' && typeof qn.title === 'string' &&
    Array.isArray(qn.questionGroups) && qn.questionGroups.every((group) =>
      group && typeof group.id === 'number' && Array.isArray(group.questions) && group.questions.every((q) =>
        q && typeof q.id === 'number' && validCode(q.code) && typeof q.content === 'string' &&
        ['Single', 'Multiple', 'Input'].includes(q.type) && Array.isArray(q.options) && q.options.every((o) =>
          o && typeof o.id === 'number' && validCode(o.code) && typeof o.content === 'string' &&
          Array.isArray(o.relatedQuestionIds) && Array.isArray(o.mutexOptionIds)
        )
      )
    )
  )) throw new Error('问卷结构不完整，请检查后台定义')
  return data as QuestionnaireStructureResponse
}
