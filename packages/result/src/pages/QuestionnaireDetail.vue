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
        <h2 class="text-4xl font-light">问卷部门</h2>
        <span class="ml-3 text-xl">结果信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 text-sm md:text-base text-center">
        <div>
          <div>总投票人数</div>
          <div>{{ numVote }}</div>
        </div>
        <div>
          <div>角色部门票数</div>
          <div>{{ numChar }}</div>
        </div>
        <div>
          <div>音乐部门票数</div>
          <div>{{ numMusic }}</div>
        </div>
        <div>
          <div>CP部门票数</div>
          <div>{{ numCp }}</div>
        </div>
        <div>
          <div>作品题名票数</div>
          <div>{{ numDoujin }}</div>
        </div>
      </div>
    </div>
    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独问卷的详细信息页面，下面每个栏目的内容分别有各自的说明。<br />
      * 投票理由请在基本信息的投票理由链接中查看。<br />
    </div>
    <!-- Form for meta profile -->
    <div class="md:m-5 px-3 py-1 text-2xl border-b">投票结果基本信息</div>
    <!-- Vote evolution -->
    <div class="md:m-5 px-3 py-1 text-2xl border-b">投票演进</div>
    <!-- Graph for questionnaire -->
    <div class="md:m-5 px-3 py-1 text-2xl border-b">问卷填写情况</div>
    <!-- Detail for questionnaire -->
    <div class="md:m-5 px-3 py-1 text-2xl border-b">问卷回答情况</div>
  </div>
</template>
<script lang="ts" setup>
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'

setSiteTitle('问卷部门结果 - 第⑩回 中文东方人气投票')

const numVote = ref(0)
const numChar = ref(0)
const numMusic = ref(0)
const numCp = ref(0)
const numDoujin = ref(0)

const { result, loading, onError } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!) {
      queryGlobalStats(voteStart: $voteStart, voteYear: $voteYear) {
        numVote
        numChar
        numMusic
        numCp
        numDoujin
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
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
    if (result.value.queryGlobalStats) {
      numVote.value = result.value.queryGlobalStats.numVote
      numChar.value = result.value.queryGlobalStats.numChar
      numMusic.value = result.value.queryGlobalStats.numMusic
      numCp.value = result.value.queryGlobalStats.numCp
      numDoujin.value = result.value.queryGlobalStats.numDoujin
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log('获取信息失败！')
})
</script>
