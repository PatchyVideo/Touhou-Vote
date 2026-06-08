export interface QuestionnaireOptionV2 {
  id: number
  content: string
  relatedQuestionIds: number[]
  mutexOptionIds: number[]
  optionGroup: number
}

export interface QuestionnaireQuestionV2 {
  id: number
  type: 'Single' | 'Multiple' | 'Input'
  content: string
  introduction: string
  maxInputLen?: number
  options: QuestionnaireOptionV2[]
}

export interface QuestionnaireGroupV2 {
  id: number
  order: number
  hiddenByDefault: boolean
  questions: QuestionnaireQuestionV2[]
}

export interface QuestionnaireDefinitionV2 {
  id: number
  key: string
  title: string
  introduction: string
  category: 'main' | 'extra'
  required: boolean
  order: number
  questionGroups: QuestionnaireGroupV2[]
}

export interface QuestionnaireStructureResponse {
  questionnaires: QuestionnaireDefinitionV2[]
}

export interface QuestionnaireGroupAnswerDraftV2 {
  groupId: number
  activeQuestionId: number | null
  selectedOptionIds: number[]
  input: string
}

export interface QuestionnaireAnswerDraftV2 {
  questionnaireId: number
  groups: QuestionnaireGroupAnswerDraftV2[]
}

// Keyed by questionnaire id
export type QuestionnaireDrafts = Record<number, QuestionnaireAnswerDraftV2>

// Flat submit payload
export interface QuestionnaireAnswerRowV2 {
  questionnaireId: number
  groupId: number
  activeQuestionId: number | null
  selectedOptionIds: number[]
  input: string
}
