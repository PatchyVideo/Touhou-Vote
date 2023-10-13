<template>
  <div class="page"></div>
  <!-- Character -->
  <div class="mt-1 mb-10 mx-1 max-w-260 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://s3c.lilywhite.cc/thvote/imgs/logo_reimu.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">角色部门</h2>
        <span class="ml-3 text-xl">速报信息</span>
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
      *同票数名次相同，相同名次的先后顺序以本命票数量、投票ID依次作为参考<br />
    </div>
    <!-- Form -->
    <div class="shadow rounded border border-accent-color-600 bg-white bg-opacity-80">
      <div class="flex flex-nowrap overflow-auto">
        <div
          v-for="item in headerCharacter"
          :key="item.key"
          class="border-r border-accent-color-600"
          :class="{ 'flex-grow': item.key === 'name' }"
        >
          <!-- Header -->
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">{{ item.name }}</div>
          <!-- Content -->
          <div v-for="item2 in resultCharacter" :key="item2.rank">
            <div class="py-1 px-3 truncate border-t border-accent-color-600">
              {{ item2[item.key] }}
            </div>
          </div>
        </div>
        <!-- Reason -->
        <div>
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">投票理由</div>
          <div v-for="item2 in resultCharacter" :key="item2.rank">
            <div
              class="py-1 px-3 truncate border-t border-accent-color-600 cursor-pointer text-accent-color-600 hover:text-accent-color-300 transition transition-colors"
              @click="openReason(item2.name, item2.rank, 'CHARACTER')"
            >
              点击查看
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Music -->
  <div class="mb-10 mx-1 max-w-260 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://s3c.lilywhite.cc/thvote/imgs/nav/music@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">音乐部门</h2>
        <span class="ml-3 text-xl">速报信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>参投曲目总数</div>
          <div>{{ totalUniqueItemsMusic }}</div>
        </div>
        <div>
          <div>总本命票数</div>
          <div>{{ totalFirstMusic }}</div>
        </div>
        <div>
          <div>总有效票数</div>
          <div>{{ totalVotesMusic }}</div>
        </div>
        <div>
          <div>全曲目平均得票数</div>
          <div>{{ averageVotesPerItemMusic }}</div>
        </div>
        <div>
          <div>中位曲目得票数</div>
          <div>{{ medianVotesPerItemMusic }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为音乐部门的票数排行简表。页面打开时已按票数排序，本命加权是指1本命票计算为2票。<br />
      *同票数名次相同，相同名次的先后顺序以本命票数量、投票ID依次作为参考<br />
    </div>
    <!-- Form -->
    <div class="shadow rounded border border-accent-color-600 bg-white bg-opacity-80">
      <div class="flex flex-nowrap overflow-auto">
        <div
          v-for="item in headerMusic"
          :key="item.key"
          class="border-r border-accent-color-600"
          :class="{ 'flex-grow': item.key === 'name' }"
        >
          <!-- Header -->
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">{{ item.name }}</div>
          <!-- Content -->
          <div v-for="item2 in resultMusic" :key="item2.rank">
            <div class="py-1 px-3 truncate border-t border-accent-color-600">
              {{ item2[item.key] }}
            </div>
          </div>
        </div>
        <!-- Reason -->
        <div>
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">投票理由</div>
          <div v-for="item2 in resultMusic" :key="item2.rank">
            <div
              class="py-1 px-3 truncate border-t border-accent-color-600 cursor-pointer text-accent-color-600 hover:text-accent-color-300 transition transition-colors"
              @click="openReason(item2.name, item2.rank, 'MUSIC')"
            >
              点击查看
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Couple -->
  <div class="mb-10 mx-1 max-w-380 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">CP部门</h2>
        <span class="ml-3 text-xl">速报信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>参投CP总数</div>
          <div>{{ totalUniqueItemsCouple }}</div>
        </div>
        <div>
          <div>总本命票数</div>
          <div>{{ totalFirstCouple }}</div>
        </div>
        <div>
          <div>总有效票数</div>
          <div>{{ totalVotesCouple }}</div>
        </div>

        <div>
          <div>全CP平均得票数</div>
          <div>{{ averageVotesPerItemCouple }}</div>
        </div>
        <div>
          <div>中位CP得票数</div>
          <div>{{ medianVotesPerItemCouple }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为CP部门的票数排行简表。页面打开时已按票数排序，本命加权是指1本命票计算为2票。<br />
      *同票数名次相同，相同名次的先后顺序以本命票数量、投票ID依次作为参考<br />
      *票数为1的CP不计入投票结果
    </div>
    <!-- Form -->
    <div class="shadow rounded border border-accent-color-600 bg-white bg-opacity-80">
      <div class="flex flex-nowrap overflow-auto">
        <div
          v-for="item in headerCouple"
          :key="item.key"
          class="border-r border-accent-color-600"
          :class="{ 'flex-grow': item.key === 'cp' }"
        >
          <!-- Header -->
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">{{ item.name }}</div>
          <!-- Content -->
          <div v-for="item2 in resultCouple" :key="item2.rank">
            <div class="py-1 px-3 truncate border-t border-accent-color-600">
              {{ item2[item.key] }}
            </div>
          </div>
        </div>
        <!-- Reason -->
        <div>
          <div class="py-1 px-3 whitespace-nowrap border-b border-accent-color-600">投票理由</div>
          <div v-for="item2 in resultCouple" :key="item2.rank">
            <div
              class="py-1 px-3 truncate border-t border-accent-color-600 cursor-pointer text-accent-color-600 hover:text-accent-color-300 transition transition-colors"
              @click="openReason(item2.cp, item2.rank, 'COUPLE')"
            >
              点击查看
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <VoteMessageBox v-model:open="reasonBoxOpen" :title="reasonTitle">
    <div class="overflow-auto">
      <div class="divide-y p-2">
        <div v-if="queryCharacterReasonLoading || queryMusicReasonLoading || queryCoupleReasonLoading">
          投票理由加载中...
        </div>
        <div v-else-if="reasonError">理由加载失败了QAQ</div>
        <div v-else>
          <div v-if="!reasonList.length">没有人填写投票理由QAQ</div>
          <div v-for="item in reasonList" :key="item" class="break-words">{{ item }}</div>
        </div>
      </div>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import NProgress from 'nprogress'
import { gql, useQuery, useLazyQuery } from '@/graphql'
import type { Query } from '@/graphql'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

setSiteTitle('结果速报')

interface HeaderCharacter {
  name: string
  key: 'displayRank' | 'name' | 'voteCount' | 'firstVoteCount' | 'firstVotePercentage'
}
interface HeaderMusic {
  name: string
  key: 'displayRank' | 'name' | 'voteCount' | 'firstVoteCount' | 'firstVotePercentage'
}
interface HeaderCouple {
  name: string
  key: 'displayRank' | 'cp' | 'voteCount' | 'firstVoteCount' | 'aActive' | 'bActive' | 'cActive' | 'noneActive'
}

const headerCharacter: HeaderCharacter[] = [
  { name: '名次', key: 'displayRank' },
  { name: '角色名', key: 'name' },
  { name: '票数（不含加权）', key: 'voteCount' },
  { name: '本命票数', key: 'firstVoteCount' },
  { name: '本命率', key: 'firstVotePercentage' },
]
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
  }[]
>([])
const headerMusic: HeaderMusic[] = [
  { name: '名次', key: 'displayRank' },
  { name: '曲目名', key: 'name' },
  { name: '票数（不含加权）', key: 'voteCount' },
  { name: '本命票数', key: 'firstVoteCount' },
  { name: '本命率', key: 'firstVotePercentage' },
]
const totalUniqueItemsMusic = ref(0)
const totalFirstMusic = ref(0)
const totalVotesMusic = ref(0)
const averageVotesPerItemMusic = ref(0)
const medianVotesPerItemMusic = ref(0)
const resultMusic = ref<
  {
    rank: number
    displayRank: number
    name: string
    voteCount: number
    firstVoteCount: number
    firstVotePercentage: string
  }[]
>([])
const headerCouple: HeaderCouple[] = [
  { name: '名次', key: 'displayRank' },
  { name: 'CP名', key: 'cp' },
  { name: '票数（不含加权）', key: 'voteCount' },
  { name: '本命票数', key: 'firstVoteCount' },
  { name: '第一角色主动率', key: 'aActive' },
  { name: '第二角色主动率', key: 'bActive' },
  { name: '第三角色主动率', key: 'cActive' },
  { name: '无主动率', key: 'noneActive' },
]
const totalUniqueItemsCouple = ref(0)
const totalFirstCouple = ref(0)
const totalVotesCouple = ref(0)
const averageVotesPerItemCouple = ref(0)
const medianVotesPerItemCouple = ref(0)
const resultCouple = ref<
  {
    rank: number
    displayRank: number
    cp: string
    voteCount: number
    firstVoteCount: number
    aActive: string
    bActive: string
    cActive: string
    noneActive: string
  }[]
>([])
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
        }
      }
      queryMusicRanking(voteStart: $voteStart, voteYear: $voteYear) {
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
        }
      }
      queryCPRanking(voteStart: $voteStart, voteYear: $voteYear) {
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
          cp {
            a
            b
            c
          }
          voteCount
          firstVoteCount
          firstVotePercentage
          aActive
          bActive
          cActive
          noneActive
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
        item.firstVotePercentage = (item.firstVotePercentage * 100).toFixed(2) + '%'
        return item
      })
    }
    if (result.value.queryMusicRanking) {
      totalUniqueItemsMusic.value = result.value.queryMusicRanking.global.totalUniqueItems
      totalFirstMusic.value = result.value.queryMusicRanking.global.totalFirst
      totalVotesMusic.value = result.value.queryMusicRanking.global.totalVotes
      averageVotesPerItemMusic.value = Math.round(result.value.queryMusicRanking.global.averageVotesPerItem)
      medianVotesPerItemMusic.value = result.value.queryMusicRanking.global.medianVotesPerItem
      // @ts-ignore:参数“item”隐式具有“any”类型
      resultMusic.value = JSON.parse(JSON.stringify(result.value.queryMusicRanking.entries)).map((item) => {
        item.firstVotePercentage = (item.firstVotePercentage * 100).toFixed(2) + '%'
        return item
      })
    }
    if (result.value.queryCPRanking) {
      totalUniqueItemsCouple.value = result.value.queryCPRanking.global.totalUniqueItems
      totalFirstCouple.value = result.value.queryCPRanking.global.totalFirst
      totalVotesCouple.value = result.value.queryCPRanking.global.totalVotes
      averageVotesPerItemCouple.value = Math.round(result.value.queryCPRanking.global.averageVotesPerItem)
      medianVotesPerItemCouple.value = result.value.queryCPRanking.global.medianVotesPerItem
      // @ts-ignore:参数“item”隐式具有“any”类型
      resultCouple.value = JSON.parse(JSON.stringify(result.value.queryCPRanking.entries)).map((item) => {
        item.cp = item.cp.a + ' x ' + item.cp.b + (item.cp.c ? ' x ' + item.cp.c : '')
        item.firstVotePercentage = (item.firstVotePercentage * 100).toFixed(2) + '%'
        item.aActive = (item.aActive * 100).toFixed(2) + '%'
        item.bActive = (item.bActive * 100).toFixed(2) + '%'
        item.cActive = item.cActive ? (item.cActive * 100).toFixed(2) + '%' : '-'
        item.noneActive = (item.noneActive * 100).toFixed(2) + '%'
        return item
      })
    }
  }
})
queryRankingError((err) => {
  console.log(err.message)
})

const reasonBoxOpen = ref(false)
const reasonTitle = ref<string>('')
const reasonRank = ref<number>(1)
const reasonList = ref<string[]>([])
const reasonError = ref(false)
function openReason(name: string, rank: number, type: 'CHARACTER' | 'MUSIC' | 'COUPLE') {
  reasonError.value = false
  reasonTitle.value = name + '的投票理由：'
  reasonRank.value = rank
  if (type === 'CHARACTER') {
    if (queryCharacterReasonforceDisabled.value) {
      loadCharacterReason(undefined, {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        rank: reasonRank.value,
      })
    } else
      queryCharacterReasonMore({
        variables: {
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
          rank: reasonRank.value,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult
          return fetchMoreResult
        },
      })
  } else if (type === 'MUSIC') {
    if (queryMusicReasonforceDisabled.value) {
      loadMusicReason(undefined, {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        rank: reasonRank.value,
      })
    } else
      queryMusicReasonMore({
        variables: {
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
          rank: reasonRank.value,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult
          return fetchMoreResult
        },
      })
  } else if (type === 'COUPLE') {
    if (queryCoupleReasonforceDisabled.value) {
      loadCoupleReason(undefined, {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        rank: reasonRank.value,
      })
    } else
      queryCoupleReasonMore({
        variables: {
          voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
          voteYear: 10,
          rank: reasonRank.value,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult
          return fetchMoreResult
        },
      })
  }
  reasonBoxOpen.value = true
}
const {
  result: resultCharacterReason,
  load: loadCharacterReason,
  loading: queryCharacterReasonLoading,
  onError: queryCharacterReasonError,
  fetchMore: queryCharacterReasonMore,
  forceDisabled: queryCharacterReasonforceDisabled,
} = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryCharacterReasons(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        reasons
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: reasonRank.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (resultCharacterReason.value) {
    reasonList.value = resultCharacterReason.value.queryCharacterReasons.reasons
  }
})
queryCharacterReasonError((err) => {
  reasonError.value = true
  console.log(err.message)
  alert('理由加载失败！')
})
const {
  result: resultMusicReason,
  load: loadMusicReason,
  loading: queryMusicReasonLoading,
  onError: queryMusicReasonError,
  fetchMore: queryMusicReasonMore,
  forceDisabled: queryMusicReasonforceDisabled,
} = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryMusicReasons(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        reasons
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: reasonRank.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (resultMusicReason.value) {
    reasonList.value = resultMusicReason.value.queryMusicReasons.reasons
  }
})
queryMusicReasonError((err) => {
  reasonError.value = true
  console.log(err.message)
  alert('理由加载失败！')
})
const {
  result: resultCoupleReason,
  load: loadCoupleReason,
  loading: queryCoupleReasonLoading,
  onError: queryCoupleReasonError,
  fetchMore: queryCoupleReasonMore,
  forceDisabled: queryCoupleReasonforceDisabled,
} = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryCPReasons(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        reasons
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: reasonRank.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (resultCoupleReason.value) {
    reasonList.value = resultCoupleReason.value.queryCPReasons.reasons
  }
})
queryCoupleReasonError((err) => {
  reasonError.value = true
  console.log(err.message)
  alert('理由加载失败！')
})
</script>
