<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://asset.lilywhite.cc/thvote/imgs/nav/music@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">音乐部门</h2>
        <span class="ml-3 text-xl">投票演进对比</span>
      </div>
      <div class="grid grid-cols-3 gap-1 text-sm md:text-base text-center">
        <div>
          <div>总有效票数</div>
          <div>{{ totalVotesMusic }}</div>
        </div>
        <div>
          <div>总本命票数</div>
          <div>{{ totalFirstMusic }}</div>
        </div>
        <div>
          <div>总参投曲目数</div>
          <div>{{ totalUniqueItemsMusic }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独曲目投票的演进对比页面<br />
      * 请先选择需要对比的曲目，最多可以选择十名曲目
    </div>
    <!-- Music select -->
    <div class="md:m-5 px-3 py-1 space-y-2 max-w-200">
      <div class="rounded border border-dashed border-accent-600 p-1">
        <div v-if="musicsForEvolution.length" class="flex flex-wrap">
          <div
            @click="deleteMusic(item)"
            v-for="item in musicsForEvolution"
            :key="item"
            class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer whitespace-nowrap mb-1 mr-1 bg-accent-600 text-white"
          >
            {{ item + ' X' }}
          </div>
        </div>
        <div v-else class="text-gray-600 text-center text-sm py-1">请选择曲目</div>
      </div>
      <div class="flex justify-between flex-wrap">
        <div class="flex-grow md:flex-grow-0 flex justify-between space-x-2">
          <VoteSelect
            class="w-50"
            :item-list="musicItemList"
            v-model:selected="musicSelected"
            selected-name="请选择曲目"
          />
          <div
            class="px-3 rounded-xl text-sm text-white flex items-center cursor-pointer"
            :class="ifMoreMusicCanAdd ? 'bg-accent-600' : 'bg-accent-300'"
            @click="addMusic(musicSelected.name)"
          >
            添加
          </div>
        </div>
        <div
          class="px-3 py-2 md:py-0 mt-2 md:mt-0 w-full md:w-auto rounded-xl text-sm text-white text-center md:flex md:items-center cursor-pointer"
          :class="musicsForEvolution.length && !queryMusicEbvolutionLoading ? 'bg-accent-600' : 'bg-accent-300'"
          @click="getMusicEvolution()"
        >
          提交图表申请请求
        </div>
      </div>
    </div>
    <!-- Evolution result -->
    <transition name="musicEvolutionGraph" mode="out-in">
      <div class="md:mx-5" v-if="showEvolutionGraph">
        <div class="px-3 pt-3 md:pt-1 text-xl border-b border-accent-600">投票演进</div>
        <div class="md:my-1 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
          * 该图表表示该曲目随着投票进程的票数变化情况<br />
          * 其中减少的票数是因为投票人修改自己的投票去掉该曲目而导致<br />
          * 投票时间：2022-06-17 18:00:00 至 2022-07-05 00:00:00
        </div>
        <div class="px-3 pt-3 md:pt-1 text-lg border-b border-accent-300">总票数演进</div>
        <!-- Graph for vote evolution -->
        <GraphEvolution :x-axis="GraphTimeRange" :data="trend" class="max-w-4xl pt-3 mx-auto" />
        <div class="px-3 pt-3 md:pt-1 text-lg border-b border-accent-300">总本命票数演进</div>
        <!-- Graph for vote evolution -->
        <GraphEvolution :x-axis="GraphTimeRange" :data="trendFirst" class="max-w-4xl pt-3 mx-auto" />
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { watchEffect } from 'vue'
import NProgress from 'nprogress'
import { gql, useLazyQuery, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import { musicList } from '@touhou-vote/shared/data/music'
import type { GraphDataLine } from '@/lib/Graph'
import { GraphTimeRange, getTrendData } from '@/lib/Graph'
import VoteSelect from '@/components/VoteSelect.vue'
import GraphEvolution from '@/components/GraphEvolution.vue'

setSiteTitle('曲目投票演进 - 第11回 中文东方人气投票')

const totalUniqueItemsMusic = ref(-1)
const totalFirstMusic = ref(-1)
const totalVotesMusic = ref(-1)
const musicsForEvolution = ref<string[]>([])
const ifMoreMusicCanAdd = computed<boolean>(
  () => musicsForEvolution.value.length < 10 && !queryMusicEbvolutionLoading.value
)

const musicItemList = computed(() =>
  musicList
    .filter((item) => musicsForEvolution.value.findIndex((item2) => item2 === item.name) === -1)
    .map((item) => {
      return {
        name: item.name,
        value: item.name,
      }
    })
)
const musicSelected = ref({
  name: '',
  value: '',
})
function addMusic(music: string) {
  if (music === '' || !ifMoreMusicCanAdd.value) return
  musicsForEvolution.value.push(music)
  musicSelected.value = {
    name: '',
    value: '',
  }
}
function deleteMusic(music: string) {
  if (!music) return
  if (musicsForEvolution.value.findIndex((item) => item === music) != -1) {
    musicsForEvolution.value.splice(
      musicsForEvolution.value.findIndex((item) => item === music),
      1
    )
  }
}

const trend = ref<GraphDataLine[]>([])
const trendFirst = ref<GraphDataLine[]>([])
const trendMusicNumber = ref(musicsForEvolution.value.length)
const showEvolutionGraph = ref(false)
async function getMusicEvolution(): Promise<void> {
  if (!musicsForEvolution.value.length || queryMusicEbvolutionLoading.value) return
  resultMusicEbvolution.value = undefined
  showEvolutionGraph.value = false
  trendMusicNumber.value = musicsForEvolution.value.length
  if (queryMusicEbvolutionForceDisabled.value)
    loadMusicEbvolution(undefined, {
      voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
      voteYear: 10,
      names: musicsForEvolution.value,
    })
  else
    queryMusicEbvolutionMore({
      variables: {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        names: musicsForEvolution.value,
      },
      updateQuery(previousQueryResult, { fetchMoreResult }) {
        if (!fetchMoreResult) return previousQueryResult
        return fetchMoreResult
      },
    })
}
const {
  result: resultMusicEbvolution,
  load: loadMusicEbvolution,
  loading: queryMusicEbvolutionLoading,
  onError: queryMusicEbvolutionError,
  fetchMore: queryMusicEbvolutionMore,
  forceDisabled: queryMusicEbvolutionForceDisabled,
} = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $names: [String!]!) {
      queryMusicTrend(voteStart: $voteStart, voteYear: $voteYear, names: $names) {
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
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    names: musicsForEvolution.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (queryMusicEbvolutionLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
watchEffect(() => {
  if (resultMusicEbvolution.value) {
    if (resultMusicEbvolution.value.queryMusicTrend) {
      trend.value = []
      trendFirst.value = []
      for (let i = 0; i < trendMusicNumber.value; i++) {
        trend.value.push(
          getTrendData(musicsForEvolution.value[i], resultMusicEbvolution.value.queryMusicTrend[i].trend)
        )
        trendFirst.value.push(
          getTrendData(musicsForEvolution.value[i], resultMusicEbvolution.value.queryMusicTrend[i].trendFirst)
        )
      }
      showEvolutionGraph.value = true
    }
  }
})
queryMusicEbvolutionError((err) => {
  console.log(err.message)
  alert('获取图表失败！')
})

const {
  result: queryRankingResult,
  loading: queryRankingLoading,
  onError: queryRankingError,
} = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!) {
      queryMusicRanking(voteStart: $voteStart, voteYear: $voteYear) {
        global {
          totalUniqueItems
          totalFirst
          totalVotes
        }
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (queryRankingLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
watchEffect(() => {
  if (queryRankingResult.value) {
    if (queryRankingResult.value.queryMusicRanking.global) {
      totalUniqueItemsMusic.value = queryRankingResult.value.queryMusicRanking.global.totalUniqueItems
      totalFirstMusic.value = queryRankingResult.value.queryMusicRanking.global.totalFirst
      totalVotesMusic.value = queryRankingResult.value.queryMusicRanking.global.totalVotes
    }
  }
})
queryRankingError((err) => {
  alert(err.message)
  console.log('获取投票元信息失败！')
})
</script>
<style lang="postcss" scoped>
.musicEvolutionGraph-enter-active,
.musicEvolutionGraph-leave-active {
  @apply transition-all duration-200;
}
.musicEvolutionGraph-enter-from,
.musicEvolutionGraph-leave-to {
  @apply opacity-0;
}
</style>
<route lang="yaml">
meta:
  navid: music
</route>
