<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-center">
        <img
          src="https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png/100px-THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <div>
          <h2 class="text-3xl font-light">投票理由</h2>
          <span class="text-xl hidden md:inline-block">{{ coupleName }}</span>
        </div>
      </div>
      <span class="text-xl md:hidden">{{ coupleName }}</span>

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
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 border-b border-accent-600">角色与主动方倾向信息信息</div>
      <div class="flex bg-white">
        <!-- Fixed Header -->
        <div class="flex-grow flex">
          <div v-for="item in headerFixed" :key="item.key" :class="{ 'flex-grow': item.key === 'name' }">
            <!-- Header -->
            <div class="p-1 whitespace-nowrap border-b border-accent-600">
              <div>{{ item.name }}</div>
            </div>
            <!-- Content -->
            <div v-for="item2 in coupleMeta" :key="item2.name">
              <router-link
                class="block p-1 truncate max-w-30 md:max-w-none"
                v-if="item.key === 'name' && item2[item.key] != '无主动率'"
                :to="'/characterSingleDetail?rank=' + item2.rank"
                >{{ item2.name }}</router-link
              >
              <div v-else class="p-1 truncate max-w-30 md:max-w-none">
                {{ item2[item.key] }}
              </div>
            </div>
          </div>
        </div>
        <!-- Header not Fixed -->
        <div class="flex flex-nowrap overflow-auto">
          <div v-for="item in headerWithoutFixed" :key="item.key" class="min-w-26">
            <!-- Header -->
            <div class="p-1 whitespace-nowrap border-b border-accent-600">
              <div>{{ item.name }}</div>
            </div>
            <!-- Content -->
            <div v-for="item2 in coupleMeta" :key="item2.name">
              <div class="p-1 truncate max-w-30 md:max-w-none">
                {{ item2[item.key] }}
              </div>
            </div>
          </div>
        </div>
      </div>
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

const coupleRank = ref(
  Number(route.query.rank ? (Array.isArray(route.query.rank) ? route.query.rank[0] : route.query.rank) : 1)
)
const coupleName = ref('ID：' + coupleRank.value)
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
      queryCPSingle(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        cp {
          a
          b
          c
        }
        aActive
        bActive
        cActive
        noneActive
        voteCount
        firstVoteCount
        firstVotePercentage
        votePercentage
        firstPercentage
        reasons
        numReasons
      }
      queryCharacterRanking(voteStart: $voteStart, voteYear: $voteYear) {
        entries {
          rank
          displayRank
          name
          voteCount
          firstVoteCount
          firstVotePercentage
        }
      }
    }
  `,

  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: coupleRank.value,
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
    if (result.value.queryCPSingle) {
      coupleName.value =
        result.value.queryCPSingle.cp.a +
        ' x ' +
        result.value.queryCPSingle.cp.b +
        (result.value.queryCPSingle.cp.c ? ' x ' + result.value.queryCPSingle.cp.c : '')
      setSiteTitle(coupleName.value + ' - 第⑩回 中文东方人气投票')
      voteCount.value = result.value.queryCPSingle.voteCount
      firstVoteCount.value = result.value.queryCPSingle.firstVoteCount
      firstVotePercentage.value = toPercentageString(result.value.queryCPSingle.firstVotePercentage)
      votePercentage.value = toPercentageString(result.value.queryCPSingle.votePercentage)
      firstPercentage.value = toPercentageString(result.value.queryCPSingle.firstPercentage)
      reasons.value = result.value.queryCPSingle.reasons
      numReasons.value = result.value.queryCPSingle.numReasons
    }
    if (result.value.queryCharacterRanking.entries && result.value.queryCPSingle) {
      const characterIndex: ('a' | 'b' | 'c')[] = ['a', 'b', 'c']
      for (const i of characterIndex) {
        const index = result.value.queryCharacterRanking.entries.findIndex(
          (item) => item.name === (result.value?.queryCPSingle.cp[i] || 'ERROR')
        )
        // @ts-ignore:不能将类型“string”分配给类型“"aActive" | "bActive" | "cActive"”
        const iActive: 'aActive' | 'bActive' | 'cActive' = i + 'Active'
        coupleMeta.value.push({
          rank: result.value.queryCharacterRanking.entries[index].rank,
          name: result.value.queryCPSingle.cp[i] || 'ERROR',
          active: toPercentageString(result.value.queryCPSingle[iActive]),
          displayRank: result.value.queryCharacterRanking.entries[index].displayRank,
          voteCount: result.value.queryCharacterRanking.entries[index].voteCount,
          firstVoteCount: result.value.queryCharacterRanking.entries[index].firstVoteCount,
          firstVotePercentage: toPercentageString(
            result.value.queryCharacterRanking.entries[index].firstVotePercentage
          ),
        })
      }
      coupleMeta.value.push({
        name: '无主动率',
        active: toPercentageString(result.value.queryCPSingle.noneActive),
        displayRank: '-',
        voteCount: '-',
        firstVoteCount: '-',
        firstVotePercentage: '-',
      })
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log(err.message)
})
type HeaderKey = 'rank' | 'active' | 'displayRank' | 'name' | 'voteCount' | 'firstVoteCount' | 'firstVotePercentage'

interface Header {
  name: string
  key: HeaderKey
}
const header = computed<Header[]>(() => {
  return [
    { name: '主动率', key: 'active' },
    { name: '名次', key: 'displayRank' },
    { name: '角色名', key: 'name' },
    { name: '票数', key: 'voteCount' },
    { name: '本命数', key: 'firstVoteCount' },
    { name: '本命率', key: 'firstVotePercentage' },
  ]
})
const headerFixed: Header[] = [{ name: '角色名', key: 'name' }]
const headerWithoutFixed = computed<Header[]>(() =>
  header.value.filter((item) => !headerFixed.find((item2) => item2.key === item.key))
)
const coupleMeta = ref<
  {
    rank?: number
    name: string
    active: number | string
    displayRank: number | string
    voteCount: number | string
    firstVoteCount: number | string
    firstVotePercentage: number | string
  }[]
>([])
</script>
<route lang="yaml">
meta:
  navid: couple
</route>
