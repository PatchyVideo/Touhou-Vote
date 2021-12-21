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
  optionalQuestionnaire1: AnswerQuestionnaire
  optionalQuestionnaire2: AnswerQuestionnaire
  [key: string]: AnswerQuestionnaire
}
interface ExtraQuestionnaire {
  exQuestionnaire1: AnswerQuestionnaire
  exQuestionnaire2: AnswerQuestionnaire
  exQuestionnaire3: AnswerQuestionnaire
  exQuestionnaire4: AnswerQuestionnaire
  exQuestionnaire5: AnswerQuestionnaire
  [key: string]: AnswerQuestionnaire
}
interface QuestionnaireData {
  mainQuestionnaire: MainQuestionnaire
  extraQuestionnaire: ExtraQuestionnaire
  [key: string]: MainQuestionnaire | ExtraQuestionnaire
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
    case 25:
      return 'exQuestionnaire5'
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

// 判断该问题（的答案）是否是无效问题（即第五位ID为0）
function IsVaildQuestion(ID: number): boolean {
  return Boolean(ID % 10)
}

// 匹配两个ID是否在同一个问题库里，ID要求5位ID
function IsInSameQuestionLibrary(ID1: number, ID2: number): boolean {
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

export function getQuestionnaireData(): QuestionnaireData {
  return {
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
      optionalQuestionnaire1: {
        id: 12,
        answers: [
          {
            id: 12011,
            options: [],
            input: '',
          },
          {
            id: 12021,
            options: [],
            input: '',
          },
          {
            id: 12031,
            options: [],
            input: '',
          },
          {
            id: 12041,
            options: [],
            input: '',
          },
          {
            id: 12051,
            options: [],
            input: '',
          },
          {
            id: 12061,
            options: [],
            input: '',
          },
          {
            id: 12071,
            options: [],
            input: '',
          },
          {
            id: 12081,
            options: [],
            input: '',
          },
          {
            id: 12091,
            options: [],
            input: '',
          },
          {
            id: 12101,
            options: [],
            input: '',
          },
          {
            id: 12111,
            options: [],
            input: '',
          },
          {
            id: 12121,
            options: [],
            input: '',
          },
        ],
      },
      optionalQuestionnaire2: {
        id: 13,
        answers: [
          {
            id: 13011,
            options: [],
            input: '',
          },
          {
            id: 13021,
            options: [],
            input: '',
          },
          {
            id: 13031,
            options: [],
            input: '',
          },
          {
            id: 13041,
            options: [],
            input: '',
          },
          {
            id: 13050,
            options: [],
            input: '',
          },
          {
            id: 13060,
            options: [],
            input: '',
          },
          {
            id: 13070,
            options: [],
            input: '',
          },
          {
            id: 13081,
            options: [],
            input: '',
          },
          {
            id: 13090,
            options: [],
            input: '',
          },
          {
            id: 13100,
            options: [],
            input: '',
          },
          {
            id: 13110,
            options: [],
            input: '',
          },
          {
            id: 13121,
            options: [],
            input: '',
          },
          {
            id: 13131,
            options: [],
            input: '',
          },
          {
            id: 13141,
            options: [],
            input: '',
          },
        ],
      },
    },
    extraQuestionnaire: {
      exQuestionnaire1: {
        id: 21,
        answers: [
          {
            id: 21011,
            options: [],
            input: '',
          },
          {
            id: 21021,
            options: [],
            input: '',
          },
          {
            id: 21031,
            options: [],
            input: '',
          },
          {
            id: 21041,
            options: [],
            input: '',
          },
          {
            id: 21051,
            options: [],
            input: '',
          },
          {
            id: 21061,
            options: [],
            input: '',
          },
          {
            id: 21071,
            options: [],
            input: '',
          },
        ],
      },
      exQuestionnaire2: {
        id: 22,
        answers: [
          {
            id: 22011,
            options: [],
            input: '',
          },
          {
            id: 22021,
            options: [],
            input: '',
          },
          {
            id: 22031,
            options: [],
            input: '',
          },
          {
            id: 22041,
            options: [],
            input: '',
          },
          {
            id: 22051,
            options: [],
            input: '',
          },
          {
            id: 22061,
            options: [],
            input: '',
          },
          {
            id: 22071,
            options: [],
            input: '',
          },
          {
            id: 22081,
            options: [],
            input: '',
          },
        ],
      },
      exQuestionnaire3: {
        id: 23,
        answers: [
          {
            id: 23011,
            options: [],
            input: '',
          },
          {
            id: 23021,
            options: [],
            input: '',
          },
          {
            id: 23031,
            options: [],
            input: '',
          },
          {
            id: 23041,
            options: [],
            input: '',
          },
          {
            id: 23051,
            options: [],
            input: '',
          },
          {
            id: 23061,
            options: [],
            input: '',
          },
          {
            id: 23071,
            options: [],
            input: '',
          },
          {
            id: 23081,
            options: [],
            input: '',
          },
          {
            id: 23091,
            options: [],
            input: '',
          },
        ],
      },
      exQuestionnaire4: {
        id: 24,
        answers: [
          {
            id: 24011,
            options: [],
            input: '',
          },
          {
            id: 24021,
            options: [],
            input: '',
          },
          {
            id: 24031,
            options: [],
            input: '',
          },
          {
            id: 24041,
            options: [],
            input: '',
          },
          {
            id: 24051,
            options: [],
            input: '',
          },
          {
            id: 24060,
            options: [],
            input: '',
          },
          {
            id: 24071,
            options: [],
            input: '',
          },
          {
            id: 24080,
            options: [],
            input: '',
          },
          {
            id: 24091,
            options: [],
            input: '',
          },
          {
            id: 24101,
            options: [],
            input: '',
          },
        ],
      },
      exQuestionnaire5: {
        id: 25,
        answers: [
          {
            id: 25011,
            options: [],
            input: '',
          },
          {
            id: 25021,
            options: [],
            input: '',
          },
          {
            id: 25030,
            options: [],
            input: '',
          },
          {
            id: 25041,
            options: [],
            input: '',
          },
          {
            id: 25051,
            options: [],
            input: '',
          },
          {
            id: 25061,
            options: [],
            input: '',
          },
          {
            id: 25071,
            options: [],
            input: '',
          },
          {
            id: 25081,
            options: [],
            input: '',
          },
          {
            id: 25091,
            options: [],
            input: '',
          },
          {
            id: 25100,
            options: [],
            input: '',
          },
          {
            id: 25111,
            options: [],
            input: '',
          },
        ],
      },
    },
  }
}

export const questionnaireData = ref<QuestionnaireData>(getQuestionnaireDataFromLocalStorage())

export const questionnaireComputed = ref<QuestionnaireALL>(computeQuestionnaire())

// 根据用户的投票数据计算出的问卷数据
export function computeQuestionnaire(): QuestionnaireALL {
  const questionnaireReturn: QuestionnaireALL = JSON.parse(JSON.stringify(questionnaire))
  for (const bigQuestionnaire in questionnaire) {
    for (const smallQuestionnaire in questionnaire[bigQuestionnaire]) {
      for (const questionLibrary of questionnaire[bigQuestionnaire][smallQuestionnaire].questions) {
        if (!questionLibrary.length) continue
        // 此题库下对应的问题的答案
        const answerTarget = questionnaireData.value[bigQuestionnaire][smallQuestionnaire].answers.find((answer) =>
          IsInSameQuestionLibrary(answer.id, questionLibrary[0].id)
        )
        if (!answerTarget?.id) continue
        // 倘若是无效的问题，则清空题库
        if (!IsVaildQuestion(answerTarget.id)) {
          questionnaireReturn[IDToBigQuestionnaire(answerTarget.id)][IDToSmallQuestionnaire(answerTarget.id)].questions[
            IDToQuestionLibrary(answerTarget.id)
          ] = []
          continue
        }
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
            // 如果不相关的题目已经回答过了，则重置回答的数据
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
      // 删除空问题库
      questionnaireReturn[bigQuestionnaire][smallQuestionnaire].questions = questionnaireReturn[bigQuestionnaire][
        smallQuestionnaire
      ].questions.filter((item) => item.length)
    }
  }
  return questionnaireReturn
}

// 用户的投票情况
export const questionDone = computed<QuestionnaireData>(() => {
  const questiondone: QuestionnaireData = JSON.parse(JSON.stringify(questionnaireData.value))
  for (const bigQuestionnaire in questionnaireData.value)
    for (const smallQuestionnaire in questionnaireData.value[bigQuestionnaire])
      questiondone[bigQuestionnaire][smallQuestionnaire].answers = questiondone[bigQuestionnaire][
        smallQuestionnaire
      ].answers
        .map((answer) => {
          answer.done = answer.input != '' || Boolean(answer.options.length)
          return answer
        })
        .filter((answer) => IsVaildQuestion(answer.id))
  return questiondone
})

interface questionnaireList {
  bigQuestionnaire: string
  smallQuestionnaire: string
  name: string
  [key: string]: string
}

// 投票问卷的键名匹配名称
export const questionnaireKeyToName = computed<questionnaireList[]>(() => {
  const questionnaireKeyToName = []
  for (const bigQuestionnaire in questionnaire)
    for (const smallQuestionnaire in questionnaire[bigQuestionnaire]) {
      questionnaireKeyToName.push({
        bigQuestionnaire: bigQuestionnaire,
        smallQuestionnaire: smallQuestionnaire,
        name: questionnaire[bigQuestionnaire][smallQuestionnaire].name,
      })
    }
  return questionnaireKeyToName
})

// 获取未完成的问卷列表
export const getQuestionnaireUncomplete = computed<questionnaireList[]>(() => {
  const getQuestionnaireUncomplete: questionnaireList[] = []
  for (const bigQuestionnaire in questionDone.value)
    for (const smallQuestionnaire in questionDone.value[bigQuestionnaire]) {
      if (!IsQuestionnaireDone(bigQuestionnaire, smallQuestionnaire))
        getQuestionnaireUncomplete.push({
          bigQuestionnaire: bigQuestionnaire,
          smallQuestionnaire: smallQuestionnaire,
          name: questionnaire[bigQuestionnaire][smallQuestionnaire].name,
        })
    }
  return getQuestionnaireUncomplete
})

// 获取完成的问卷列表
export const getQuestionnaireComplete = computed<questionnaireList[]>(() =>
  questionnaireKeyToName.value.filter((item) =>
    getQuestionnaireUncomplete.value.findIndex((item2) => item2.name === item.name) === -1 ? true : false
  )
)

// 判断是否完成问卷
export function IsQuestionnaireDone(bigQuestionnaire: string, smallQuestionnaire: string): boolean {
  return (
    questionDone.value[bigQuestionnaire][smallQuestionnaire].answers.length ===
    questionDone.value[bigQuestionnaire][smallQuestionnaire].answers.filter((item) => item.done).length
  )
}

// 判断是否完全填写完成问卷
// 即主问卷：必填问卷完成，官作分问卷/二创分问卷二者选择至少一个填写
// 额外问卷：二创深入了解问卷/官作通关情况深入了解问卷/正版&盗版深入了解问卷/表示主办方附加问卷选择至少一个填写
export const IsQuestionnaireAllDone = computed<boolean>(() => {
  let flag = 0
  for (const smallQuestionnaire of getQuestionnaireComplete.value) {
    if (smallQuestionnaire.smallQuestionnaire === 'requiredQuestionnaire') {
      flag++
      break
    }
  }
  for (const smallQuestionnaire of getQuestionnaireComplete.value) {
    if (
      smallQuestionnaire.smallQuestionnaire === 'optionalQuestionnaire1' ||
      smallQuestionnaire.smallQuestionnaire === 'optionalQuestionnaire2'
    ) {
      flag++
      break
    }
  }
  for (const smallQuestionnaire of getQuestionnaireComplete.value) {
    if (
      smallQuestionnaire.smallQuestionnaire === 'exQuestionnaire1' ||
      smallQuestionnaire.smallQuestionnaire === 'exQuestionnaire2' ||
      smallQuestionnaire.smallQuestionnaire === 'exQuestionnaire3' ||
      smallQuestionnaire.smallQuestionnaire === 'exQuestionnaire4' ||
      smallQuestionnaire.smallQuestionnaire === 'exQuestionnaire5'
    ) {
      flag++
      break
    }
  }
  return flag === 3
})
// 是否是第一次完成问卷
export const firstCompleteQuestionnaireAll = ref(true)

// 从本地储存读取问卷数据
export function getQuestionnaireDataFromLocalStorage(): QuestionnaireData {
  const questionnaireDataLocal = JSON.parse(localStorage.getItem('questionnaireDataLocal') || '{}')
  if (JSON.stringify(questionnaireDataLocal) != '{}') {
    return questionnaireDataLocal
  } else return getQuestionnaireData()
}
