<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - 角色部门</div>
    </div>

    <div
      class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 lg:w-1/3 xl:w-1/4 3xl:w-1/5 md:m-auto"
    >
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
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
          <transition name="characterHonmei" mode="out-in">
            <div v-if="characterHonmei.honmei" key="selecting">
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
                把Ta选为你的本命票哦
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>
            {{
              '我喜欢的角色(' +
              charactersReverseWithoutHonmei.length +
              '/' +
              (characterHonmei.honmei ? characters.length - 1 + ')' : characters.length + ')')
            }}
          </div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': charactersVotedNumber === 8 }"
            @click="
              charactersVotedNumber === 8
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
            <div v-if="charactersReverseWithoutHonmei.length">
              <transition-group name="characterList" tag="div">
                <div
                  v-for="(character, index) in charactersReverseWithoutHonmei"
                  :key="character.id"
                  class="inline-block transition transition-all duration-200 mr-3 w-3/10"
                >
                  <CharacterCard v-model:character="charactersReverseWithoutHonmei[index]" />
                </div>
              </transition-group>
            </div>
            <div v-else class="w-full text-center text-gray-400 py-15">请为您喜爱的角色投上一票吧!</div>
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
        <div v-for="(character, index) in charactersReverseWithoutHonmei" :key="character.id" class="py-1">
          <div class="">
            {{ '投票位' + (index + 1) + '：' + character.name }}
          </div>
          <div class="text-sm">{{ '投票理由：' + (character.reason ? character.reason : '无') }}</div>
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
</template>

<script lang="ts" setup>
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import CharacterSelect from './components/CharacterSelect.vue'
import CharacterCard from '@/vote-character/components/CharacterCard.vue'
import CharacterHonmeiCard from './components/CharacterHonmeiCard.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { character0 } from '@/vote-character/lib/character'
import { charactersReverse, charactersReverseWithoutHonmei } from '@/vote-character/lib/characterList'
import { characterHonmei, characters } from '@/vote-character/lib/voteData'
import { useMutation, gql } from '@/graphql'
import type { Mutation, schema } from '@/graphql'
import { voteToken } from '@/home/lib/user'

const router = useRouter()

const charactersVotedNumber = computed<number>(() => charactersReverse.value.length)

const characterSelectOpen = ref(false)
const characterHonmeiIsSelected = ref(false)

const confirmBoxOpen = ref(false)

const CharacterSubmit = computed<schema.CharacterSubmit[]>(() =>
  characters.value
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
  mutate({ content: { voteToken: voteToken.value, characters: CharacterSubmit.value } })
}
const { mutate, loading, onDone, onError } = useMutation<Mutation>(
  gql`
    mutation ($content: CharacterSubmitGQL!) {
      submitCharacterVote(content: $content) {
        errno
      }
    }
  `
)
onDone((result) => {
  alert('投票成功！')
  router.push({ path: '/' })
})
onError((error) => {
  console.log(error)
  alert('投票失败，请检查网络设置！')
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
