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
  const questionaireReturn = {}
  for (const bigQuestionaire in questionaire) {
    for (const smallQuestionaire in questionaire[bigQuestionaire]) {
      for (const question in questionaire[bigQuestionaire][smallQuestionaire]) {
        console.log('1')
      }
    }
  }
  return questionaireReturn
}
