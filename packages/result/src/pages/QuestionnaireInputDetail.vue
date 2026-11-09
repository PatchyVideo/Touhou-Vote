<template>
  <div v-if="questionnaireLoading || loading" class="p-3">问卷回答加载中…</div>
  <div v-if="pageError" class="p-3">
    {{ pageError }} <button class="underline" @click="loadAnswers">重试</button>
  </div>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-center">
        <img
          src="https://asset.lilywhite.cc/thvote/imgs/nav/questionnaireDetail@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <div>
          <h2 class="text-3xl font-light">问卷回答</h2>
          <span class="text-xl hidden md:inline-block">{{ questionName }}</span>
        </div>
      </div>
      <span class="text-xl md:hidden">{{ questionName }}</span>

      <div v-if="answersReady" class="grid grid-cols-3 gap-1 text-sm md:text-base text-center">
        <div>
          <div>回答数</div>
          <div>{{ totalAnswers }}</div>
        </div>
        <div>
          <div>男性回答数</div>
          <div>{{ totalMale }}</div>
        </div>
        <div>
          <div>女性回答数</div>
          <div>{{ totalFemale }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="md:mx-5 p-3 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
    * 本页面列出所有投票的时候用户填写的问题内容<br />
    * 可使用 Ctrl + F 或 ⌘ + F 调出浏览器自带的搜索功能进行搜索
  </div>
  <div v-if="answersReady" class="md:mx-5 p-3 divide-y-1 divide-accent-300">
    <div class="text-2xl py-0.5 border-b border-accent-600">回答列表</div>
    <div v-if="!answersStr.length" class="py-2">暂无文本回答。</div>
    <div v-for="item in answersStr" :key="item" class="py-0.5 break-words">
      {{ item }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { voteStart, voteYear } from '@/lib/voteYear'
import { useRoute } from 'vue-router'
import { gql, useLazyQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import {
  ensureQuestionnaireStructure, findQuestionWithQuestionID, questionnaireLoading,
} from '@/lib/Questionnaire'
const route = useRoute()

const qid = computed(() =>
  String(route.query.qid ? (Array.isArray(route.query.qid) ? route.query.qid[0] : route.query.qid) : 'q11011')
)
const q = computed(() => String(route.query.q ? (Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : ''))
const questionName = ref('问卷回答')
const pageError = ref<string | null>(null)
const answersReady = ref(false)
const totalAnswers = ref(-1)
const totalMale = ref(-1)
const totalFemale = ref(-1)
const answersStr = ref<string[]>([])
const { result, loading, onError, load, refetch } = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $query: String, $questionsOfInterest: [String!]!) {
      queryQuestionnaire(
        voteStart: $voteStart
        voteYear: $voteYear
        query: $query
        questionsOfInterest: $questionsOfInterest
      ) {
        entries {
          questionId
          answersStr
          totalAnswers
          totalMale
          totalFemale
        }
      }
    }
  `,
  { voteStart, voteYear, query: q.value || undefined, questionsOfInterest: [qid.value] }
)
async function loadAnswers(): Promise<void> {
  pageError.value = null
  answersReady.value = false
  try {
    await ensureQuestionnaireStructure()
    const definition = findQuestionWithQuestionID(qid.value)
    if (!definition) {
      pageError.value = '未找到对应问题。'
      return
    }
    questionName.value = definition.question
    setSiteTitle(definition.question)
    const variables = { voteStart, voteYear, query: q.value || undefined, questionsOfInterest: [qid.value] }
    const pending = load(undefined, variables)
    if (pending === false) await refetch(variables)
    else await pending
    if (!pageError.value) applyAnswers()
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : String(error)
  }
}
function applyAnswers(): void {
  if (!result.value?.queryQuestionnaire) return
  const entry = result.value.queryQuestionnaire.entries.find((item) => item.questionId === qid.value)
  totalAnswers.value = entry?.totalAnswers ?? 0
  totalMale.value = entry?.totalMale ?? 0
  totalFemale.value = entry?.totalFemale ?? 0
  answersStr.value = entry?.answersStr ?? []
  answersReady.value = true
}
watch([qid, q], () => { void loadAnswers() }, { immediate: true })
watchEffect(() => {
  if (loading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
watch(result, () => { if (!pageError.value) applyAnswers() })
onError((error) => {
  answersReady.value = false
  pageError.value = error.message
})
</script>
<route lang="yaml">
meta:
  navid: questionnaire
</route>
