<template>
  <div class="w-full space-y-3">
    <div>编辑须知: 1. 问题列表第1个问题的id的最后一位</div>
    <div class="w-full p-3 rounded-xl">
      <div v-for="(bigQuestionnaire, bigQuestionnaireName) in questionnaireCopy" :key="bigQuestionnaireName">
        <div class="border-b">{{ bigQuestionnaireName }}</div>
        <div
          v-for="(smallQuestionnaire, smallQuestionnaireName) in bigQuestionnaire"
          :key="smallQuestionnaire.id"
          class="p-3"
        >
          <div>{{ '问卷名: ' }} <input v-model="smallQuestionnaire.name" /></div>
          <div>{{ 'id: ' + smallQuestionnaire.id }}</div>
          <div>{{ '介绍: ' }}</div>
          <textarea v-model="smallQuestionnaire.introduction" />
          <div>{{ '问题库: 共' + smallQuestionnaire.questions.length + '个问题' }}</div>
          <div
            v-for="(questionLibrary, questionLibraryIndex) in smallQuestionnaire.questions"
            :key="questionLibraryIndex"
            class="p-3 border border-accent-color-300"
          >
            <div class="flex items-center justify-between">
              <div>{{ '问题列表' + (questionLibraryIndex + 1) + ': ' }}</div>
              <button
                @click="
                  addQuestion(
                    bigQuestionnaireName as string,
                    smallQuestionnaireName as string,
                    questionLibraryIndex,
                    -1
                  )
                "
              >
                插入第一个问题
              </button>
            </div>
            <div v-for="(question, questionIndex) in questionLibrary" class="p-3 space-y-2 border">
              <div>{{ '问题' + (questionIndex + 1) }}</div>
              <div>{{ 'id: ' + question.id }}</div>
              <div>{{ '种类(Single, Multiple, Input): ' }} <input style="width: auto" v-model="question.type" /></div>
              <div>{{ '问题名：' }} <input style="width: auto" v-model="question.question" /></div>
              <div v-if="question.type != 'Input'">
                <div class="flex items-center justify-between">
                  <div>选项</div>
                  <button
                    @click="
                      addOption(
                        bigQuestionnaireName as string,
                        smallQuestionnaireName as string,
                        questionLibraryIndex,
                        questionIndex,
                        -1
                      )
                    "
                  >
                    添加第一个选项
                  </button>
                </div>
                <div v-for="(option, optionIndex) in question.options" :key="option.id" class="p-3 border space-y-2">
                  <div>
                    {{ '选项' + (optionIndex + 1) + ': ' }}<input style="width: auto" v-model="option.content" />
                  </div>
                  <div>{{ '选项组: ' }}<input style="width: auto" v-model="option.group" /></div>
                  <div>{{ 'id: ' + option.id }}</div>
                  <div v-if="option.related.length">
                    <div style="color: green">{{ '关联问题: ' + getRelatedQuestions(option.related) }}</div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div>编辑关联问题:</div>
                    <div v-for="relatedQuestionID in option.related" class="p-1 border">
                      {{ relatedQuestionID }}
                      <label
                        class="text-red-600 hover:text-red-700 cursor-pointer"
                        @click="
                          deleteRelatedQuestion(
                            bigQuestionnaireName as string,
                            smallQuestionnaireName as string,
                            questionLibraryIndex,
                            questionIndex,
                            optionIndex,
                            relatedQuestionID
                          )
                        "
                      >
                        删除
                      </label>
                    </div>
                    <input type="number" v-model="relatedQuestionIDAdded" />
                    <button
                      @click="
                        addRelatedQuestion(
                          bigQuestionnaireName as string,
                          smallQuestionnaireName as string,
                          questionLibraryIndex,
                          questionIndex,
                          optionIndex
                        )
                      "
                    >
                      添加
                    </button>
                  </div>
                  <div v-if="option.mutex.length">
                    <div style="color: red">{{ '互斥选项: ' + getMutexOptions(option.mutex) }}</div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div>编辑互斥选项:</div>
                    <div v-for="mutexOptionID in option.mutex" class="p-1 border">
                      {{ mutexOptionID }}
                      <label
                        class="text-red-600 hover:text-red-700 cursor-pointer"
                        @click="
                          deleteMutexOption(
                            bigQuestionnaireName as string,
                            smallQuestionnaireName as string,
                            questionLibraryIndex,
                            questionIndex,
                            optionIndex,
                            mutexOptionID
                          )
                        "
                      >
                        删除
                      </label>
                    </div>
                    <input type="number" v-model="mutexOptionIDAdded" />
                    <button
                      @click="
                        addMutexOptionID(
                          bigQuestionnaireName as string,
                          smallQuestionnaireName as string,
                          questionLibraryIndex,
                          questionIndex,
                          optionIndex
                        )
                      "
                    >
                      添加
                    </button>
                  </div>
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="
                        addOption(
                          bigQuestionnaireName as string,
                          smallQuestionnaireName as string,
                          questionLibraryIndex,
                          questionIndex,
                          optionIndex
                        )
                      "
                    >
                      向下添加选项
                    </button>
                    <button
                      @click="
                        deleteOption(
                          bigQuestionnaireName as string,
                          smallQuestionnaireName as string,
                          questionLibraryIndex,
                          questionIndex,
                          optionIndex
                        )
                      "
                    >
                      删除选项
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  @click="
                    addQuestion(
                      bigQuestionnaireName as string,
                      smallQuestionnaireName as string,
                      questionLibraryIndex,
                      questionIndex
                    )
                  "
                >
                  向下添加问题
                </button>
                <button
                  @click="
                    deleteQuestion(
                      bigQuestionnaireName as string,
                      smallQuestionnaireName as string,
                      questionLibraryIndex,
                      questionIndex
                    )
                  "
                >
                  删除问题
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <label
      class="fixed right-5 bottom-5 w-50 text-center py-5 bg-accent-color-600 text-white cursor-pointer"
      @click="sendOutQuestionnaire()"
    >
      导出问卷&答题卡数据
    </label>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { questionnaire } from '@@/../shared/data/questionnaire'
import type { QuestionnaireALL, Question } from '@@/../shared/data/questionnaire'

setSiteTitle('测试界面')

// 修改的问卷数据
const questionnaireCopy = ref<QuestionnaireALL>(getQuestionnaireCopy())
// 每次数据修改都会存到local storage
watch(
  questionnaireCopy,
  () => {
    localStorage.setItem('questionnaireCopy', JSON.stringify(questionnaireCopy.value))
  },
  { deep: true }
)
function getQuestionnaireCopy() {
  // const questionnaireCopyLocal: QuestionnaireALL[] = JSON.parse(localStorage.getItem('questionnaireCopy') || '{}')
  // if (JSON.stringify(questionnaireCopyLocal) != '{}') {
  //   return questionnaireCopyLocal
  // } else return JSON.parse(JSON.stringify(questionnaire))
  return JSON.parse(JSON.stringify(questionnaire))
}

const relatedQuestionIDAdded = ref<number>()
const mutexOptionIDAdded = ref<number>()
// 展示选项的相关问题
function getRelatedQuestions(ids: number[]) {
  let relatedQuestions = ''
  for (const id of ids) {
    let idFounded = false
    for (const bigQuestionnaire in questionnaireCopy.value)
      for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
        for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
          for (const question of questionLibrary)
            if (question.id === id) {
              relatedQuestions += question.question + '(id: ' + question.id + '); '
              idFounded = true
            }
    if (!idFounded) {
      relatedQuestions += '【【ID: ' + id + '未找到对应问题！！！】】'
    }
  }
  return relatedQuestions
}
// 展示选项的互斥选项
function getMutexOptions(ids: number[]) {
  let mutexOptions = ''
  for (const id of ids) {
    let idFounded = false
    for (const bigQuestionnaire in questionnaireCopy.value)
      for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
        for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
          for (const question of questionLibrary) {
            for (const option of question.options)
              if (option.id === id) {
                mutexOptions +=
                  option.content +
                  '(选项id:' +
                  option.id +
                  '), 来自问题"' +
                  question.question +
                  '(id: ' +
                  question.id +
                  ')"; '
                idFounded = true
              }
          }
    if (!idFounded) {
      mutexOptions += '【【ID: ' + id + '未找到对应选项！！！】】'
    }
  }
  return mutexOptions
}
// 删除选项的相关问题
function deleteRelatedQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number,
  relatedQuestionID: number
) {
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][questionIndex].options[
    optionIndex
  ].related = questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options[optionIndex].related.filter((item) => item != relatedQuestionID)
}
// 添加选项的相关问题
function addRelatedQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number
) {
  if (relatedQuestionIDAdded.value)
    questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
      questionIndex
    ].options[optionIndex].related.push(relatedQuestionIDAdded.value)
  relatedQuestionIDAdded.value = undefined
}
// 删除选项的互斥选项
function deleteMutexOption(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number,
  mutexOptionID: number
) {
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][questionIndex].options[
    optionIndex
  ].mutex = questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options[optionIndex].mutex.filter((item) => item != mutexOptionID)
}
// 添加选项的互斥选项
function addMutexOptionID(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number
) {
  if (mutexOptionIDAdded.value)
    questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
      questionIndex
    ].options[optionIndex].mutex.push(mutexOptionIDAdded.value)
  mutexOptionIDAdded.value = undefined
}

// 添加选项, optionIndex === -1 时添加第一个选项
function addOption(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number
) {
  const newOption = {
    id:
      questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][questionIndex].id *
        100 +
      (optionIndex + 2),
    related: [],
    mutex: [],
    content: '',
    group: 0,
  }
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options.splice(optionIndex + 1, 0, newOption)
  refreshOptionID()
}
// 删除选项
function deleteOption(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number
) {
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options.splice(optionIndex, 1)
  refreshOptionID()
}
// 刷新选项ID
function refreshOptionID() {
  for (const bigQuestionnaire in questionnaireCopy.value)
    for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
      for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
        for (const question of questionLibrary)
          question.options.map((item, index) => {
            item.id = question.id * 100 + (index + 1)
            return item
          })
}

// 生成默认问题模板
function DefaultQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number
): Question {
  return {
    id:
      questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].id * 1000 +
      (questionLibraryIndex + 1) * 10 +
      (questionIndex + 2),
    type: 'Input',
    question: '被遗忘的问题 ～ Error Occured',
    introduction: '',
    input: '',
    options: [],
  }
}
// 添加问题列表里的问题, questionIndex === -1 时添加第一个问题
function addQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number
) {
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex].splice(
    questionIndex + 1,
    0,
    DefaultQuestion(bigQuestionnaire, smallQuestionnaire, questionLibraryIndex, questionIndex)
  )
  refreshQuestionID()
}
// 删除问题列表里的问题
function deleteQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number
) {
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex].splice(questionIndex, 1)
  refreshQuestionID()
}
// 刷新问题ID
function refreshQuestionID() {
  for (const bigQuestionnaire in questionnaireCopy.value)
    for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
      for (let i = 0; i < questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions.length; i++)
        for (let j = 0; j < questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[i].length; j++) {
          if (questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[i][0].id % 10 === 0)
            questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[i][j].id =
              questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].id * 1000 + (i + 1) * 10 + j
          else
            questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[i][j].id =
              questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].id * 1000 + (i + 1) * 10 + (j + 1)
        }
  refreshOptionID()
}

// 添加问题库里的问题列表

// 校验问卷合法性
function checkQuestionnaire(): boolean {
  // Single，Multiple，Input校验
  // 删除input类型问题里所有的选项
  // 校验所有选项内容不为空
  // 校验所有选项的选项组为大于等于0的整数
  // 校验所有的related是否合法（拥有对应问题）
  // 校验所有的mutex是否合法（拥有对应选项）
  // 校验非input类型选项列表不为空
  // 校验问题库里的某一个问题列表不为空
  return true
}
// 输出问卷JSON
function sendOutQuestionnaire() {
  const json: QuestionnaireALL = JSON.parse(JSON.stringify(questionnaireCopy.value))

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'application/json' }))
  a.download = 'Questionnaire.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  sendOutAnswerData()
}

// 输出答题卡JSON
function sendOutAnswerData() {
  // 生成答题卡JSON
  let answerData: Record<string, any> = {}
  for (const bigQuestionnaire in questionnaireCopy.value) {
    Object.assign(answerData, { [bigQuestionnaire]: {} })
    for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire]) {
      Object.assign(answerData[bigQuestionnaire], { [smallQuestionnaire]: {} })
      Object.assign(answerData[bigQuestionnaire][smallQuestionnaire], {
        id: questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].id,
      })
      Object.assign(answerData[bigQuestionnaire][smallQuestionnaire], {
        answers: [],
      })
      for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions) {
        answerData[bigQuestionnaire][smallQuestionnaire].answers.push({
          id: questionLibrary[0].id,
          options: [],
          input: '',
        })
      }
    }
  }
  const b = document.createElement('a')
  b.href = URL.createObjectURL(new Blob([JSON.stringify(answerData)], { type: 'application/json' }))
  b.download = 'AnswerData.json'
  document.body.appendChild(b)
  b.click()
  document.body.removeChild(b)
}
</script>
<style lang="postcss" scoped>
div {
  @apply text-black;
}
input,
textarea {
  @apply px-1 ring ring-accent-color-300;
}
input {
  @apply min-w-150;
}
textarea {
  @apply w-full;
}
button {
  @apply px-3 py-1;
}
</style>
