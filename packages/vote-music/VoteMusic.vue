<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - 音乐部门</div>
    </div>

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>本命曲目</div>
          <icon-uil-arrows-h
            v-show="musicHonmei.id != music0.id"
            class="cursor-pointer"
            @click="
              () => {
                musicHonmeiIsSelected = true
                musicSelectOpen = true
              }
            "
          />
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50">
          <transition name="musicHonmei" mode="out-in">
            <div v-if="musicHonmei.honmei" key="selecting">
              <MusicHonmeiCard v-model:music-honmei="musicHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
              <div>可以从喜欢的曲目中选择一首</div>
              <div
                class="underline cursor-pointer transition hover:text-gray-500"
                @click="
                  () => {
                    musicHonmeiIsSelected = true
                    musicSelectOpen = true
                  }
                "
              >
                把它选为你的本命曲哦
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>
            {{ '我喜欢的曲目(' + musicsReverseWithoutHonmei.length + '/' + (musicHonmei.honmei ? '11)' : '12)') }}
          </div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': musicsVotedNumber === 12 }"
            @click="
              musicsVotedNumber === 12
                ? ''
                : (() => {
                    musicHonmeiIsSelected = false
                    musicSelectOpen = true
                  })()
            "
          ></icon-uil-plus>
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50 whitespace-nowrap overflow-x-auto">
          <transition name="music" mode="out-in">
            <div v-if="musicsReverseWithoutHonmei.length">
              <transition-group name="musicList" tag="div">
                <div
                  v-for="(music, index) in musicsReverseWithoutHonmei"
                  :key="music.id"
                  class="inline-block transition transition-all duration-200 mr-3 w-3/10"
                >
                  <MusicCard v-model:music="musicsReverseWithoutHonmei[index]" />
                </div>
              </transition-group>
            </div>
            <div v-else class="w-full text-center text-gray-400 py-15">请为您喜爱的曲目投上一票吧!</div>
          </transition>
        </div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': !musicsVotedNumber }"
        @click="musicsVotedNumber ? (confirmBoxOpen = true) : ''"
      >
        {{ musicsVotedNumber ? '提交!' : '请投票' }}
      </button>
    </div>
  </div>
  <MusicSelect
    v-model:open="musicSelectOpen"
    v-model:musicSelected="musics[musicsVotedNumber]"
    :music-honmei-is-selected="musicHonmeiIsSelected"
  />
  <VoteMessageBox v-model:open="confirmBoxOpen" title="请确定投票内容：">
    <div class="overflow-auto">
      <div class="divide-y p-2">
        <div v-if="musicHonmei.honmei" class="py-1 text-accent-color-600">
          <div class="text-lg">
            {{ '本命位：' + musicHonmei.name }}
          </div>
          <div class="truncate">{{ '专辑：' + musicHonmei.album }}</div>
          <div class="">{{ '投票理由：' + (musicHonmei.reason ? musicHonmei.reason : '无') }}</div>
        </div>
        <div v-for="(music, index) in musicsReverseWithoutHonmei" :key="music.id" class="py-1">
          <div class="">
            {{ '投票位' + (index + 1) + '：' + music.name }}
          </div>
          <div class="text-sm truncate">{{ '专辑：' + music.album }}</div>
          <div class="text-sm">{{ '投票理由：' + (music.reason ? music.reason : '无') }}</div>
        </div>
        <div class="text-gray-500 italic">*票位序号仅给用户参考，不影响加权<br />*投票期间可随时更改投票内容哦</div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': loading }"
        @click="vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>{{
          loading ? '投票中' : '确认投票！'
        }}</label>
      </button>
    </div>
  </VoteMessageBox>
  <BackToHome :show="true" :saveable="false" />
</template>

<script lang="ts" setup>
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import MusicSelect from './components/MusicSelect.vue'
import MusicCard from '@/vote-music/components/MusicCard.vue'
import MusicHonmeiCard from './components/MusicHonmeiCard.vue'
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { music0 } from '@/vote-music/lib/music'
import { musicsReverse, musicsReverseWithoutHonmei } from '@/vote-music/lib/musicList'
import { musicHonmei, musics, updateVotemusics } from '@/vote-music/lib/voteData'
import { useMutation, useQuery, gql, useResult } from '@/graphql'
import type { Mutation, Query, schema } from '@/graphql'
import { voteToken, voteMusicComplete } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import NProgress from 'nprogress'

setSiteTitle('音乐部门 - 第⑩回 中文东方人气投票')

const router = useRouter()

const {
  result,
  loading: getSubmitMusicVoteLoading,
  onError: getSubmitMusicVoteError,
} = useQuery<Query>(
  gql`
    query ($voteToken: String!) {
      getSubmitMusicVote(voteToken: $voteToken) {
        music {
          name
          first
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
  if (getSubmitMusicVoteLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
const resultData = useResult(result, null, (data) => data?.getSubmitMusicVote)
watchEffect(() => {
  if (resultData.value) {
    updateVotemusics(resultData.value.music)
  }
})
getSubmitMusicVoteError((err) => {
  console.log(err.message)
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('获取投票信息失败！失败原因：' + err.message)
})

const musicsVotedNumber = computed<number>(() => musicsReverse.value.length)

const musicSelectOpen = ref(false)
const musicHonmeiIsSelected = ref(false)

const confirmBoxOpen = ref(false)

const MusicSubmit = computed<schema.MusicSubmit[]>(() =>
  musics.value
    .filter((item) => item.id != '')
    .map((item) => {
      return {
        name: item.name,
        reason: item.reason,
        first: item.honmei,
      }
    })
)
async function vote(): Promise<void> {
  mutate({ content: { voteToken: voteToken.value, musics: MusicSubmit.value } })
}
const { mutate, loading, onDone, onError } = useMutation<Mutation>(
  gql`
    mutation ($content: MusicSubmitGQL!) {
      submitMusicVote(content: $content)
    }
  `
)
onDone((result) => {
  alert('投票成功！')
  voteMusicComplete.value = true
  router.push({ path: '/' })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('投票失败，请检查网络设置！')
})
</script>
<style lang="postcss" scoped>
.music-enter-active,
.music-leave-active,
.musicHonmei-enter-active,
.musicHonmei-leave-active {
  @apply transition-all duration-200;
}
.music-enter-from,
.music-leave-to,
.musicHonmei-enter-from,
.musicHonmei-leave-to {
  @apply opacity-0;
}
.musicList-leave-active {
  @apply absolute;
  @apply max-w-30;
}

.musicList-enter,
.musicList-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
