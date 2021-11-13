import { ref, computed } from 'vue'
import { questionnaire, QuestionnaireALL } from '@/questionnaire/lib/questionnaire'

interface Answer {
  // 选择的问题ID，默认为改题目序号对应的题库中的第一个题目,ID的含义参考文件“questionnaire.ts”
  id: number
  // 选择题选择的选项的ID
  options: number[]
  // 填空题的内容
  input: string
  done?: boolean
  [key: string]: string | number | number[] | boolean | undefined
}
interface AnswerQuestionnaire {
  // 问卷ID，ID的含义参考文件“questionnaire.ts”
  id: number
  // 问卷的答案
  answers: Answer[]
  [key: string]: number | Answer[]
}
interface MainQuestionnaire {
  requiredQuestionnaire: AnswerQuestionnaire
  // optionalQuestionnaire1: AnswerQuestionnaire
  // optionalQuestionnaire2: AnswerQuestionnaire
  [key: string]: AnswerQuestionnaire
}
interface QuestionnaireData {
  mainQuestionnaire: MainQuestionnaire
  [key: string]: MainQuestionnaire
}

// 获取一级问卷
function IDToBigQuestionnaire(ID: number): string {
  ID = Number(String(ID).substring(0, 1))
  if (ID === 1) return 'mainQuestionnaire'
  else return 'extraQuestionnaire'
}

// 获取二级问卷
function IDToSmallQuestionnaire(ID: number): string {
  ID = Number(String(ID).substring(0, 2))
  switch (ID) {
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
function resetAnswer(answerID: number) {
  return {
    id: answerID,
    input: '',
    options: [],
  }
}

export const questionnaireData = ref<QuestionnaireData>({
  mainQuestionnaire: {
    requiredQuestionnaire: {
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

export const questionnaireComputed = ref<QuestionnaireALL>(computeQuestionnaire())

// 根据用户的投票数据计算出的问卷数据
export function computeQuestionnaire(): QuestionnaireALL {
  const questionnaireReturn: QuestionnaireALL = JSON.parse(JSON.stringify(questionnaire))
  for (const bigQuestionnaire in questionnaire) {
    for (const smallQuestionnaire in questionnaire[bigQuestionnaire]) {
      for (const questionLibrary of questionnaire[bigQuestionnaire][smallQuestionnaire].questions) {
        if (!questionLibrary.length) return questionnaireReturn
        // 此题库下对应的问题的答案
        const answerTarget = questionnaireData.value[bigQuestionnaire][smallQuestionnaire].answers.find((answer) =>
          IsInSameQuestionLibrary(answer.id, questionLibrary[0].id)
        )
        // 此题库下对应答案的问题
        const questionTarget = questionLibrary.find((question) => question.id === answerTarget?.id)
        if (!answerTarget?.options.length || !questionTarget) continue
        for (const option of answerTarget.options) {
          const questionOption = questionTarget.options.find((item) => item.id === option)
          if (!questionOption) continue
          for (const relatedQuestionID of questionOption.related) {
            // 如果选择的选项有相关问题（related属性里的题目ID），则将相关问题所在题库中的所有不相关的题目删除掉
            questionnaireReturn[IDToBigQuestionnaire(relatedQuestionID)][
              IDToSmallQuestionnaire(relatedQuestionID)
            ].questions[IDToQuestionLibrary(relatedQuestionID)] = questionnaireReturn[
              IDToBigQuestionnaire(relatedQuestionID)
            ][IDToSmallQuestionnaire(relatedQuestionID)].questions[IDToQuestionLibrary(relatedQuestionID)].filter(
              (question) => question.id === relatedQuestionID
            )
            // 如果不相关的题目已经回答过了，则删除回答的数据
            const indexOfRelatedQuestionID = questionnaireData.value[bigQuestionnaire][
              smallQuestionnaire
            ].answers.findIndex(
              (answer) => IsInSameQuestionLibrary(answer.id, relatedQuestionID) && answer.id != relatedQuestionID
            )
            if (indexOfRelatedQuestionID != -1)
              questionnaireData.value[bigQuestionnaire][smallQuestionnaire].answers[indexOfRelatedQuestionID] =
                resetAnswer(relatedQuestionID)
          }
          for (const mutexOptionID of questionOption.mutex) {
            // 如果选择的选项有互斥选项（mutex属性里的选项ID），则将mutex中的选项从其所在问题中删除掉
            questionnaireReturn[IDToBigQuestionnaire(mutexOptionID)][IDToSmallQuestionnaire(mutexOptionID)].questions[
              IDToQuestionLibrary(mutexOptionID)
            ][IDToQuestionLibraryNumber(mutexOptionID)].options = questionnaireReturn[
              IDToBigQuestionnaire(mutexOptionID)
            ][IDToSmallQuestionnaire(mutexOptionID)].questions[IDToQuestionLibrary(mutexOptionID)][
              IDToQuestionLibraryNumber(mutexOptionID)
            ].options.filter((option) => option.id != mutexOptionID)
            // 如果已经选过mutex中的选项了，则将该选项从答案中删除
            questionnaireData.value[bigQuestionnaire][smallQuestionnaire].answers.map((answer) => {
              if (IsInSameQuestionLibrary(Math.floor(mutexOptionID / 100), answer.id)) {
                answer.options = answer.options.filter((item) => item != mutexOptionID)
              }
            })
          }
        }
      }
    }
  }
  return questionnaireReturn
}

// 用户的投票情况
export const questionDone = computed(() => {
  const questiondone = questionnaireData.value
  for (const bigQuestionnaire in questionnaireData.value)
    for (const smallQuestionnaire in questionnaireData.value[bigQuestionnaire])
      questiondone[bigQuestionnaire][smallQuestionnaire].answers = questionnaireData.value[bigQuestionnaire][
        smallQuestionnaire
      ].answers.map((answer) => {
        answer.done = answer.input != '' || Boolean(answer.options.length)
        return answer
      })

  return questiondone
})
