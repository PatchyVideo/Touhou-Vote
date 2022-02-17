<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - 提名系统</div>
    </div>

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <div class="p-1 rounded w-full space-y-2 shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>{{ '提名作品(' + doujinValid.length + '/' + doujins.length + ')' }}</div>
        </div>
        <div class="shadow-inner p-2 rounded bg-gray-50 bg-opacity-50 space-y-2">
          <transition name="doujin" mode="out-in">
            <div v-if="!doujinValid.length" key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
              <div>请点击下方的按钮</div>
              <div>提名一个对你来说印象最深刻，最想推荐给它人的作品吧!</div>
            </div>
            <div v-else key="selecting">
              <transition-group name="coupleList" tag="div">
                <div
                  v-for="(doujin, index) in doujinValid"
                  :key="doujin.url"
                  class="transition transition-all duration-200 mb-2"
                  @click="openEditDoujin(index)"
                >
                  <DoujinCard v-model:doujin="doujinValid[index]" />
                </div>
              </transition-group>
            </div>
          </transition>
          <transition name="addMore" mode="out-in">
            <div
              v-if="doujinValid.length < doujins.length"
              class="w-full shadow text-center bg-white cursor-pointer select-none p-2 rounded"
              @click="openEditDoujin()"
            >
              <icon-uil-plus class="text-lg" />
              <div>添加提名</div>
            </div>
          </transition>
        </div>
      </div>

      <button
        :class="{ 'bg-accent-color-300': !doujinValid.length || loading }"
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        @click="!doujinValid.length || vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>
          {{ doujinValid.length ? (loading ? '提交中...' : '提交!') : '请提名至少一个作品哦' }}
        </label>
      </button>
    </div>
  </div>
  <BackToHome :show="true" :saveable="false" />
  <EditDoujin v-model:open="editDoujinOpen" :index="editDoujinIndex" />
  <VoteMessageBox v-model:open="noticeOpen" title="用户须知">
    <div class="flex flex-col overflow-auto">
      <div class="space-y-1 p-2">
        <p class="indent-lg">
          欢迎来到新版中文东方人气投票的提名系统，您可通过本系统的提名页面，对于最近3年内
          <label class="font-bold"> 印象最深刻，最想推荐给它人 </label>
          的作品进行提名。
        </p>
        <p class="indent-lg">
          如果票数足够多，我们会根据大家的投票和不同的分类来选出
          <label class="font-bold">【年度最受欢迎/最有影响力/最具创意的xx类作品】</label>
          等奖项，还会邀请行业内专业人士进行点评哦！
        </p>
        <p class="indent-lg">由于是第一次举办这种活动，所以还有诸多不足之处，还请各位谅解，感谢大家的支持！</p>
        <p class="italic text-sm">*本活动最终解释权归THBWiki所有</p>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        @click="noticeOpen = false"
      >
        <label>我知道了</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doujins, updateVoteDataDoujins } from '@/vote-doujin/lib/voteData'
import { doujinValid } from '@/vote-doujin/lib/doujinList'
import DoujinCard from '@/vote-doujin/components/DoujinCard.vue'
import EditDoujin from '@/vote-doujin/components/EditDoujin.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import { useMutation, useQuery, gql, useResult } from '@/graphql'
import type { Mutation, Query } from '@/graphql'
import { voteToken, voteDoujinComplete } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import NProgress from 'nprogress'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

setSiteTitle('提名系统 - 第⑩回 中文东方人气投票')

const router = useRouter()

const noticeOpen = ref(false)
onMounted(() => {
  setTimeout(() => {
    noticeOpen.value = true
  }, 300)
})

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
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('获取投票信息失败！失败原因：' + err.message)
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
  alert('投票成功！')
  voteDoujinComplete.value = true
  router.push({ path: '/' })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('投票失败，请检查网络设置！')
})
</script>

<style lang="postcss" scoped>
.addMore-enter-active,
.addMore-leave-active,
.doujin-enter-active,
.doujin-leave-active {
  @apply transition-all duration-200;
}
.addMore-enter-from,
.addMore-leave-to,
.doujin-enter-from,
.doujin-leave-to {
  @apply opacity-0;
}
.doujin-enter-active,
.doujin-leave-active {
  @apply transition transition-all duration-200;
}

.doujin-enter-from,
.doujin-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
