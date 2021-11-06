<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - 角色部门</div>
    </div>

    <div class="w-full flex-grow flex p-1">
      <div class="flex-grow p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="flex justify-between py-1 border-b-1 border-gray-500">
          <div>{{ questionaireName }}</div>
          <div class="px-2">▼</div>
        </div>
        <div class="space-y-5">
          <div>{{ question.content }}</div>
          <div class="p-2 rounded bg-gray-50 bg-opacity-50 space-y-4">
            <div
              v-for="option in options"
              :key="option.id"
              :class="{ 'shadow-inner': answerData.find((answer) => answer === option.id) }"
            >
              {{ '● ' + option.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { questionaireComputed, questionaireData } from '@/questionnaire/lib/questionaireData'
import { useRoute, useRouter } from 'vue-router'

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
const questionNum = computed<number>(() =>
  Number(route.query.number ? (Array.isArray(route.query.number) ? route.query.number[0] : route.query.number) : 0)
)

const questionaireName = computed<string>(
  () => questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].name
)
interface Question {
  content: string
  id: number
}
const question = computed<Question>(() => {
  return {
    content:
      questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[questionNum.value][0]
        .question,
    id: questionaireComputed.value[bigQuestionaire.value][smallQuestionaire.value].questions[questionNum.value][0].id,
  }
})
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
console.log(answerData.value)
</script>

<style lang="postcss" scoped></style>
