<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png/100px-THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">{{ musicName }}</h2>
        <span class="ml-3 text-xl">投票理由</span>
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
          <div>理由数量</div>
          <div>{{ numReasons }}</div>
        </div>
      </div>
    </div>
    <div class="md:mx-5 p-3 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面列出所有投票的时候用户提交的投票理由<br />
      * 可使用 Ctrl + F 或 ⌘ + F 调出浏览器自带的搜索功能进行搜索
    </div>
    <div class="md:mx-5 p-3 divide-y-1 divide-accent-300">
      <div class="text-2xl py-0.5 border-b border-accent-600">理由列表</div>
      <div v-for="item in reasons" :key="item" class="py-0.5 break-words">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { toPercentageString } from '@/lib/numberFormat'

const route = useRoute()

const musicRank = ref(
  Number(route.query.rank ? (Array.isArray(route.query.rank) ? route.query.rank[0] : route.query.rank) : 1)
)
const musicName = ref('ID：' + musicRank.value)
const voteCount = ref(-1)
const firstVoteCount = ref(-1)
const firstVotePercentage = ref<number | string>(-1)
const votePercentage = ref<number | string>(-1)
const firstPercentage = ref<number | string>(-1)
const reasons = ref<string[]>([])
const numReasons = ref(-1)
const { result, loading, onError } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryMusicSingle(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        name
        voteCount
        firstVoteCount
        firstVotePercentage
        votePercentage
        firstPercentage
        reasons
        numReasons
      }
    }
  `,

  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: musicRank.value,
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
    if (result.value.queryMusicSingle) {
      musicName.value = result.value.queryMusicSingle.name
      setSiteTitle(musicName.value + '的投票理由 - 第⑩回 中文东方人气投票')
      voteCount.value = result.value.queryMusicSingle.voteCount
      firstVoteCount.value = result.value.queryMusicSingle.firstVoteCount
      firstVotePercentage.value = toPercentageString(result.value.queryMusicSingle.firstVotePercentage)
      votePercentage.value = toPercentageString(result.value.queryMusicSingle.votePercentage)
      firstPercentage.value = toPercentageString(result.value.queryMusicSingle.firstPercentage)
      reasons.value = result.value.queryMusicSingle.reasons
      numReasons.value = result.value.queryMusicSingle.numReasons
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
  navid: music
</route>
