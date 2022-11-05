<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png/100px-THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">调查问卷</h2>
        <span class="ml-3 text-xl">结果信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>总投票人数</div>
          <div>{{ numVote }}</div>
        </div>
        <div>
          <div>角色部门票数</div>
          <div>{{ numChar }}</div>
        </div>
        <div>
          <div>音乐部门票数</div>
          <div>{{ numMusic }}</div>
        </div>
        <div>
          <div>CP部门票数</div>
          <div>{{ numCp }}</div>
        </div>
        <div>
          <div>作品题名票数</div>
          <div>{{ numDoujin }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独问卷的详细信息页面，下面每个栏目的内容分别有各自的说明。<br />
      * 投票理由请在基本信息的投票理由链接中查看。<br />
    </div>
    <!-- Form for meta profile -->
    <!-- <div class="md:m-5 px-3 py-1 text-2xl border-b">投票结果基本信息</div> -->
    <!-- Vote Evolution -->
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 border-b border-accent-600">投票演进</div>
      <div class="py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
        * 该图表表示投票进程的票数变化情况。<br />
        * 投票日期：{{ startTimeString + ' ~ ' + deadlineString }}。<br />
        * 通过拖动底部和右侧的滑柄或在图表上缩放（鼠标或手指）可以筛选数据范围，也可以点击顶部的图例开关某个数据的显示。
      </div>
      <GraphEvolution :x-axis="GraphTimeRange" :data="trend" class="max-w-4xl pt-3 mx-auto" />
    </div>
    <Questionnaire class="md:mx-5" :q="q" />
    <!-- Advanced Search -->
    <div
      class="z-49 shadow fixed bottom-10 right-5 bg-gray-50 cursor-pointer p-2 transition-opacity rounded-full dark:bg-gray-800"
      title="筛选"
      @click="openSearch()"
    >
      <div class="i-uil:file-search-alt text-2xl" />
    </div>
    <AdvancedSearch v-model:open="search" :filtermode="false" :querymode="true" />
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import { getAdditionalConstraintString } from '@/lib/decodeAdditionalConstraint'
import NProgress from 'nprogress'
import Questionnaire from '@/components/Questionnaire.vue'
import { GraphDataLine, GraphTimeRange, getTrendData, getAddedTrendData } from '@/lib/Graph'
import { startTimeString, deadlineString } from '@touhou-vote/shared/data/time'

setSiteTitle('调查问卷结果 - 第⑩回 中文东方人气投票')

const route = useRoute()

const numVote = ref(-1)
const numChar = ref(-1)
const numMusic = ref(-1)
const numCp = ref(-1)
const numDoujin = ref(-1)

const trend = ref<GraphDataLine[]>([])
const q = ref<string>('NONE')
const additionalConstraint = computed<string>(() =>
  String(route.query.a ? (Array.isArray(route.query.a) ? route.query.a[0] : route.query.a) : '')
)
watch(additionalConstraint, () => {
  fetchMore({
    variables:
      getAdditionalConstraintString(additionalConstraint.value) === ''
        ? {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
            // Use the first question to present the trend
            questionIds: ['q11011'],
          }
        : {
            query: getAdditionalConstraintString(additionalConstraint.value),
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
            // Use the first question to present the trend
            questionIds: ['q11011'],
          },
    updateQuery(previousQueryResult, { fetchMoreResult }) {
      if (!fetchMoreResult) return previousQueryResult
      return fetchMoreResult
    },
  })
})

const { result, loading, onError, fetchMore } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $questionIds: [String!]!, $query: String) {
      queryGlobalStats(voteStart: $voteStart, voteYear: $voteYear, query: $query) {
        numVote
        numChar
        numMusic
        numCp
        numDoujin
      }
      queryQuestionnaireTrend(voteStart: $voteStart, voteYear: $voteYear, questionIds: $questionIds, query: $query) {
        trend {
          hrs
          cnt
        }
        trendFirst {
          hrs
          cnt
        }
      }
    }
  `,
  getAdditionalConstraintString(additionalConstraint.value) === ''
    ? {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        // Use the first question to present the trend
        questionIds: ['q11011'],
      }
    : {
        query: getAdditionalConstraintString(additionalConstraint.value),
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        // Use the first question to present the trend
        questionIds: ['q11011'],
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
    if (result.value.queryGlobalStats) {
      numVote.value = result.value.queryGlobalStats.numVote
      numChar.value = result.value.queryGlobalStats.numChar
      numMusic.value = result.value.queryGlobalStats.numMusic
      numCp.value = result.value.queryGlobalStats.numCp
      numDoujin.value = result.value.queryGlobalStats.numDoujin
      q.value = getAdditionalConstraintString(additionalConstraint.value)
    }
    if (result.value.queryQuestionnaireTrend) {
      trend.value = []
      trend.value.push(
        getTrendData('总票数', result.value.queryQuestionnaireTrend[0].trend),
        getAddedTrendData('新增票数', result.value.queryQuestionnaireTrend[0].trend)
      )
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log('获取信息失败！')
})

const search = ref(false)
function openSearch() {
  search.value = true
}
</script>
<route lang="yaml">
meta:
  navid: questionnaire
</route>
