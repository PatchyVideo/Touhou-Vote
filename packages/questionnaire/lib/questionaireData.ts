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

// 获取一级问卷
function IDToBigQuestionaire(ID: number): string {
  ID = Number(String(ID).substring(0, 1))
  if (ID === 1) return 'mainQuestionaire'
  else return 'extraQuestionaire'
}

// 获取二级问卷
function IDToSmallQuestionaire(ID: number): string {
  ID = Number(String(ID).substring(0, 2))
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

// 获取问题库编号（数组索引用，即第三、四位ID-1）
function IDToQuestionLibrary(ID: number): number {
  return Number(String(ID).substring(2, 4)) - 1
}

// 获取问题的在问题库中的编号（数组索引用，即第五位ID-1）
function IDToQuestionLibraryNumber(ID: number): number {
  return Number(String(ID).substring(4, 5)) - 1
}

// 匹配两个ID是否在同一个问题库里，ID要求5位ID
function IsInSameQuestionLibrary(ID1: number, ID2: number) {
  return Math.floor(ID1 / 10) === Math.floor(ID2 / 10)
}

// 重置问题答案
function resetAnswer(answer: Answer, answerID: number) {
  return {
    id: answerID,
    input: '',
    options: [],
  }
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
        {
          id: 11041,
          options: [],
          input: '',
        },
        {
          id: 11051,
          options: [],
          input: '',
        },
        {
          id: 11061,
          options: [],
          input: '',
        },
        {
          id: 11071,
          options: [],
          input: '',
        },
        {
          id: 11081,
          options: [],
          input: '',
        },
        {
          id: 11091,
          options: [],
          input: '',
        },
        {
          id: 11101,
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
        const answerTarget = questionaireData.value[bigQuestionaire][smallQuestionaire].answers.find((answer) =>
          IsInSameQuestionLibrary(answer.id, questionLibrary[0].id)
        )
        const questionTarget = questionLibrary.find((question) => question.id === answerTarget?.id)
        if (!answerTarget?.options || !questionTarget) continue
        for (const option of answerTarget.options) {
          for (const relatedQuestionID of questionTarget.options[option].related) {
            questionaireReturn[IDToBigQuestionaire(relatedQuestionID)][
              IDToSmallQuestionaire(relatedQuestionID)
            ].questions[IDToQuestionLibrary(relatedQuestionID)] = questionaireReturn[
              IDToBigQuestionaire(relatedQuestionID)
            ][IDToSmallQuestionaire(relatedQuestionID)].questions[IDToQuestionLibrary(relatedQuestionID)].filter(
              (question) => question.id == option
            )
            questionaireData.value[bigQuestionaire][smallQuestionaire].answers.map((answer) => {
              if (IsInSameQuestionLibrary(answer.id, option)) {
                answer = resetAnswer(answer, option)
              }
            })
          }
          for (const mutexOptionID of questionTarget.options[option].mutex) {
            questionaireReturn[IDToBigQuestionaire(mutexOptionID)][IDToSmallQuestionaire(mutexOptionID)].questions[
              IDToQuestionLibrary(mutexOptionID)
            ][IDToQuestionLibraryNumber(mutexOptionID)].options = questionaireReturn[
              IDToBigQuestionaire(mutexOptionID)
            ][IDToSmallQuestionaire(mutexOptionID)].questions[IDToQuestionLibrary(mutexOptionID)][
              IDToQuestionLibraryNumber(mutexOptionID)
            ].options.filter((option) => option.id != mutexOptionID)
            questionaireData.value[bigQuestionaire][smallQuestionaire].answers.map((answer) => {
              if (IsInSameQuestionLibrary(Math.floor(mutexOptionID / 100), answer.id)) {
                answer.options = answer.options.filter((item) => item != mutexOptionID)
              }
            })
          }
        }
      }
    }
  }
  return questionaireReturn
}
