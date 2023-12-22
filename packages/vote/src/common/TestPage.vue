<template>
  <div class="w-full space-y-3">
    <!-- <button @click="questionnaireEditToolOpen = !questionnaireEditToolOpen">问卷编辑界面</button> -->
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
            <div>{{ '问题列表' + questionLibraryIndex + ': ' }}</div>
            <div v-for="(question, questionIndex) in questionLibrary" class="p-3 space-y-2 border">
              <div>{{ '问题' + questionIndex }}</div>
              <div>{{ 'id: ' + question.id }}</div>
              <div>{{ '种类(Single, Multiple, Input): ' }} <input style="width: auto" v-model="question.type" /></div>
              <div>{{ '问题名：' }} <input style="width: auto" v-model="question.question" /></div>
              <div v-if="question.type != 'Input'">
                <div>{{ '选项: ' }}</div>
                <div v-for="(option, optionIndex) in question.options" :key="option.id" class="p-3 border space-y-2">
                  <div>{{ '选项' + optionIndex + ': ' }}<input style="width: auto" v-model="option.content" /></div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <label
      class="fixed right-5 bottom-5 bg-accent-color-600 text-white p-10 cursor-pointer"
      @click="sendOutQuestionnaire()"
    >
      导出数据
    </label>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { questionnaire } from '@@/../shared/data/questionnaire'
import type { QuestionnaireALL } from '@@/../shared/data/questionnaire'

setSiteTitle('测试界面')

const questionnaireEditToolOpen = ref(true)

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

// 获取选项的相关问题
function getQuestionnaireCopy() {
  const questionnaireCopyLocal: QuestionnaireALL[] = JSON.parse(localStorage.getItem('questionnaireCopy') || '{}')
  if (JSON.stringify(questionnaireCopyLocal) != '{}') {
    return questionnaireCopyLocal
  } else return JSON.parse(JSON.stringify(questionnaire))
}
const relatedQuestionIDAdded = ref<number>()
const mutexOptionIDAdded = ref<number>()
function getRelatedQuestions(ids: number[]) {
  let relatedQuestions = ''
  for (const id of ids) {
    for (const bigQuestionnaire in questionnaireCopy.value)
      for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
        for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
          for (const question of questionLibrary) {
            if (question.id === id) relatedQuestions += question.question + '(id: ' + question.id + '); '
          }
  }
  return relatedQuestions
}
// 获取选项的互斥选项
function getMutexOptions(ids: number[]) {
  let mutexOptions = ''
  for (const id of ids) {
    for (const bigQuestionnaire in questionnaireCopy.value)
      for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
        for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
          for (const question of questionLibrary) {
            for (const option of question.options)
              if (option.id === id)
                mutexOptions +=
                  option.content +
                  '(选项id:' +
                  option.id +
                  '), 来自问题"' +
                  question.question +
                  '(id: ' +
                  question.id +
                  ')"; '
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

// 向下添加选项
function addOption(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number,
  optionIndex: number
) {
  const newOption = {
    id: questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][questionIndex]
      .options[optionIndex].id,
    related: [],
    mutex: [],
    content: '',
  }
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options.splice(optionIndex + 1, 0, newOption)
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options.map((item, index) => {
    if (index > optionIndex) item.id += 1
  })
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
  questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions[questionLibraryIndex][
    questionIndex
  ].options.map((item, index) => {
    if (index >= optionIndex) item.id -= 1
  })
}
// 刷新选项ID
function refreshOptionID() {
  for (const bigQuestionnaire in questionnaireCopy.value)
    for (const smallQuestionnaire in questionnaireCopy.value[bigQuestionnaire])
      for (const questionLibrary of questionnaireCopy.value[bigQuestionnaire][smallQuestionnaire].questions)
        for (const question of questionLibrary)
          question.options.map((item, index) => {
            item.id = question.id * 100 + index
            return item
          })
}

// 向下添加问题列表里的问题
function addQuestion(
  bigQuestionnaire: string,
  smallQuestionnaire: string,
  questionLibraryIndex: number,
  questionIndex: number
) {}
// 添加问题列表里的第一个问题
function addFirstQuestion() {}
// 刷新问题ID

// 添加问题库里的问题列表

// 校验问卷合法性
function checkQuestionnaire() {
  // Single，Multiple，Input校验
  // 删除input类型问题里所有的选项
  // 校验所有选项内容不为空
  // 校验所有的related是否合法（拥有对应问题）
  // 校验所有的mutex是否合法（拥有对应选项）
  // 校验非input类型问题库不为空
}
// 输出问卷JSON
function sendOutQuestionnaire() {
  const json: QuestionnaireALL = JSON.parse(JSON.stringify(questionnaireCopy.value))

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'application/json' }))
  a.download = 'CharacterWork.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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
