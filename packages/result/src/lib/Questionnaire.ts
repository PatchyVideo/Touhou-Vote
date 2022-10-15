import { questionnaire } from '@touhou-vote/shared/data/questionnaire'

export const allQuestionnaireIDList = computed<string[]>(() => {
  const IDList: string[] = []
  for (const bigQuestionnaire in questionnaire) {
    for (const smallQuestionnaire in questionnaire[bigQuestionnaire]) {
      for (const questionLibrary of questionnaire[bigQuestionnaire][smallQuestionnaire].questions) {
        for (const question of questionLibrary) {
          if (question.id % 10 != 0) IDList.push('q' + question.id)
        }
      }
    }
  }
  return IDList
})

interface Question {
  id: string
  question: string
  type: 'Single' | 'Multiple' | 'Input'
  options: {
    id: number
    content: string
  }[]
}
function IDToBigQuestionnaire(ID: string): string {
  const IDNum = Number(ID.substring(0, 1))
  if (IDNum === 1) return 'mainQuestionnaire'
  else return 'extraQuestionnaire'
}
function IDToSmallQuestionnaire(ID: string): string {
  const IDNum = Number(ID.substring(0, 2))
  switch (IDNum) {
    case 11:
      return 'requiredQuestionnaire'
    case 12:
      return 'optionalQuestionnaire1'
    case 13:
      return 'optionalQuestionnaire2'
    case 21:
      return 'exQuestionnaire1'
    case 22:
      return 'exQuestionnaire2'
    case 23:
      return 'exQuestionnaire3'
    case 24:
      return 'exQuestionnaire4'
    case 25:
      return 'exQuestionnaire5'
    default:
      return ''
  }
}
function IDToQuestionLibrary(ID: string): number {
  return Number(ID.substring(2, 4)) - 1
}
export function findQuestionWithQuestionID(QuestionID: string): Question {
  return {
    id:
      String(
        questionnaire[IDToBigQuestionnaire(QuestionID)][IDToSmallQuestionnaire(QuestionID)].questions[
          IDToQuestionLibrary(QuestionID)
        ].find((item) => item.id === Number(QuestionID))?.id
      ) || '00000',
    question:
      questionnaire[IDToBigQuestionnaire(QuestionID)][IDToSmallQuestionnaire(QuestionID)].questions[
        IDToQuestionLibrary(QuestionID)
      ].find((item) => item.id === Number(QuestionID))?.question || '被遗忘的问题 ～ Error Occured',
    type:
      questionnaire[IDToBigQuestionnaire(QuestionID)][IDToSmallQuestionnaire(QuestionID)].questions[
        IDToQuestionLibrary(QuestionID)
      ].find((item) => item.id === Number(QuestionID))?.type || 'Input',
    options:
      questionnaire[IDToBigQuestionnaire(QuestionID)][IDToSmallQuestionnaire(QuestionID)].questions[
        IDToQuestionLibrary(QuestionID)
      ]
        .find((item) => item.id === Number(QuestionID))
        ?.options.map((item) => {
          return {
            id: item.id,
            content: item.content,
          }
        }) || [],
  }
}
