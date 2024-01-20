<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://asset.lilywhite.cc/thvote/imgs/nav/music@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">{{ musicName }}</h2>
        <span class="ml-3 text-xl">曲目信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-1 text-sm md:text-base text-center">
        <div>
          <div>票数</div>
          <div>{{ voteCount }}</div>
        </div>
        <div>
          <div>本命票数</div>
          <div>{{ firstVoteCount }}</div>
        </div>
        <div>
          <div>本命率</div>
          <div>{{ firstVotePercentage }}</div>
        </div>
        <div>
          <div>票数全局占比</div>
          <div>{{ votePercentage }}</div>
        </div>
        <div>
          <div>本命全局占比</div>
          <div>{{ firstPercentage }}</div>
        </div>
        <div>
          <div>投票理由</div>
          <router-link
            class="underline"
            v-if="numReasons > 0"
            :to="
              '/musicReason?rank=' +
              musicRank +
              (getAdditionalConstraintString(additionalConstraint) === '' ? '' : '&q=' + additionalConstraint)
            "
            >{{ numReasons + '(点此查看)' }}</router-link
          >
          <div v-else>{{ numReasons }}</div>
        </div>
      </div>
    </div>
    <div class="md:mx-5 p-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独曲目的详细信息页面，下面每个栏目的内容分别有各自的说明<br />
    </div>
    <!-- Vote Evolution -->
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 border-b border-accent-600">投票演进</div>
      <div class="py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
        * 该图表表示该曲目随着投票进程的票数变化情况。<br />
        * 投票日期：{{ startTimeString + ' ~ ' + deadlineString }}。<br />
        * 通过拖动底部和右侧的滑柄或在图表上缩放（鼠标或手指）可以筛选数据范围，也可以点击顶部的图例开关某个数据的显示。
      </div>
      <GraphEvolution :x-axis="GraphTimeRange" :data="trend" class="max-w-4xl pt-3 mx-auto" />
    </div>
    <Questionnaire class="md:mx-5" :q="q" />
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { toPercentageString } from '@/lib/numberFormat'
import type { GraphDataLine } from '@/lib/Graph'
import { GraphTimeRange, getAddedTrendData, getTrendData } from '@/lib/Graph'
import { getAdditionalConstraintString } from '@/lib/decodeAdditionalConstraint'
import { deadlineString, startTimeString } from '@touhou-vote/shared/data/time'
import GraphEvolution from '@/components/GraphEvolution.vue'
import Questionnaire from '@/components/Questionnaire.vue'

const route = useRoute()

const musicRank = ref(
  Number(route.query.rank ? (Array.isArray(route.query.rank) ? route.query.rank[0] : route.query.rank) : 1)
)
const additionalConstraint = computed(() =>
  String(route.query.q ? (Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '')
)
const musicName = ref('ID：' + musicRank.value)
const voteCount = ref(-1)
const firstVoteCount = ref(-1)
const firstVotePercentage = ref<number | string>(-1)
const votePercentage = ref<number | string>(-1)
const firstPercentage = ref<number | string>(-1)
const numReasons = ref(-1)
const trend = ref<GraphDataLine[]>([])
const q = ref<string>('NONE')
const { result, loading, onError } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!, $query: String) {
      queryMusicSingle(voteStart: $voteStart, voteYear: $voteYear, rank: $rank, query: $query) {
        name
        voteCount
        firstVoteCount
        firstVotePercentage
        votePercentage
        firstPercentage
        numReasons
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
        voteStart: new Date(Date.UTC(2023, 11, 29, 10)),
        voteYear: 11,
        rank: musicRank.value,
      }
    : {
        voteStart: new Date(Date.UTC(2023, 11, 29, 10)),
        voteYear: 11,
        rank: musicRank.value,
        query: getAdditionalConstraintString(additionalConstraint.value),
      }
)
watchEffect(() => {
  if (result.value) {
    if (result.value.queryMusicSingle) {
      musicName.value = result.value.queryMusicSingle.name
      setSiteTitle(musicName.value)
      q.value = 'musics:["' + musicName.value + '"]'
      voteCount.value = result.value.queryMusicSingle.voteCount
      firstVoteCount.value = result.value.queryMusicSingle.firstVoteCount
      firstVotePercentage.value = toPercentageString(result.value.queryMusicSingle.firstVotePercentage)
      votePercentage.value = toPercentageString(result.value.queryMusicSingle.votePercentage)
      firstPercentage.value = toPercentageString(result.value.queryMusicSingle.firstPercentage)
      numReasons.value = result.value.queryMusicSingle.numReasons
      trend.value.push(
        getTrendData('总票数', result.value.queryMusicSingle.trend),
        getAddedTrendData('新增票数', result.value.queryMusicSingle.trend),
        getTrendData('总本命票数', result.value.queryMusicSingle.trendFirst),
        getAddedTrendData('新增本命票', result.value.queryMusicSingle.trendFirst)
      )
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log(err.message)
})
watchEffect(() => {
  if (loading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
</script>
<route lang="yaml">
meta:
  navid: music
</route>
