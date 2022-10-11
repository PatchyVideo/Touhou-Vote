<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img :src="characterImg" class="w-10 h-10 col-span-1 row-span-2 rounded" />
        <h2 class="text-4xl font-light">{{ characterName }}</h2>
        <span class="ml-3 text-xl">角色信息</span>
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
          <div>投票理由</div>
          <router-link class="underline" v-if="numReasons > 0" :to="'/characterReason?rank=' + characterRank">{{
            numReasons + '(点此查看)'
          }}</router-link>
          <div v-else>{{ numReasons }}</div>
        </div>
      </div>
    </div>
    <div class="md:mx-5 p-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独角色的详细信息页面，下面每个栏目的内容分别有各自的说明<br />
    </div>
    <div class="md:mx-5 p-3"></div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { characterList } from '@touhou-vote/shared/data/character'
import { toPercentageString } from '@/lib/numberFormat'
import characterImages from '@/assets/defaultCharacterImage.png?url'

const route = useRoute()

const characterRank = ref(
  Number(route.query.rank ? (Array.isArray(route.query.rank) ? route.query.rank[0] : route.query.rank) : 1)
)
const characterName = ref('ID：' + characterRank.value)
const characterImg = computed(
  () => characterList.find((item) => item.name === characterName.value)?.image || characterImages
)
const voteCount = ref(-1)
const firstVoteCount = ref(-1)
const firstVotePercentage = ref<number | string>(-1)
const votePercentage = ref<number | string>(-1)
const firstPercentage = ref<number | string>(-1)
const numReasons = ref(-1)
const { result, loading, onError } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryCharacterSingle(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        name
        voteCount
        firstVoteCount
        firstVotePercentage
        votePercentage
        firstPercentage
        numReasons
      }
    }
  `,

  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: characterRank.value,
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
    if (result.value.queryCharacterSingle) {
      characterName.value = result.value.queryCharacterSingle.name
      setSiteTitle(characterName.value + ' - 第⑩回 中文东方人气投票')
      voteCount.value = result.value.queryCharacterSingle.voteCount
      firstVoteCount.value = result.value.queryCharacterSingle.firstVoteCount
      firstVotePercentage.value = toPercentageString(result.value.queryCharacterSingle.firstVotePercentage)
      votePercentage.value = toPercentageString(result.value.queryCharacterSingle.votePercentage)
      firstPercentage.value = toPercentageString(result.value.queryCharacterSingle.firstPercentage)
      numReasons.value = result.value.queryCharacterSingle.numReasons
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
  navid: character
</route>
