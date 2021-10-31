import { ref } from 'vue'
import { questionaire, QuestionaireALL } from '@/questionnaire/lib/questionaire'

interface Answer {
  // 选择的问题ID，默认为改题目序号对应的题库中的第一个题目,ID的含义参考文件“questionnaire.ts”
  id: number
  // 选择题选择的选项的ID
  options: number[]
  // 填空题的内容
  input: string
  [key: string]: string | number | number[]
}
interface AnswerQuestionaire {
  // 问卷ID，ID的含义参考文件“questionnaire.ts”
  id: number
  // 问卷的答案
  answers: Answer[]
  [key: string]: number | Answer[]
}
interface MainQuestionaire {
  requiredQuestionaire: AnswerQuestionaire
  // optionalQuestionaire1: AnswerQuestionaire
  // optionalQuestionaire2: AnswerQuestionaire
  [key: string]: AnswerQuestionaire
}
interface QuestionaireData {
  mainQuestionaire: MainQuestionaire
  [key: string]: MainQuestionaire
}
function IDToBigQuestionaire(ID: number): string {
  while (ID > 10) {
    ID = Math.floor(ID / 10)
  }
  if (ID === 1) return 'mainQuestionaire'
  else return 'extraQuestionaire'
}
function IDToSmallQuestionaire(ID: number): string {
  while (ID > 100) {
    ID = Math.floor(ID / 10)
  }
  switch (ID) {
    case 11:
      return 'requiredQuestionaire'
    case 12:
      return 'optionalQuestionaire1'
    case 13:
      return 'optionalQuestionaire2'
    case 21:
      return 'exQuestionaire1'
    case 22:
      return 'exQuestionaire2'
    case 23:
      return 'exQuestionaire3'
    case 24:
      return 'exQuestionaire4'
    default:
      return ''
  }
}
function IDToQuestionLibrary(ID: number): number {
  while (ID > 1000) {
    ID = Math.floor(ID / 10)
  }
  return Math.floor(ID / 100)
}

export const questionaireData = ref<QuestionaireData>({
  mainQuestionaire: {
    requiredQuestionaire: {
      id: 11,
      answers: [
        {
          id: 11011,
          options: [],
          input: '',
        },
        {
          id: 11021,
          options: [],
          input: '',
        },
        {
          id: 11031,
          options: [],
          input: '',
        },
      ],
    },
  },
})

export const questionaireComputed = ref<QuestionaireALL>(computeQuestionaire())

// 根据用户的投票数据计算出的问卷数据
export function computeQuestionaire(): QuestionaireALL {
  const questionaireReturn = questionaire
  for (const bigQuestionaire in questionaire) {
    for (const smallQuestionaire in questionaire[bigQuestionaire]) {
      for (const questionLibrary of questionaire[bigQuestionaire][smallQuestionaire].questions) {
        if (!questionLibrary.length) return questionaireReturn
        const answerTarget = questionaireData.value[bigQuestionaire][smallQuestionaire].answers.find(
          (answer) => Math.floor(answer.id / 10) === Math.floor(questionLibrary[0].id / 10)
        )
        const questionTarget = questionLibrary.find((question) => question.id === answerTarget?.id)
        if (!answerTarget?.options || !questionTarget) continue
        for (const option of answerTarget.options) {
          for (const relatedQuestionID of questionTarget.options[option].related) {
            questionaire[IDToBigQuestionaire(relatedQuestionID)][IDToSmallQuestionaire(relatedQuestionID)].questions
          }
        }
      }
    }
  }
  return questionaireReturn
}
