<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col">
    <NavVote VoteType="character" />

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <transition name="characterHonmei" mode="out-in">
        <div v-if="charactersVoted.length" class="baseBoxRoundedShadow p-1 w-full">
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
          <div class="innerBox p-2">
            <div v-if="characterHonmei.id != character0.id" key="selecting">
              <CharacterHonmeiCard v-model:character-honmei="characterHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full text-center py-10 space-y-2">
              <div>可以从喜欢的角色中选择一位</div>
              <div
                @click="
                  () => {
                    characterHonmeiIsSelected = true
                    characterSelectOpen = true
                  }
                "
              >
                <strong class="underline cursor-pointer transition hover:text-accent-color-300"
                  >点击这里把Ta选为您的本命票哦</strong
                >
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="baseBoxRoundedShadow p-1 w-full">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>
            {{
              '我喜欢的角色(' +
              charactersVotedWithoutHonmei.length +
              '/' +
              (characterHonmei.id != character0.id ? CHARACTERVOTENUM - 1 + ')' : CHARACTERVOTENUM + ')')
            }}
          </div>
        </div>
        <div class="innerBox w-full p-1 whitespace-nowrap overflow-x-auto">
          <transition-group name="characterList" tag="div" class="flex flex-nowrap md:flex-wrap overflow-auto">
            <div
              v-for="(character, index) in charactersVotedWithoutHonmei"
              :key="character.id"
              class="transition transition-all duration-200 min-w-[calc(33.3%-0.5rem)] m-1"
            >
              <CharacterCard v-model:character="charactersVotedWithoutHonmei[index]" />
            </div>
            <div
              v-if="charactersVotedNumber < CHARACTERVOTENUM"
              class="baseBoxRoundedShadow min-w-[calc(33.3%-0.5rem)] p-1 pt-5 pb-8 m-1 flex flex-col cursor-pointer"
              @click="
                () => {
                  characterHonmeiIsSelected = false
                  characterSelectOpen = true
                }
              "
            >
              <div class="w-1/2 aspect-ratio-1/1 mx-auto">
                <icon-uil-plus class="w-full" />
              </div>
              <div class="p-1 truncate text-center text-xs md:text-base">添加角色</div>
            </div>
          </transition-group>
        </div>
      </div>
      <button
        class="w-full py-2 flex items-center space-x-1 justify-center"
        :class="{ buttonDisabled: !charactersVotedNumber }"
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
        <div v-if="characterHonmei.honmei" class="py-1">
          <div class="text-lg">
            {{ '本命位：' + characterHonmei.name }}
          </div>
          <div>{{ '投票理由：' + (characterHonmei.reason ? characterHonmei.reason : '无') }}</div>
        </div>
        <div v-for="(character, index) in charactersVotedWithoutHonmei" :key="character.id" class="py-1">
          <div class="">
            {{ '投票位' + (index + 1) + '：' + character.name }}
          </div>
          <div class="text-sm">{{ '投票理由：' + (character.reason ? character.reason : '无') }}</div>
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
import CharacterSelect from './components/CharacterSelect.vue'
import CharacterHonmeiCard from './components/CharacterHonmeiCard.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
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
  @apply transition-all duration-200;
}

.characterList-enter,
.characterList-leave-to {
  @apply opacity-0;
}
</style>
