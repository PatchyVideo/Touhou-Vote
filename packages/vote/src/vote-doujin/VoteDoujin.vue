<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col">
    <NavVote VoteType="doujin" />

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <div class="baseBoxRoundedShadow p-1 w-full space-y-2">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>{{ '提名作品(' + doujinValid.length + '/' + doujins.length + ')' }}</div>
        </div>
        <div class="innerBox p-2 space-y-2">
          <transition name="doujin" mode="out-in">
            <div v-if="!doujinValid.length" key="no-selecting" class="w-full text-center py-10 space-y-2">
              <div>请点击下方的按钮</div>
              <div>提名一个对您来说印象最深刻，最想推荐给它人的作品吧!</div>
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
              class="baseBoxRoundedShadow flex flex-row justify-center items-center cursor-pointer select-none p-2"
              @click="openEditDoujin()"
            >
              <icon-uil-plus class="text-lg" />
              <div>添加提名</div>
            </div>
          </transition>
        </div>
      </div>

      <button
        :class="{ buttonDisabled: !doujinValid.length || loading }"
        class="w-full py-2 flex items-center space-x-1 justify-center"
        @click="!doujinValid.length || vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>
          {{ doujinValid.length ? (loading ? '提交中...' : '提交!') : '请提名至少一个作品哦' }}
        </label>
      </button>
    </div>
  </div>
  <EditDoujin v-model:open="editDoujinOpen" :index="editDoujinIndex" />
  <VoteMessageBox v-model:open="noticeOpen" title="关于作品提名">
    <div class="flex flex-col overflow-auto">
      <div class="space-y-1 p-2">
        <p class="indent-lg">欢迎来到新版中文东方人气投票的作品提名部门。</p>
        <p class="indent-lg">
          您可通过本部门的提名页面，对于<strong> 最近3年内发布 </strong>的让您觉得
          <strong> 印象最深刻，最想推荐给它人 </strong>
          的作品进行提名。（由于是第一次举办，故接受最近3年内发布的作品，从下一届开始将仅接受一年内）
        </p>
        <br />
        <p class="indent-lg">
          如果票数足够多，我们会根据大家的提名投票情况和不同的作品分类来选出
          <strong>【年度最受欢迎/最有影响力/最具创意的xx类作品】</strong>等奖项。
        </p>
        <p class="indent-lg">根据举办情况，还可能会邀请相应行业的专业人士进行点评哦！</p>
        <p class="indent-lg">本系统尚在摸索阶段，可能会有诸多不足之处，还请各位谅解，感谢大家的支持！</p>
        <br />
        <p class="italic text-sm">*本活动最终解释权归THBWiki所有</p>
      </div>
      <button class="w-full py-2 flex items-center space-x-1 justify-center" @click="() => (confirmedNotice = true)">
        我知道了
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import NProgress from 'nprogress'
import NavVote from '@/common/components/NavVote.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import DoujinCard from '@/vote-doujin/components/DoujinCard.vue'
import EditDoujin from '@/vote-doujin/components/EditDoujin.vue'
import { doujins, updateVoteDataDoujins } from '@/vote-doujin/lib/voteData'
import { doujinValid } from '@/vote-doujin/lib/doujinList'
import { gql, useMutation, useQuery, useResult } from '@/graphql'
import type { Mutation, Query } from '@/graphql'
import { voteDoujinComplete, voteToken } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { popMessageText } from '@/common/lib/popMessage'

setSiteTitle('提名作品')

const router = useRouter()

const confirmedNotice = useLocalStorage('confirmedDoujinNotice', false)
const noticeOpen = computed<boolean>({
  get() {
    return !confirmedNotice.value
  },
  set(value) {
    confirmedNotice.value = !value
  },
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
  router.push({ path: '/', query: { tab: 2 } })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
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
