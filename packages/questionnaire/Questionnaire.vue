<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center justify-between bg-white">
      <div class="font-medium">
        {{ questionaireName }}
      </div>
      <icon-uil-align-justify class="inline align-middle w-7 text-lg text-center cursor-pointer" />
    </div>
    <div class="w-full h-1 flex mb-1">
      <div
        v-for="(answer, index) in questionDone[bigQuestionaire][smallQuestionaire].answers"
        :key="index"
        class="h-full"
        :class="[
          answer.done ? 'bg-accent-color-600' : 'bg-accent-color-100',
          'w-1/' + questionDone[bigQuestionaire][smallQuestionaire].answers.length,
        ]"
      ></div>
    </div>

    <div class="w-full flex flex-col space-y-3 p-1">
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="space-y-5 p-2">
          <div>{{ questionNum + 1 + '：' + question.content + '（' + TypeToChinese[question.type] + '）' }}</div>
          <div class="rounded bg-gray-50 bg-opacity-50 space-y-4">
            <div v-for="option in options" :key="option.id">
              <VoteCheckBox
                :check="answerData.find((answer) => answer === option.id) != undefined"
                :read-only="true"
                class="mr-2"
              />{{ option.content }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between space-x-2">
        <button class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base">上一题</button>
        <button class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base">下一题</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { questionaireComputed, questionaireData, questionDone } from '@/questionnaire/lib/questionaireData'
import { useRoute, useRouter } from 'vue-router'
import VoteCheckBox from '@/common/components/VoteCheckBox.vue'

const route = useRoute()
const router = useRouter()

const bigQuestionaire = computed<'mainQuestionaire' | 'extraQuestionaire'>(() => {
  let big = String(
    route.query.bigQuestionaire
      ? Array.isArray(route.query.bigQuestionaire)
        ? route.query.bigQuestionaire[0]
        : route.query.bigQuestionaire
      : 'mainQuestionaire'
  )
  return big === 'mainQuestionaire' || big === 'extraQuestionaire' ? big : 'mainQuestionaire'
})
const smallQuestionaire = computed<
  'requiredQuestionaire' | 'optionalQuestionaire1' | 'optionalQuestionaire2' | 'exQuestionaire1'
>(() => {
  let small = String(
    route.query.smallQuestionaire
      ? Array.isArray(route.query.smallQuestionaire)
        ? route.query.smallQuestionaire[0]
        : route.query.smallQuestionaire
      : 'mainQuestionaire'
  )
  return small === 'requiredQuestionaire' ||
    small === 'optionalQuestionaire1' ||
    small === 'optionalQuestionaire2' ||
    small === 'exQuestionaire1'
    ? small
    : 'requiredQuestionaire'
})
const questionaireName = computed<string>(
  () => questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].name
)
const questionNum = computed<number>(() =>
  Number(route.query.number ? (Array.isArray(route.query.number) ? route.query.number[0] : route.query.number) : 0)
)
interface Question {
  content: string
  id: number
  type: 'Single' | 'Multiple' | 'Input'
}
const question = computed<Question>(() => {
  return {
    content:
      questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[questionNum.value][0]
        .question,
    id: questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[questionNum.value][0].id,
    type: questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[questionNum.value][0]
      .type,
  }
})
const TypeToChinese = {
  Single: '单选',
  Multiple: '多选',
  Input: '',
}
interface Option {
  content: string
  id: number
}
const options = computed<Option[]>(() =>
  questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[
    questionNum.value
  ][0].options.map((option) => {
    return {
      content: option.content,
      id: option.id,
    }
  })
)
const answerData = computed<number[]>(
  () =>
    questionaireData.value[bigQuestionaire.value][smallQuestionaire.value].answers.find(
      (answer) => answer.id === question.value.id
    )?.options || []
)
</script>

<style lang="postcss" scoped></style>
