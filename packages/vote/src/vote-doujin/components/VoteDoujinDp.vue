<template>
  <div v-if="confirmedNotice">
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">
        提名作品 (<icon-uil-spinner-alt
          v-if="getSubmitDojinVoteLoading"
          class="align-text-bottom animate-spin"
        /><template v-else>{{ doujinValid.length }}</template
        >/{{ doujins.length }})
      </h2>
      <span class="text-gray-700"
        >为喜欢的同人作品提名
        <span class="cursor-pointer hover:text-gray-900" tabindex="0" @click="() => (confirmedNotice = false)"
          >[阅读须知]</span
        ></span
      >
    </div>
    <div class="flex flex-col gap-2 mt-1 max-w-80ch">
      <div v-for="(doujin, index) in doujinValid" :key="doujin.url" @click="openEditDoujin(index)">
        <DoujinCardDp v-model:doujin="doujinValid[index]" />
      </div>
      <button
        v-if="doujinValid.length < doujins.length"
        class="flex flex-row justify-center items-center py-3 w-full rounded-md border-2 border-accent-color-200 hover:shadow-md hover:border-accent-color-300 transition-all ease-in-out"
        @click="() => openEditDoujin()"
      >
        <icon-uil-plus class="text-xl" />
        <div class="text-lg">添加提名</div>
      </button>
      <button
        :class="{ 'bg-accent-color-300': !doujinValid.length || loading }"
        class="inline-block mx-auto px-16 py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        @click="!doujinValid.length || vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" />
        {{ doujinValid.length ? (loading ? '提交中...' : '提交!') : '请提名至少一个作品哦' }}
      </button>
    </div>
    <EditDoujin v-model:open="editDoujinOpen" :index="editDoujinIndex" />
  </div>
  <div v-else class="grid place-items-center w-full h-full">
    <div class="flex flex-col overflow-auto max-w-80ch">
      <h2 class="mx-auto text-2xl">关于作品提名</h2>
      <div class="space-y-2 p-4">
        <br />
        <p class="indent-lg">
          欢迎来到新版中文东方人气投票的作品提名部门。
        </p>
        <br />
        <p class="indent-lg">
          您可通过本部门的提名页面，对于<strong> 最近3年内发布 </strong>的让您觉得
          <strong> 印象最深刻，最想推荐给它人 </strong>
          的作品进行提名。
        </p>
        <p class="indent-lg">
          （由于是第一次举办，故接受最近3年内发布的作品，从下一届开始将仅接受一年内）
        </p>
        <br />
        <p class="indent-lg">
          如果票数足够多，我们会根据大家的提名投票情况和不同的作品分类来选出
        </p>
        <p class="indent-lg">
          <strong>【年度最受欢迎/最有影响力/最具创意的xx类作品】</strong>等奖项。
        </p>
        <p class="indent-lg">
          根据举办情况，还可能会邀请相应行业的专业人士进行点评哦！
        </p>
        <br />
        <p class="indent-lg">由于是首次举办，尚在摸索阶段，可能会有诸多不足之处，还请各位谅解，感谢大家的支持！</p>
        <br />
        <p class="italic text-sm">*本活动最终解释权归THBWiki所有</p>
      </div>
      <button
        class="inline-block mx-auto px-8 py-2 rounded text-white bg-accent-color-600"
        @click="() => (confirmedNotice = true)"
      >
        我知道了
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import NProgress from 'nprogress'
import EditDoujin from '@/vote-doujin/components/EditDoujin.vue'
import DoujinCardDp from '@/vote-doujin/components/DoujinCardDp.vue'
import { doujins, updateVoteDataDoujins } from '@/vote-doujin/lib/voteData'
import { doujinValid } from '@/vote-doujin/lib/doujinList'
import { gql, useMutation, useQuery, useResult } from '@/graphql'
import type { Mutation, Query } from '@/graphql'
import { voteDoujinComplete, voteToken } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { popMessageText } from '@/common/lib/popMessage'

setSiteTitle('提名作品 - 第⑩回 中文东方人气投票')

const confirmedNotice = useLocalStorage('confirmedDoujinNotice', false)

const editDoujinOpen = ref(false)
const editDoujinIndex = ref(0)
function openEditDoujin(index = doujinValid.value.length): void {
  editDoujinIndex.value = index
  editDoujinOpen.value = true
}

const {
  result,
  loading: getSubmitDojinVoteLoading,
  onError: getSubmitDojinVoteError,
} = useQuery<Query>(
  gql`
    query ($voteToken: String!) {
      getSubmitDojinVote(voteToken: $voteToken) {
        dojins {
          dojinType
          url
          title
          author
          reason
          imageUrl
        }
      }
    }
  `,
  {
    voteToken: voteToken.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (getSubmitDojinVoteLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
const resultData = useResult(result, null, (data) => data?.getSubmitDojinVote)
watchEffect(() => {
  if (resultData.value) {
    updateVoteDataDoujins(resultData.value.dojins)
  }
})
getSubmitDojinVoteError((err) => {
  console.log(err.message)
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('获取投票信息失败！失败原因：' + err.message)
})

async function vote(): Promise<void> {
  mutate({ content: { voteToken: voteToken.value, dojins: doujinValid.value } })
}
const { mutate, loading, onDone, onError } = useMutation<Mutation>(
  gql`
    mutation ($content: DojinSubmitGQL!) {
      submitDojin(content: $content)
    }
  `
)
onDone((result) => {
  popMessageText('投票成功！')
  voteDoujinComplete.value = true
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
})
</script>
