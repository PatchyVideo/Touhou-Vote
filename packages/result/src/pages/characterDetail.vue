<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">角色部门</h2>
        <span class="ml-3 text-xl">结果信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>参投角色总数</div>
          <div>{{ totalUniqueItemsCharacter }}</div>
        </div>
        <div>
          <div>总本命票数</div>
          <div>{{ totalFirstCharacter }}</div>
        </div>
        <div>
          <div>总有效票数</div>
          <div>{{ totalVotesCharacter }}</div>
        </div>
        <div>
          <div>全角色平均得票数</div>
          <div>{{ averageVotesPerItemCharacter }}</div>
        </div>
        <div>
          <div>中位角色得票数</div>
          <div>{{ medianVotesPerItemCharacter }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为角色部门的票数排行简表。页面打开时已按票数排序，本命加权是指1本命票计算为2票。<br />
      *点击表头可进行其他类型的排序，点 + 号或者表格行本身可展开详情，点击详情链接可以查看更加详尽的角色投票数据。<br />
      *更高级的搜索功能可以点击右下角的图标展开高级搜索框。<br />
      *如果在移动端觉得表格过于拥挤可以尝试打开浏览器的“电脑UA（桌面端网站）”功能
    </div>
    <!-- Form -->
    <div class="md:mx-5 flex bg-white shadow rounded border border-accent-600">
      <!-- Fixed Header -->
      <div class="flex-grow flex">
        <div
          v-for="item in headerFixed"
          :key="item.key"
          class="font-bold border-r border-accent-600"
          :class="{ 'flex-grow': item.key === 'name' }"
        >
          <!-- Header -->
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-600">
            <div>{{ item.name }}</div>
          </div>
          <!-- Content -->
          <div v-for="(item2, index) in resultCharacter" :key="item2.rank" class="relative">
            <div
              class="p-1 max-w-30 md:max-w-none border-t border-accent-600 flex flex-nowrap items-center"
              :class="{ 'pb-66': lineExpanded[index] }"
            >
              <div
                v-if="item.key === 'displayRank'"
                class="min-w-8"
                :class="lineExpanded[index] ? 'i-uil:minus' : 'i-uil:plus'"
                @click="lineExpanded[index] = !lineExpanded[index]"
              ></div>
              <div class="px-2 truncate">{{ item2[item.key] }}</div>
            </div>
            <!-- Folder -->
            <div
              v-if="lineExpanded[index] && item.key === 'displayRank'"
              class="absolute bottom-0 w-[calc(100vw-0.6rem)] md:w-[calc(100vw-4.1rem)] p-2 bg-white rounded shadow-inner border border-accent-600 space-y-2"
            >
              <div class="p-1 rounded border border-accent-600 divide-y divide-accent-300">
                <div v-for="item3 in headerFolded" class="truncate py-1">
                  {{ item3.name + ': ' + item2[item3.key] }}
                </div>
                <div class="py-1">角色详情：<router-link class="cursor-pointer" to="/">点击这里</router-link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Header not Fixed -->
      <div class="flex flex-nowrap overflow-auto">
        <div v-for="item in headerWithoutFixed" :key="item.key" class="border-r border-accent-600 min-w-25">
          <!-- Header -->
          <div
            class="p-1 whitespace-nowrap border-b border-accent-600 flex flex-nowrap justify-between items-center space-x-1"
          >
            <div>{{ item.name }}</div>
            <div v-if="sortHeader.key === item.key" class="i-uil:sort-amount-down"></div>
            <div v-else class="i-uil:arrows-v transition transition-colors text-white hover:text-black"></div>
          </div>
          <!-- Content -->
          <div v-for="(item2, index) in resultCharacter" :key="item2.rank" class="relative">
            <div
              class="py-1 px-3 truncate max-w-30 md:max-w-none border-t border-accent-600"
              :class="{ 'pb-66': lineExpanded[index] }"
            >
              {{ item2[item.key] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Advanced Search -->
  <div
    class="shadow fixed bottom-10 right-5 bg-gray-50 cursor-pointer p-2 transition-opacity rounded-full dark:bg-gray-800"
    title="筛选"
    @click="openSearch()"
  >
    <div class="i-uil:file-search-alt text-2xl" />
  </div>
  <characterDetailSearch v-model:open="search" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import characterDetailSearch from '@/components/characterDetailSearch.vue'

interface Header {
  name: string
  key:
    | 'rank'
    | 'displayRank'
    | 'name'
    | 'voteCount'
    | 'firstVoteCount'
    | 'firstVotePercentage'
    | 'firstVoteCountWeighted'
    | 'votePercentage'
    | 'firstPercentage'
    | 'maleVoteCount'
    | 'malePercentagePerChar'
    | 'femaleVoteCount'
    | 'femalePercentagePerChar'
    | 'nameJpn'
    | 'characterType'
    | 'characterOrigin'
    | 'firstAppearance'
    | 'malePercentagePerTotal'
    | 'femalePercentagePerTotal'
}
const header: Header[] = [
  { name: '名次', key: 'displayRank' },
  { name: '角色名', key: 'name' },
  { name: '票数', key: 'voteCount' },
  { name: '本命数', key: 'firstVoteCount' },
  { name: '本命率', key: 'firstVotePercentage' },
  { name: '本命加权', key: 'firstVoteCountWeighted' },
  { name: '票数占比', key: 'votePercentage' },
  { name: '本命占比', key: 'firstPercentage' },
  { name: '男性数', key: 'maleVoteCount' },
  { name: '男性比例', key: 'malePercentagePerChar' },
  { name: '女性数', key: 'femaleVoteCount' },
  { name: '女性比例', key: 'femalePercentagePerChar' },
  { name: '日文名', key: 'nameJpn' },
  { name: '所属作品类型', key: 'characterType' },
  { name: '所属作品', key: 'characterOrigin' },
  { name: '初登场时间', key: 'firstAppearance' },
  { name: '占总体男性比例', key: 'malePercentagePerTotal' },
  { name: '占总体女性比例', key: 'femalePercentagePerTotal' },
]
const headerFixed: Header[] = [
  { name: '名次', key: 'displayRank' },
  { name: '角色名', key: 'name' },
]
const headerFolded: Header[] = [
  { name: '日文名', key: 'nameJpn' },
  { name: '所属作品类型', key: 'characterType' },
  { name: '所属作品', key: 'characterOrigin' },
  { name: '初登场时间', key: 'firstAppearance' },
  { name: '占总体男性比例', key: 'malePercentagePerTotal' },
  { name: '占总体女性比例', key: 'femalePercentagePerTotal' },
]
const headerWithoutFixed = computed<Header[]>(() =>
  header.filter(
    (item) =>
      !headerFixed.find((item2) => item2.key === item.key) && !headerFolded.find((item2) => item2.key === item.key)
  )
)
const sortHeader = ref<{
  key:
    | 'rank'
    | 'displayRank'
    | 'name'
    | 'voteCount'
    | 'firstVoteCount'
    | 'firstVotePercentage'
    | 'firstVoteCountWeighted'
    | 'votePercentage'
    | 'firstPercentage'
    | 'maleVoteCount'
    | 'malePercentagePerChar'
    | 'femaleVoteCount'
    | 'femalePercentagePerChar'
    | 'nameJpn'
    | 'characterType'
    | 'characterOrigin'
    | 'firstAppearance'
    | 'malePercentagePerTotal'
    | 'femalePercentagePerTotal'
  forward: boolean
}>({
  key: 'rank',
  forward: true,
})

watch(
  sortHeader,
  () => {
    resultCharacter.value.sort((a, b) => {
      if (sortHeader.value.key === 'firstVoteCount')
        if (sortHeader.value.forward) return a[sortHeader.value.key] - b[sortHeader.value.key]
        else return b[sortHeader.value.key] - a[sortHeader.value.key]
      else return 0
    })
  },
  { deep: true }
)
const totalUniqueItemsCharacter = ref(0)
const totalFirstCharacter = ref(0)
const totalVotesCharacter = ref(0)
const averageVotesPerItemCharacter = ref(0)
const medianVotesPerItemCharacter = ref(0)
const resultCharacter = ref<
  {
    rank: number
    displayRank: number
    name: string
    voteCount: number
    firstVoteCount: number
    firstVotePercentage: string
    firstVoteCountWeighted: number
    votePercentage: number
    firstPercentage: number
    maleVoteCount: number
    malePercentagePerChar: number
    femaleVoteCount: number
    femalePercentagePerChar: number
    nameJpn: string
    characterType: string
    characterOrigin: string
    firstAppearance: string
    malePercentagePerTotal: number
    femalePercentagePerTotal: number
  }[]
>([])
const lineExpanded = ref<boolean[]>([])

const {
  result,
  loading: queryRankingLoading,
  onError: queryRankingError,
} = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!) {
      queryCharacterRanking(voteStart: $voteStart, voteYear: $voteYear) {
        global {
          totalUniqueItems
          totalFirst
          totalVotes
          averageVotesPerItem
          medianVotesPerItem
        }
        entries {
          rank
          displayRank
          name
          voteCount
          firstVoteCount
          firstVotePercentage
          firstVoteCountWeighted
          votePercentage
          firstPercentage
          maleVoteCount
          malePercentagePerChar
          femaleVoteCount
          femalePercentagePerChar
          nameJpn
          characterType
          characterOrigin
          firstAppearance
          malePercentagePerTotal
          femalePercentagePerTotal
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
  if (result.value) {
    if (result.value.queryCharacterRanking) {
      totalUniqueItemsCharacter.value = result.value.queryCharacterRanking.global.totalUniqueItems
      totalFirstCharacter.value = result.value.queryCharacterRanking.global.totalFirst
      totalVotesCharacter.value = result.value.queryCharacterRanking.global.totalVotes
      averageVotesPerItemCharacter.value = Math.round(result.value.queryCharacterRanking.global.averageVotesPerItem)
      medianVotesPerItemCharacter.value = result.value.queryCharacterRanking.global.medianVotesPerItem
      // @ts-ignore:参数“item”隐式具有“any”类型
      resultCharacter.value = JSON.parse(JSON.stringify(result.value.queryCharacterRanking.entries)).map((item) => {
        item.firstVotePercentage = toPercentageString(item.firstVotePercentage)
        item.votePercentage = toPercentageString(item.votePercentage)
        item.firstPercentage = toPercentageString(item.firstPercentage)
        item.malePercentagePerChar = toPercentageString(item.malePercentagePerChar)
        item.femalePercentagePerChar = toPercentageString(item.femalePercentagePerChar)
        item.malePercentagePerTotal = toPercentageString(item.malePercentagePerTotal)
        item.femalePercentagePerTotal = toPercentageString(item.femalePercentagePerTotal)
        return item
      })
      lineExpanded.value = new Array(resultCharacter.value.length).fill(null).map(() => false)
    }
  }
})
queryRankingError((err) => {
  console.log(err.message)
})
function toPercentageString(num: number): string {
  return (num * 100).toFixed(2) + '%'
}

const search = ref(false)
function openSearch() {
  search.value = true
}
</script>
