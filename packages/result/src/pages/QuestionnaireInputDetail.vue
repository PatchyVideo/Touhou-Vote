<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-center">
        <img
          src="https://upload.touhou.vote/imgs/nav/questionnaireDetail@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <div>
          <h2 class="text-3xl font-light">问卷回答</h2>
          <span class="text-xl hidden md:inline-block">{{ questionName }}</span>
        </div>
      </div>
      <span class="text-xl md:hidden">{{ questionName }}</span>

      <div class="grid grid-cols-3 gap-1 text-sm md:text-base text-center">
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
  <div class="md:mx-5 p-3 divide-y-1 divide-accent-300">
    <div class="text-2xl py-0.5 border-b border-accent-600">回答列表</div>
    <div v-for="item in answersStr" :key="item" class="py-0.5 break-words">
      {{ item }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { qIDToID, findQuestionWithQuestionID } from '@/lib/Questionnaire'
const route = useRoute()

const qid = ref(
  String(route.query.qid ? (Array.isArray(route.query.qid) ? route.query.qid[0] : route.query.qid) : 'q11011')
)
const q = ref(String(route.query.q ? (Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : ''))
const questionName = ref('qid: ' + qid.value)
const totalAnswers = ref(-1)
const totalMale = ref(-1)
const totalFemale = ref(-1)
const answersStr = ref<string[]>([])
const { result, loading, onError } = useQuery<Query>(
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
  q.value === ''
    ? {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        questionsOfInterest: [qid.value],
      }
    : {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        query: q.value,
        questionsOfInterest: [qid.value],
      }
)
watchEffect(() => {
  if (loading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
watchEffect(() => {
  if (result.value) {
    if (result.value.queryQuestionnaire) {
      questionName.value = findQuestionWithQuestionID(
        qIDToID(result.value.queryQuestionnaire.entries[0].questionId)
      ).question
      setSiteTitle(questionName.value + ' - 第⑩回 中文东方人气投票')
      totalAnswers.value = result.value.queryQuestionnaire.entries[0].totalAnswers
      totalMale.value = result.value.queryQuestionnaire.entries[0].totalMale
      totalFemale.value = result.value.queryQuestionnaire.entries[0].totalFemale
      answersStr.value = result.value.queryQuestionnaire.entries[0].answersStr
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log(err.message)
})
</script>
<route lang="yaml">
meta:
  navid: questionnaire
</route>
