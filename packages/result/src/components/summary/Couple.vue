<template>
  <div class="mx-1 my-3">
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">CP部门</h2>
        <span class="ml-3 text-xl">目录</span>
      </div>
      <div class="grid grid-cols-3 grid-rows-2 gap-1 text-center">
        <div>参投CP总数</div>
        <div>总本命票数</div>
        <div>总有效票数</div>
        <div>{{ totalUniqueItemsCouple }}</div>
        <div>{{ totalFirstCouple }}</div>
        <div>{{ totalVotesCouple }}</div>
      </div>
    </div>

    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为人气投票CP部门的结果目录，请点击上面的对应项目查看详细数据。<br />
      *本届与上一届相同，数据展示的结构和层次均进行了重新的设计，本届的结果都在一个页面内集中展示。
    </div>

    <div class="md:m-4 p-1">
      <div class="grid p-1 md:grid-cols-1 gap-4 md:gap-8 bg-gray-50 bg-opacity-50 md:bg-opacity-0">
        <router-link
          v-for="item in pages"
          :key="item.title"
          :to="item.to"
          class="col-span-1 p-3 w-full max-w-100 md:mx-auto border border-accent-400 rounded opacity-80 bg-white cursor-pointer transition transition-all md:hover:-translate-1 md:hover:bg-accent-100 active:translate-1"
        >
          <div class="text-black text-xl font-bold">{{ item.title }}</div>
          <div class="text-gray-700">{{ item.desc }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'

const pages = [
  {
    title: '本届投票结果',
    desc: '本届的所有CP投票信息均整理在该页面',
    to: '/coupleDetail',
  },
]
const totalUniqueItemsCouple = ref(-1)
const totalFirstCouple = ref(-1)
const totalVotesCouple = ref(-1)
const {
  result,
  loading: queryRankingLoading,
  onError: queryRankingError,
} = useQuery<Query>(
  gql`
    query ($query: String, $voteStart: DateTimeUtc!, $voteYear: Int!) {
      queryCPRanking(query: $query, voteStart: $voteStart, voteYear: $voteYear) {
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
  if (result.value) {
    if (result.value.queryCPRanking.global) {
      totalUniqueItemsCouple.value = result.value.queryCPRanking.global.totalUniqueItems
      totalFirstCouple.value = result.value.queryCPRanking.global.totalFirst
      totalVotesCouple.value = result.value.queryCPRanking.global.totalVotes
    }
  }
})
queryRankingError((err) => {
  alert(err.message)
  console.log(err.message)
})
</script>
