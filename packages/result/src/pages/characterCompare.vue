<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://asset.lilywhite.cc/thvote/imgs/thb_reimu.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">角色部门</h2>
        <span class="ml-3 text-xl">往届结果对比</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>角色数</div>
          <div>{{ totalUniqueItemsCharacter }}</div>
        </div>
        <div>
          <div>本命票数</div>
          <div>{{ totalFirstCharacter }}</div>
        </div>
        <div>
          <div>有效票数</div>
          <div>{{ totalVotesCharacter }}</div>
        </div>
        <div>
          <div>平均得票数</div>
          <div>{{ averageVotesPerItemCharacter }}</div>
        </div>
        <div>
          <div>中位角色得票数</div>
          <div>{{ medianVotesPerItemCharacter }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为角色部门的票数排行简表。页面打开时已按票数排序，本命加权是指1本命票计算为2票<br />
      * 搜索功能可以点击右下角的图标展开搜索框<br />
      * 点 + 号或者表格行本身可展开详情，点击详情链接可以查看更加详尽的角色投票数据<br />
      * 点击表头可进行其他类型的排序，排序规则见结果信息页面
    </div>
    <!-- Form -->
    <div class="md:mx-5 flex bg-white shadow rounded border border-accent-600">
      <!-- Fixed Header -->
      <div class="flex">
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
          <div v-for="(item2, index) in resultCharactersForDisplay" :key="item2.rank" class="relative">
            <div
              class="p-1 max-w-30 md:max-w-none border-t border-accent-600 flex flex-nowrap items-center"
              :class="{ 'pb-48': lineExpanded[index] }"
            >
              <div
                v-if="item.key === headerFixed[0].key"
                class="min-w-8 cursor-pointer"
                :class="lineExpanded[index] ? 'i-uil:minus' : 'i-uil:plus'"
                @click="lineExpanded[index] = !lineExpanded[index]"
              ></div>
              <div
                class="px-2 truncate"
                :class="{
                  'text-accent-600': item2.displayRank > item2.displayRankLast1,
                  'text-green-400': item2.displayRank < item2.displayRankLast1,
                }"
              >
                {{ item2[item.key] }}
              </div>
            </div>
            <!-- Folder -->
            <div
              v-if="lineExpanded[index] && item.key === headerFixed[0].key"
              class="absolute z-10 bottom-0 w-[calc(100vw-0.6rem)] md:w-[calc(100vw-4.1rem)] p-2 bg-white rounded shadow-inner border border-accent-600 space-y-2"
            >
              <div class="p-1 rounded border border-accent-600 divide-y divide-accent-300">
                <div v-for="item3 in headerFolded" class="truncate py-1">
                  {{ item3.name + ': ' + item2[item3.key] }}
                </div>
                <div class="py-1">
                  角色详情：<router-link class="cursor-pointer" :to="'/characterSingleDetail?rank=' + item2.rank"
                    >点击这里</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Header not Fixed -->
      <div class="flex flex-grow flex-nowrap overflow-auto">
        <div
          v-for="item in headerWithoutFixed"
          :key="item.key"
          class="border-r border-accent-600 min-w-26"
          :class="{ 'flex-grow': item.key === 'name' }"
        >
          <!-- Header -->
          <div
            class="p-1 whitespace-nowrap border-b border-accent-600 flex flex-nowrap justify-between items-center space-x-1"
            @click="item.sortable && updateSortHeader(item.key)"
          >
            <div>{{ item.name }}</div>
            <div class="cursor-pointer" v-if="item.sortable">
              <div
                v-if="sortHeader.key === item.key"
                :class="sortHeader.forward ? 'i-uil:sort-amount-down' : 'i-uil:sort-amount-up'"
              ></div>
              <div v-else class="i-uil:arrows-v transition transition-colors text-gray-300 cursor-pointer"></div>
            </div>
          </div>
          <!-- Content -->
          <div v-for="(item2, index) in resultCharactersForDisplay" :key="item2.rank" class="relative">
            <div
              class="py-1 px-3 truncate max-w-30 md:max-w-none border-t border-accent-600"
              :class="{ 'pb-48': lineExpanded[index] }"
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
    class="z-49 shadow fixed bottom-10 right-5 bg-gray-50 cursor-pointer p-2 transition-opacity rounded-full dark:bg-gray-800"
    title="筛选"
    @click="openSearch()"
  >
    <div class="i-uil:file-search-alt text-2xl" />
  </div>
  <AdvancedSearch v-model:open="search" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import { toPercentageString, toTimeFormat } from '@/lib/numberFormat'
import NProgress from 'nprogress'

setSiteTitle('往届结果对比')

const route = useRoute()

type HeaderKey =
  | 'rank'
  | 'displayRank'
  | 'displayRankLast1'
  | 'displayRankLast2'
  | 'name'
  | 'voteCount'
  | 'voteCountLast1'
  | 'voteCountLast2'
  | 'firstVoteCount'
  | 'firstVoteCountLast1'
  | 'firstVoteCountLast2'
  | 'firstVotePercentage'
  | 'firstVotePercentageLast1'
  | 'firstVotePercentageLast2'
  | 'votePercentage'
  | 'votePercentageLast1'
  | 'votePercentageLast2'
  | 'firstPercentage'
  | 'nameJpn'
  | 'characterType'
  | 'characterOrigin'
  | 'firstAppearance'
interface Header {
  name: string
  key: HeaderKey
  sortable?: boolean
}
const header: Header[] = [
  { name: '名次', key: 'displayRank' },
  { name: '第⑩届', key: 'displayRankLast1' },
  { name: '第⑨届', key: 'displayRankLast2' },
  { name: '角色名', key: 'name' },
  { name: '票数', key: 'voteCount', sortable: true },
  { name: '第⑩届', key: 'voteCountLast1' },
  { name: '第⑨届', key: 'voteCountLast2' },
  { name: '本命数', key: 'firstVoteCount', sortable: true },
  { name: '第⑩届', key: 'firstVoteCountLast1' },
  { name: '第⑨届', key: 'firstVoteCountLast2' },
  { name: '本命率', key: 'firstVotePercentage', sortable: true },
  { name: '第⑩届', key: 'firstVotePercentageLast1' },
  { name: '第⑨届', key: 'firstVotePercentageLast2' },
  { name: '票数占比', key: 'votePercentage' },
  { name: '第⑩届', key: 'votePercentageLast1' },
  { name: '第⑨届', key: 'votePercentageLast2' },
  { name: '本命占比', key: 'firstPercentage' },
  { name: '日文名', key: 'nameJpn' },
  { name: '所属作品类型', key: 'characterType' },
  { name: '所属作品', key: 'characterOrigin' },
  { name: '初登场时间', key: 'firstAppearance' },
]
const headerFixed: Header[] = [{ name: '名次', key: 'displayRank' }]
const headerFolded: Header[] = [
  { name: '日文名', key: 'nameJpn' },
  { name: '所属作品类型', key: 'characterType' },
  { name: '所属作品', key: 'characterOrigin' },
  { name: '初登场时间', key: 'firstAppearance' },
]
const headerWithoutFixed = computed<Header[]>(() =>
  header.filter(
    (item) =>
      !headerFixed.find((item2) => item2.key === item.key) && !headerFolded.find((item2) => item2.key === item.key)
  )
)
const sortHeader = ref<{
  key: HeaderKey
  forward: boolean
}>({
  key: 'voteCount',
  forward: true,
})
function updateSortHeader(key: HeaderKey) {
  if (sortHeader.value.key === key) {
    sortHeader.value.forward = !sortHeader.value.forward
  } else {
    sortHeader.value.key = key
    sortHeader.value.forward = true
  }
}

const totalUniqueItemsCharacter = ref(-1)
const totalFirstCharacter = ref(-1)
const totalVotesCharacter = ref(-1)
const averageVotesPerItemCharacter = ref(-1)
const medianVotesPerItemCharacter = ref(-1)
interface ResultCharacter {
  rank: number
  displayRank: number
  displayRankLast1: number
  displayRankLast2: number
  name: string
  voteCount: number
  voteCountLast1: number
  voteCountLast2: number
  firstVoteCount: number
  firstVoteCountLast1: number
  firstVoteCountLast2: number
  firstVotePercentage: string
  firstVotePercentageLast1: string
  firstVotePercentageLast2: string
  votePercentage: number
  votePercentageLast1: number
  votePercentageLast2: number
  firstPercentage: number
  nameJpn: string
  characterType: string
  characterOrigin: string
  firstAppearance: string
}
const resultCharacters = ref<ResultCharacter[]>([])
const resultCharactersForDisplay = computed<ResultCharacter[]>(() => {
  return (
    resultCharacters.value
      // sort for last2 result
      .sort((a, b) => {
        if (sortHeader.value.key === 'voteCount')
          if (percentageToNumber(b.voteCountLast2) - percentageToNumber(a.voteCountLast2)) {
            if (sortHeader.value.forward)
              return percentageToNumber(b.voteCountLast2) - percentageToNumber(a.voteCountLast2)
            else return percentageToNumber(a.voteCountLast2) - percentageToNumber(b.voteCountLast2)
          } else {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVoteCountLast2) - percentageToNumber(a.firstVoteCountLast2)
            else return percentageToNumber(a.firstVoteCountLast2) - percentageToNumber(b.firstVoteCountLast2)
          }
        else if (sortHeader.value.key === 'firstVotePercentage')
          if (percentageToNumber(b.firstVotePercentageLast2) - percentageToNumber(a.firstVotePercentageLast2)) {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVotePercentageLast2) - percentageToNumber(a.firstVotePercentageLast2)
            else return percentageToNumber(a.firstVotePercentageLast2) - percentageToNumber(b.firstVotePercentageLast2)
          } else {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVoteCountLast2) - percentageToNumber(a.firstVoteCountLast2)
            else return percentageToNumber(a.firstVoteCountLast2) - percentageToNumber(b.firstVoteCountLast2)
          }
        else {
          if (sortHeader.value.forward)
            return percentageToNumber(b.firstVoteCountLast2) - percentageToNumber(a.firstVoteCountLast2)
          else return percentageToNumber(a.firstVoteCountLast2) - percentageToNumber(b.firstVoteCountLast2)
        }
      })
      .map((item, index, arr) => {
        let i = index
        for (i; i >= 0; i--) {
          if (sortHeader.value.key === 'voteCount') {
            if (arr[i].voteCountLast2 != item.voteCountLast2) break
          } else if (sortHeader.value.key === 'firstVotePercentage') {
            if (arr[i].firstVotePercentageLast2 != item.firstVotePercentageLast2) break
          } else {
            if (arr[i].firstVoteCountLast2 != item.firstVoteCountLast2) break
          }
        }
        item.displayRankLast2 = i + 2
        return item
      })
      // sort for last result
      .sort((a, b) => {
        if (sortHeader.value.key === 'voteCount')
          if (percentageToNumber(b.voteCountLast1) - percentageToNumber(a.voteCountLast1)) {
            if (sortHeader.value.forward)
              return percentageToNumber(b.voteCountLast1) - percentageToNumber(a.voteCountLast1)
            else return percentageToNumber(a.voteCountLast1) - percentageToNumber(b.voteCountLast1)
          } else {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVoteCountLast1) - percentageToNumber(a.firstVoteCountLast1)
            else return percentageToNumber(a.firstVoteCountLast1) - percentageToNumber(b.firstVoteCountLast1)
          }
        else if (sortHeader.value.key === 'firstVotePercentage')
          if (percentageToNumber(b.firstVotePercentageLast1) - percentageToNumber(a.firstVotePercentageLast1)) {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVotePercentageLast1) - percentageToNumber(a.firstVotePercentageLast1)
            else return percentageToNumber(a.firstVotePercentageLast1) - percentageToNumber(b.firstVotePercentageLast1)
          } else {
            if (sortHeader.value.forward)
              return percentageToNumber(b.firstVoteCountLast1) - percentageToNumber(a.firstVoteCountLast1)
            else return percentageToNumber(a.firstVoteCountLast1) - percentageToNumber(b.firstVoteCountLast1)
          }
        else {
          if (sortHeader.value.forward)
            return percentageToNumber(b.firstVoteCountLast1) - percentageToNumber(a.firstVoteCountLast1)
          else return percentageToNumber(a.firstVoteCountLast1) - percentageToNumber(b.firstVoteCountLast1)
        }
      })
      .map((item, index, arr) => {
        let i = index
        for (i; i >= 0; i--) {
          if (sortHeader.value.key === 'voteCount') {
            if (arr[i].voteCountLast1 != item.voteCountLast1) break
          } else if (sortHeader.value.key === 'firstVotePercentage') {
            if (arr[i].firstVotePercentageLast1 != item.firstVotePercentageLast1) break
          } else {
            if (arr[i].firstVoteCountLast1 != item.firstVoteCountLast1) break
          }
        }
        item.displayRankLast1 = i + 2
        return item
      })
      // sort for this result
      .sort((a, b) => {
        if (percentageToNumber(b[sortHeader.value.key]) - percentageToNumber(a[sortHeader.value.key])) {
          if (sortHeader.value.forward)
            return percentageToNumber(b[sortHeader.value.key]) - percentageToNumber(a[sortHeader.value.key])
          else return percentageToNumber(a[sortHeader.value.key]) - percentageToNumber(b[sortHeader.value.key])
        } else {
          if (sortHeader.value.forward)
            return percentageToNumber(b.firstVoteCount) - percentageToNumber(a.firstVoteCount)
          else return percentageToNumber(a.firstVoteCount) - percentageToNumber(b.firstVoteCount)
        }
      })
      .map((item, index, arr) => {
        let i = index
        for (i; i >= 0; i--) {
          if (arr[i][sortHeader.value.key] != item[sortHeader.value.key]) break
        }
        item.displayRank = i + 2
        return item
      })
      .filter((item) => item.voteCount <= maxCount.value && item.voteCount >= minCount.value)
      .filter((item) => {
        if (keyword.value != '') {
          for (const item2 of searchRange.value) {
            if (item[item2].match(new RegExp(keyword.value, 'i'))) {
              return true
            }
          }
          return false
        } else return true
      })
  )
})
function percentageToNumber(key: string | number): number {
  if (typeof key === 'number') return key
  else {
    return Number(key.substring(0, key.length - 1)) || 0
  }
}
const lineExpanded = ref<boolean[]>([])
watch(
  resultCharactersForDisplay.value,
  () => {
    lineExpanded.value = new Array(resultCharacters.value.length).fill(null).map(() => false)
  },
  { deep: true }
)

const maxCount = computed<number>(() =>
  Number(
    route.query.maxCount
      ? Array.isArray(route.query.maxCount)
        ? route.query.maxCount[0]
        : route.query.maxCount
      : 99999
  )
)
const minCount = computed<number>(() =>
  Number(
    route.query.minCount ? (Array.isArray(route.query.minCount) ? route.query.minCount[0] : route.query.minCount) : 0
  )
)
const keyword = computed<string>(() =>
  String(route.query.keyword ? (Array.isArray(route.query.keyword) ? route.query.keyword[0] : route.query.keyword) : '')
)
const searchRange = computed<('characterOrigin' | 'name' | 'nameJpn')[]>(() => {
  const searchRangeNumber = Number(
    route.query.searchRange
      ? Array.isArray(route.query.searchRange)
        ? route.query.searchRange[0]
        : route.query.searchRange
      : 7
  )
  switch (searchRangeNumber) {
    case 1:
      return ['nameJpn']
    case 2:
      return ['name']
    case 3:
      return ['nameJpn', 'name']
    case 4:
      return ['characterOrigin']
    case 5:
      return ['characterOrigin', 'nameJpn']
    case 6:
      return ['characterOrigin', 'name']
    case 7:
      return ['characterOrigin', 'name', 'nameJpn']
    default:
      return ['characterOrigin', 'name', 'nameJpn']
  }
})

const URLQuery = computed(() => route.query)
watch(
  URLQuery,
  () => {
    updateSortHeader('voteCount')
    sortHeader.value.forward = true
  },
  { deep: true }
)

const {
  result,
  loading: queryRankingLoading,
  onError: queryRankingError,
} = useQuery<Query>(
  gql`
    query ($query: String, $voteStart: DateTimeUtc!, $voteYear: Int!) {
      queryCharacterRanking(query: $query, voteStart: $voteStart, voteYear: $voteYear) {
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
          voteCountLast1
          voteCountLast2
          firstVoteCount
          firstVoteCountLast1
          firstVoteCountLast2
          firstVotePercentage
          firstVotePercentageLast1
          firstVotePercentageLast2
          votePercentage
          votePercentageLast1
          votePercentageLast2
          firstPercentage
          nameJpn
          characterType
          characterOrigin
          firstAppearance
        }
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2023, 11, 29, 10)),
    voteYear: 11,
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
      // @ts-expect-error
      resultCharacters.value = JSON.parse(JSON.stringify(result.value.queryCharacterRanking.entries)).map((item) => {
        item.voteCountLast1 = item.voteCountLast1 < 0 ? '-' : item.voteCountLast1
        item.voteCountLast2 = item.voteCountLast2 < 0 ? '-' : item.voteCountLast2
        item.firstVoteCountLast1 = item.firstVoteCountLast1 < 0 ? '-' : item.firstVoteCountLast1
        item.firstVoteCountLast2 = item.firstVoteCountLast2 < 0 ? '-' : item.firstVoteCountLast2
        item.firstVotePercentage = toPercentageString(item.firstVotePercentage)
        item.firstVotePercentageLast1 =
          item.firstVotePercentageLast1 < 0 ? '-' : toPercentageString(item.firstVotePercentageLast1)
        item.firstVotePercentageLast2 =
          item.firstVotePercentageLast2 < 0 ? '-' : toPercentageString(item.firstVotePercentageLast2)
        item.votePercentage = toPercentageString(item.votePercentage)
        item.votePercentageLast1 = item.votePercentageLast1 < 0 ? '-' : toPercentageString(item.votePercentageLast1)
        item.votePercentageLast2 = item.votePercentageLast2 < 0 ? '-' : toPercentageString(item.votePercentageLast2)
        item.firstPercentage = toPercentageString(item.firstPercentage)
        item.firstAppearance = toTimeFormat(item.firstAppearance)
        return item
      })
    }
  }
})
queryRankingError((err) => {
  alert(err.message)
  console.log(err.message)
})

const search = ref(false)
function openSearch() {
  search.value = true
}
</script>
<route lang="yaml">
meta:
  navid: character
</route>
