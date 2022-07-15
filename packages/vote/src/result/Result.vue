<template>
  <div class="page"></div>
  <!-- Character -->
  <div class="mt-1 mb-10 mx-1 max-w-250 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png"
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
      </div>
    </div>
  </div>
  <!-- Music -->
  <div class="mb-10 mx-1 max-w-250 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png/100px-THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png"
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
          <div>中位角色得票数</div>
          <div>{{ medianVotesPerItemMusic }}</div>
        </div>
      </div>
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
      </div>
    </div>
  </div>
  <!-- Couple -->
  <div class="mb-10 mx-1 max-w-350 md:mx-auto">
    <!-- Overview -->
    <div
      class="mb-2 md:mb-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/0/02/THBWiki-LOGO-%E4%B8%89%E6%9C%88%E7%B2%BE.png/100px-THBWiki-LOGO-%E4%B8%89%E6%9C%88%E7%B2%BE.png"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import NProgress from 'nprogress'
import { gql, useQuery, useResult } from '@/graphql'
import type { Query } from '@/graphql'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle('结果速报 - 第⑩回 中文东方人气投票')

interface Header {
  name: string
  key: string
}

const headerCharacter: Header[] = [
  { name: '名次', key: 'rank' },
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
    name: string
    voteCount: number
    firstVoteCount: number
    firstVotePercentage: string
  }[]
>([])
const headerMusic: Header[] = [
  { name: '名次', key: 'rank' },
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
    name: string
    voteCount: number
    firstVoteCount: number
    firstVotePercentage: string
  }[]
>([])
const headerCouple: Header[] = [
  { name: '名次', key: 'rank' },
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
const resultData = useResult(result, null, (data) => data)
watchEffect(() => {
  if (resultData.value) {
    if (resultData.value.queryCharacterRanking) {
      totalUniqueItemsCharacter.value = resultData.value.queryCharacterRanking.global.totalUniqueItems
      totalFirstCharacter.value = resultData.value.queryCharacterRanking.global.totalFirst
      totalVotesCharacter.value = resultData.value.queryCharacterRanking.global.totalVotes
      averageVotesPerItemCharacter.value = Math.round(resultData.value.queryCharacterRanking.global.averageVotesPerItem)
      medianVotesPerItemCharacter.value = resultData.value.queryCharacterRanking.global.medianVotesPerItem
      resultCharacter.value = JSON.parse(JSON.stringify(resultData.value.queryCharacterRanking.entries)).map((item) => {
        item.firstVotePercentage = (item.firstVotePercentage * 100).toFixed(2) + '%'
        return item
      })
    }
    if (resultData.value.queryMusicRanking) {
      totalUniqueItemsMusic.value = resultData.value.queryMusicRanking.global.totalUniqueItems
      totalFirstMusic.value = resultData.value.queryMusicRanking.global.totalFirst
      totalVotesMusic.value = resultData.value.queryMusicRanking.global.totalVotes
      averageVotesPerItemMusic.value = Math.round(resultData.value.queryMusicRanking.global.averageVotesPerItem)
      medianVotesPerItemMusic.value = resultData.value.queryMusicRanking.global.medianVotesPerItem
      resultMusic.value = JSON.parse(JSON.stringify(resultData.value.queryMusicRanking.entries)).map((item) => {
        item.firstVotePercentage = (item.firstVotePercentage * 100).toFixed(2) + '%'
        return item
      })
    }
    if (resultData.value.queryCPRanking) {
      totalUniqueItemsCouple.value = resultData.value.queryCPRanking.global.totalUniqueItems
      totalFirstCouple.value = resultData.value.queryCPRanking.global.totalFirst
      totalVotesCouple.value = resultData.value.queryCPRanking.global.totalVotes
      averageVotesPerItemCouple.value = Math.round(resultData.value.queryCPRanking.global.averageVotesPerItem)
      medianVotesPerItemCouple.value = resultData.value.queryCPRanking.global.medianVotesPerItem
      resultCouple.value = JSON.parse(JSON.stringify(resultData.value.queryCPRanking.entries)).map((item) => {
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
  alert(err.message)
})
</script>
