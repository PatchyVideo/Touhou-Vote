import type {
  QuestionnaireAnswerDraftV2,
  QuestionnaireAnswerStateV2,
  QuestionnaireDefinitionAllV2,
  QuestionnaireDefinitionV2,
  QuestionnaireQuestionV2,
} from '@touhou-vote/shared/data/questionnaireV2'
import { questionnaireV2 } from '@touhou-vote/shared/data/questionnaireV2'
import { normalizeQuestionnaireDraftV2 } from './questionnaireV2Parser'
import { getQuestionnaireData } from './questionnaireData'

export type LegacyPaperJson = ReturnType<typeof getQuestionnaireData>

function findQuestionById(definition: QuestionnaireDefinitionV2, questionId: number | null): QuestionnaireQuestionV2 | null {
  if (questionId == null) return null

  for (const group of definition.questionGroups) {
    const question = group.questions.find((item) => item.id === questionId)
    if (question) return question
  }

  return null
}

function hiddenQuestionIdFromGroupId(groupId: number): number {
  return groupId * 10
}

function serializeQuestionnaireDraftToLegacyAnswers(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2,
  legacyAnswers: LegacyPaperJson['mainQuestionnaire']['requiredQuestionnaire']['answers']
) {
  const normalizedDraft = normalizeQuestionnaireDraftV2(definition, draft)

  for (const answer of legacyAnswers) {
    const groupId = Math.floor(answer.id / 10)
    const groupDraft = normalizedDraft.groups.find((group) => group.groupId === groupId)
    if (!groupDraft) continue

    const activeQuestion = findQuestionById(definition, groupDraft.activeQuestionId)

    if (!activeQuestion || groupDraft.activeQuestionId == null) {
      answer.id = hiddenQuestionIdFromGroupId(groupId)
      answer.options = []
      answer.input = ''
      continue
    }

    answer.id = groupDraft.activeQuestionId
    answer.options = activeQuestion.type === 'Input' ? [] : [...groupDraft.selectedOptionIds].sort()
    answer.input = activeQuestion.type === 'Input' ? groupDraft.input : ''
  }
}

export function serializeQuestionnaireAnswerStateV2ToPaperJson(
  state: QuestionnaireAnswerStateV2,
  source: QuestionnaireDefinitionAllV2 = questionnaireV2
): LegacyPaperJson {
  const paperJson = getQuestionnaireData()

  serializeQuestionnaireDraftToLegacyAnswers(
    source.mainQuestionnaire.requiredQuestionnaire,
    state.mainQuestionnaire.requiredQuestionnaire,
    paperJson.mainQuestionnaire.requiredQuestionnaire.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.mainQuestionnaire.optionalQuestionnaire1,
    state.mainQuestionnaire.optionalQuestionnaire1,
    paperJson.mainQuestionnaire.optionalQuestionnaire1.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.mainQuestionnaire.optionalQuestionnaire2,
    state.mainQuestionnaire.optionalQuestionnaire2,
    paperJson.mainQuestionnaire.optionalQuestionnaire2.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.extraQuestionnaire.exQuestionnaire1,
    state.extraQuestionnaire.exQuestionnaire1,
    paperJson.extraQuestionnaire.exQuestionnaire1.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.extraQuestionnaire.exQuestionnaire2,
    state.extraQuestionnaire.exQuestionnaire2,
    paperJson.extraQuestionnaire.exQuestionnaire2.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.extraQuestionnaire.exQuestionnaire3,
    state.extraQuestionnaire.exQuestionnaire3,
    paperJson.extraQuestionnaire.exQuestionnaire3.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.extraQuestionnaire.exQuestionnaire4,
    state.extraQuestionnaire.exQuestionnaire4,
    paperJson.extraQuestionnaire.exQuestionnaire4.answers
  )
  serializeQuestionnaireDraftToLegacyAnswers(
    source.extraQuestionnaire.exQuestionnaire5,
    state.extraQuestionnaire.exQuestionnaire5,
    paperJson.extraQuestionnaire.exQuestionnaire5.answers
  )

  return paperJson
}
