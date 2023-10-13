<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <BackToHome :show="true" :saveable="false" />
      <div class="font-medium">第11届 国内东方人气投票 - 角色部门</div>
    </div>

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <transition name="characterHonmei" mode="out-in">
        <div v-if="charactersVoted.length" class="p-1 rounded w-full shadow bg-white bg-opacity-80">
          <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
            <div>本命角色</div>
            <icon-uil-arrows-h
              v-show="characterHonmei.id != character0.id"
              class="cursor-pointer"
              @click="
                () => {
                  characterHonmeiIsSelected = true
                  characterSelectOpen = true
                }
              "
            />
          </div>
          <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50">
            <div v-if="characterHonmei.id != character0.id" key="selecting">
              <CharacterHonmeiCard v-model:character-honmei="characterHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
              <div>可以从喜欢的角色中选择一位</div>
              <div
                class="underline cursor-pointer transition hover:text-gray-500"
                @click="
                  () => {
                    characterHonmeiIsSelected = true
                    characterSelectOpen = true
                  }
                "
              >
                <strong>点击这里把Ta选为您的本命票哦</strong>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>
            {{
              '我喜欢的角色(' +
              charactersVotedWithoutHonmei.length +
              '/' +
              (characterHonmei.id != character0.id ? CHARACTERVOTENUM - 1 + ')' : CHARACTERVOTENUM + ')')
            }}
          </div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': charactersVotedNumber === CHARACTERVOTENUM }"
            @click="
              charactersVotedNumber === CHARACTERVOTENUM
                ? ''
                : (() => {
                    characterHonmeiIsSelected = false
                    characterSelectOpen = true
                  })()
            "
          ></icon-uil-plus>
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50 whitespace-nowrap overflow-x-auto">
          <transition name="character" mode="out-in">
            <div v-if="charactersVotedWithoutHonmei.length">
              <transition-group name="characterList" tag="div">
                <div
                  v-for="(character, index) in charactersVotedWithoutHonmei"
                  :key="character.id"
                  class="inline-block transition transition-all duration-200 mr-3 w-3/10 max-w-52"
                >
                  <CharacterCard v-model:character="charactersVotedWithoutHonmei[index]" />
                </div>
              </transition-group>
            </div>
            <div v-else class="w-full text-center text-gray-400 py-15">
              请为您喜爱的角色投上一票吧!<br />点击右上方的<strong> + </strong>按钮添加角色
            </div>
          </transition>
        </div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': !charactersVotedNumber }"
        @click="charactersVotedNumber ? (confirmBoxOpen = true) : ''"
      >
        {{ charactersVotedNumber ? '提交!' : '请投票' }}
      </button>
    </div>
  </div>
  <CharacterSelect
    v-model:open="characterSelectOpen"
    v-model:characterSelected="characters[charactersVotedNumber]"
    :character-honmei-is-selected="characterHonmeiIsSelected"
  />
  <VoteMessageBox v-model:open="confirmBoxOpen" title="请确定投票内容：">
    <div class="overflow-auto">
      <div class="divide-y p-2">
        <div v-if="characterHonmei.honmei" class="py-1" :style="'color:' + characterHonmei.color">
          <div class="text-lg">
            {{ '本命位：' + characterHonmei.name }}
          </div>
          <div class="">{{ '投票理由：' + (characterHonmei.reason ? characterHonmei.reason : '无') }}</div>
        </div>
        <div v-for="(character, index) in charactersVotedWithoutHonmei" :key="character.id" class="py-1">
          <div class="">
            {{ '投票位' + (index + 1) + '：' + character.name }}
          </div>
          <div class="text-sm">{{ '投票理由：' + (character.reason ? character.reason : '无') }}</div>
        </div>
        <div class="text-gray-500 italic">
          *票位序号仅用于核对投票内容，不影响权重<br />*投票期间可随时更改投票内容哦
        </div>
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
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import NProgress from 'nprogress'
import CharacterSelect from './components/CharacterSelect.vue'
import CharacterHonmeiCard from './components/CharacterHonmeiCard.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import CharacterCard from '@/vote-character/components/CharacterCard.vue'
import { character0 } from '@/vote-character/lib/character'
import { charactersVoted, charactersVotedWithoutHonmei } from '@/vote-character/lib/characterList'
import { CHARACTERVOTENUM, characterHonmei, characters, updateVoteCharacters } from '@/vote-character/lib/voteData'
import { gql, useMutation, useQuery, useResult } from '@/graphql'
import type { Mutation, Query, schema } from '@/graphql'
import { voteCharacterComplete, voteToken } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { popMessageText } from '@/common/lib/popMessage'

setSiteTitle('角色部门')

const router = useRouter()

const {
  result,
  loading: getSubmitCharacterVoteLoading,
  onError: getSubmitCharacterVoteError,
} = useQuery<Query>(
  gql`
    query ($voteToken: String!) {
      getSubmitCharacterVote(voteToken: $voteToken) {
        characters {
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
  if (getSubmitCharacterVoteLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
const resultData = useResult(result, null, (data) => data?.getSubmitCharacterVote)
watchEffect(() => {
  if (resultData.value) {
    updateVoteCharacters(resultData.value.characters)
  }
})
getSubmitCharacterVoteError((err) => {
  console.log(err.message)
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('获取投票信息失败！失败原因：' + err.message)
})

const charactersVotedNumber = computed<number>(() => charactersVoted.value.length)

const characterSelectOpen = ref(false)
const characterHonmeiIsSelected = ref(false)

const confirmBoxOpen = ref(false)

const CharacterSubmit = computed<schema.CharacterSubmit[]>(() =>
  characters.value
    .filter((item) => item.id != character0.id)
    .map((item) => {
      return {
        id: item.id,
        reason: item.reason,
        first: item.honmei,
      }
    })
)
async function vote(): Promise<void> {
  mutate({ content: { voteToken: voteToken.value, characters: CharacterSubmit.value } })
}
const { mutate, loading, onDone, onError } = useMutation<Mutation>(
  gql`
    mutation ($content: CharacterSubmitGQL!) {
      submitCharacterVote(content: $content)
    }
  `
)
onDone((result) => {
  popMessageText('投票成功！')
  voteCharacterComplete.value = true
  router.push({ path: '/', query: { tab: 1, openList: 'vote', open: 1 } })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
})
</script>
<style lang="postcss" scoped>
.character-enter-active,
.character-leave-active,
.characterHonmei-enter-active,
.characterHonmei-leave-active {
  @apply transition-all duration-200;
}
.character-enter-from,
.character-leave-to,
.characterHonmei-enter-from,
.characterHonmei-leave-to {
  @apply opacity-0;
}
.characterList-leave-active {
  @apply absolute;
  @apply max-w-30;
}

.characterList-enter,
.characterList-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
