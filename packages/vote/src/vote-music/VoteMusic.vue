<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col">
    <NavVote VoteType="music" />

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <transition name="musicHonmei" mode="out-in">
        <div v-if="musicsVoted.length" class="baseBoxRoundedShadow p-1 w-full">
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
          <div class="innerBox p-2">
            <div v-if="musicHonmei.id != music0.id" key="selecting">
              <MusicHonmeiCard v-model:music-honmei="musicHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full text-center py-10 space-y-2">
              <div>可以从喜欢的曲目中选择一首</div>
              <div
                @click="
                  () => {
                    musicHonmeiIsSelected = true
                    musicSelectOpen = true
                  }
                "
              >
                <strong class="underline cursor-pointer transition hover:text-accent-color-300">
                  点击这里把它选为您的本命曲哦
                </strong>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="baseBoxRoundedShadow p-1 w-full">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>
            {{
              '我喜欢的曲目(' +
              musicsVotedWithoutHonmei.length +
              '/' +
              (musicHonmei.id != music0.id ? MUSICVOTENUM - 1 + ')' : MUSICVOTENUM + ')')
            }}
          </div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ hidden: musicsVotedNumber === MUSICVOTENUM }"
            @click="
              musicsVotedNumber === MUSICVOTENUM
                ? ''
                : (() => {
                    musicHonmeiIsSelected = false
                    musicSelectOpen = true
                  })()
            "
          ></icon-uil-plus>
        </div>
        <div class="innerBox p-2 whitespace-nowrap overflow-x-auto">
          <transition name="music" mode="out-in">
            <div v-if="musicsVotedWithoutHonmei.length">
              <transition-group name="musicList" tag="div">
                <div
                  v-for="(music, index) in musicsVotedWithoutHonmei"
                  :key="music.id"
                  class="inline-block transition transition-all duration-200 mr-3 w-3/10 max-w-52"
                >
                  <MusicCard v-model:music="musicsVotedWithoutHonmei[index]" />
                </div>
              </transition-group>
            </div>
            <div v-else class="w-full text-center py-15">
              请为您喜爱的曲目投上一票吧!<br />点击右上方的<strong> + </strong>按钮添加曲目
            </div>
          </transition>
        </div>
      </div>
      <button
        class="w-full py-2 flex items-center space-x-1 justify-center"
        :class="{ buttonDisabled: !musicsVotedNumber }"
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
        <div v-if="musicHonmei.honmei" class="py-1">
          <div class="text-lg">
            {{ '本命位：' + musicHonmei.name }}
          </div>
          <div class="truncate">{{ '专辑：' + musicHonmei.album }}</div>
          <div>{{ '投票理由：' + (musicHonmei.reason ? musicHonmei.reason : '无') }}</div>
        </div>
        <div v-for="(music, index) in musicsVotedWithoutHonmei" :key="music.id" class="py-1">
          <div class="">
            {{ '投票位' + (index + 1) + '：' + music.name }}
          </div>
          <div class="text-sm truncate">{{ '专辑：' + music.album }}</div>
          <div class="text-sm">{{ '投票理由：' + (music.reason ? music.reason : '无') }}</div>
        </div>
        <div class="italic">*票位序号仅用于核对投票内容，不影响权重<br />*投票期间可随时更改投票内容哦</div>
      </div>
      <button
        class="w-full py-2 flex items-center space-x-1 justify-center"
        :class="{ buttonDisabled: loading }"
        @click="vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" />
        {{ loading ? '投票中' : '确认投票！' }}
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import NProgress from 'nprogress'
import NavVote from '@/common/components/NavVote.vue'
import MusicSelect from './components/MusicSelect.vue'
import MusicHonmeiCard from './components/MusicHonmeiCard.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import MusicCard from '@/vote-music/components/MusicCard.vue'
import { music0 } from '@/vote-music/lib/music'
import { musicsVoted, musicsVotedWithoutHonmei } from '@/vote-music/lib/musicList'
import { MUSICVOTENUM, musicHonmei, musics, updateVoteMusics } from '@/vote-music/lib/voteData'
import { gql, useMutation, useQuery, useResult } from '@/graphql'
import type { Mutation, Query, schema } from '@/graphql'
import { voteMusicComplete, voteToken } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { popMessageText } from '@/common/lib/popMessage'

setSiteTitle('音乐部门')

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
          id
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
    updateVoteMusics(resultData.value.music)
  }
})
getSubmitMusicVoteError((err) => {
  console.log(err.message)
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('获取投票信息失败！失败原因：' + err.message)
})

const musicsVotedNumber = computed<number>(() => musicsVoted.value.length)

const musicSelectOpen = ref(false)
const musicHonmeiIsSelected = ref(false)

const confirmBoxOpen = ref(false)

const MusicSubmit = computed<schema.MusicSubmit[]>(() =>
  musics.value
    .filter((item) => item.id != music0.id)
    .map((item) => {
      return {
        id: item.id,
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
  popMessageText('投票成功！')
  voteMusicComplete.value = true
  router.push({ path: '/', query: { tab: 1, openList: 'vote', open: 1 } })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
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
