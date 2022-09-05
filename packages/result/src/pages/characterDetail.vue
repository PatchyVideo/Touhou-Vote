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
      * 更高级的搜索功能可以点击右下角的图标展开高级搜索框<br />
      * 如果在移动端觉得表格过于拥挤可以尝试打开浏览器的“电脑UA（桌面端网站）”功能<br />
      * 点 + 号或者表格行本身可展开详情，点击详情链接可以查看更加详尽的角色投票数据<br />
      * 点击表头可进行其他类型的排序，排序规则如下：<br />
      <div class="pl-4">
        1. 同票数的都是同一个名次<br />
        2. 同一个名次时，靠本命票数决定先后顺序<br />
        3. 当有并列名次时，占据虚位，下一个名次要顺位递推（如 3,3,5 或 10,10,10,13 ）<br />
        4. 同一个名次，本命票也一样的情况下，靠角色的系统ID排序<br />
        5. 对于0票的对象，参照第4条排序在列表最后
      </div>
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
          <div v-for="(item2, index) in resultCharactersForDisplay" :key="item2.rank" class="relative">
            <div
              class="p-1 max-w-30 md:max-w-none border-t border-accent-600 flex flex-nowrap items-center"
              :class="{ 'pb-66': lineExpanded[index] }"
            >
              <div
                v-if="item.key === headerFixed[0].key"
                class="min-w-8 cursor-pointer"
                :class="lineExpanded[index] ? 'i-uil:minus' : 'i-uil:plus'"
                @click="lineExpanded[index] = !lineExpanded[index]"
              ></div>
              <div class="px-2 truncate">{{ item2[item.key] }}</div>
            </div>
            <!-- Folder -->
            <div
              v-if="lineExpanded[index] && item.key === headerFixed[0].key"
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
            @click="updateSortHeader(item.key)"
          >
            <div>{{ item.name }}</div>
            <div class="cursor-pointer">
              <div
                v-if="sortHeader.key === item.key"
                :class="sortHeader.forward ? 'i-uil:sort-amount-down' : 'i-uil:sort-amount-up'"
              ></div>
              <div
                v-else
                class="i-uil:arrows-v transition transition-colors text-gray-300 md:text-white hover:text-black cursor-pointer"
              ></div>
            </div>
          </div>
          <!-- Content -->
          <div v-for="(item2, index) in resultCharactersForDisplay" :key="item2.rank" class="relative">
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
  <characterDetailSearch v-model:open="search" :querymode="true" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import { getAdditionalConstraintString } from '@/lib/decodeAdditionalConstraint'
import NProgress from 'nprogress'
import characterDetailSearch from '@/components/characterDetailSearch.vue'

setSiteTitle('角色部门结果 - 第⑩回 中文东方人气投票')

const route = useRoute()

type HeaderKey =
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
interface Header {
  name: string
  key: HeaderKey
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
const totalUniqueItemsCharacter = ref(0)
const totalFirstCharacter = ref(0)
const totalVotesCharacter = ref(0)
const averageVotesPerItemCharacter = ref(0)
const medianVotesPerItemCharacter = ref(0)
interface ResultCharacter {
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
}
const resultCharacters = ref<ResultCharacter[]>([])
const resultCharactersForDisplay = computed<ResultCharacter[]>(() => {
  return resultCharacters.value
    .sort((a, b) => {
      if (percentageToNumber(b[sortHeader.value.key]) - percentageToNumber(a[sortHeader.value.key])) {
        if (sortHeader.value.forward)
          return percentageToNumber(b[sortHeader.value.key]) - percentageToNumber(a[sortHeader.value.key])
        else return percentageToNumber(a[sortHeader.value.key]) - percentageToNumber(b[sortHeader.value.key])
      } else {
        if (sortHeader.value.forward) return percentageToNumber(b.firstVoteCount) - percentageToNumber(a.firstVoteCount)
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
const additionalConstraint = computed(() =>
  String(route.query.a ? (Array.isArray(route.query.a) ? route.query.a[0] : route.query.a) : '')
)
watch(additionalConstraint, () => {
  queryRankingFetchMore({
    variables:
      getAdditionalConstraintString(additionalConstraint.value) === ''
        ? {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          }
        : {
            query: getAdditionalConstraintString(additionalConstraint.value),
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          },
    updateQuery(previousQueryResult, { fetchMoreResult }) {
      if (!fetchMoreResult) return previousQueryResult
      return fetchMoreResult
    },
  })
})
const queryword = computed(() =>
  String(route.query.q ? (Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '')
)
watch(queryword, () => {
  queryRankingFetchMore({
    variables:
      queryword.value === ''
        ? {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          }
        : {
            query: queryword.value,
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          },
    updateQuery(previousQueryResult, { fetchMoreResult }) {
      if (!fetchMoreResult) return previousQueryResult
      return fetchMoreResult
    },
  })
})
const GUIMode = computed(() =>
  Number(route.query.gui ? (Array.isArray(route.query.gui) ? route.query.gui[0] : route.query.gui) : 1)
)
watch(GUIMode, () => {
  queryRankingFetchMore({
    variables: GUIMode.value
      ? getAdditionalConstraintString(additionalConstraint.value) === ''
        ? {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          }
        : {
            query: getAdditionalConstraintString(additionalConstraint.value),
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
          }
      : queryword.value === ''
      ? {
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
        }
      : {
          query: queryword.value,
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
        },
    updateQuery(previousQueryResult, { fetchMoreResult }) {
      if (!fetchMoreResult) return previousQueryResult
      return fetchMoreResult
    },
  })
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
  fetchMore: queryRankingFetchMore,
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
  GUIMode.value
    ? getAdditionalConstraintString(additionalConstraint.value) === ''
      ? {
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
        }
      : {
          query: getAdditionalConstraintString(additionalConstraint.value),
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
        }
    : queryword.value === ''
    ? {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
      }
    : {
        query: queryword.value,
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
      // @ts-expect-error
      resultCharacters.value = JSON.parse(JSON.stringify(result.value.queryCharacterRanking.entries)).map((item) => {
        item.firstVotePercentage = toPercentageString(item.firstVotePercentage)
        item.votePercentage = toPercentageString(item.votePercentage)
        item.firstPercentage = toPercentageString(item.firstPercentage)
        item.malePercentagePerChar = toPercentageString(item.malePercentagePerChar)
        item.femalePercentagePerChar = toPercentageString(item.femalePercentagePerChar)
        item.malePercentagePerTotal = toPercentageString(item.malePercentagePerTotal)
        item.femalePercentagePerTotal = toPercentageString(item.femalePercentagePerTotal)
        return item
      })
    }
  }
})
queryRankingError((err) => {
  alert(err.message)
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
