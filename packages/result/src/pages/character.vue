<template>
  <div class="mx-1 my-3 min-h-80vh">
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">角色部门</h2>
        <span class="ml-3 text-xl">目录</span>
      </div>
      <div class="grid grid-cols-3 grid-rows-2 gap-1 text-center">
        <div>参投角色总数</div>
        <div>总本命票数</div>
        <div>总有效票数</div>
        <div>{{ totalUniqueItemsCharacter }}</div>
        <div>{{ totalFirstCharacter }}</div>
        <div>{{ totalVotesCharacter }}</div>
      </div>
    </div>

    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为人气投票角色部门的结果目录，请点击上面的对应项目查看详细数据。<br />
      *本届与上一届相同，数据展示的结构和层次均进行了重新的设计，本届的结果都在一个页面内集中展示。
    </div>

    <div class="md:m-4 p-1">
      <div class="grid p-1 md:grid-cols-2 gap-4 md:gap-8 bg-gray-50 bg-opacity-50 md:bg-opacity-0">
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

setSiteTitle('角色部门结果')

const pages = [
  {
    title: '本届投票结果',
    desc: '本届的所有角色投票信息均整理在该页面',
    to: '/characterDetail',
  },
  {
    title: '上届对比结果',
    desc: '与上一届的角色投票信息进行比对的页面',
    to: '/characterCompare',
  },
  {
    title: '投票演进比对',
    desc: '选择角色并对比其投票演进与变化的情况',
    to: '/characterEvolution',
  },
  // {
  //   title: '同投关系可视化',
  //   desc: '角色的同投率关系可视化',
  //   to: '/characterConnect',
  // },
]
const totalUniqueItemsCharacter = ref(-1)
const totalFirstCharacter = ref(-1)
const totalVotesCharacter = ref(-1)
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
    if (result.value.queryCharacterRanking.global) {
      totalUniqueItemsCharacter.value = result.value.queryCharacterRanking.global.totalUniqueItems
      totalFirstCharacter.value = result.value.queryCharacterRanking.global.totalFirst
      totalVotesCharacter.value = result.value.queryCharacterRanking.global.totalVotes
    }
  }
})
queryRankingError((err) => {
  alert(err.message)
  console.log(err.message)
})
</script>

<route lang="yaml">
meta:
  navid: character
</route>
