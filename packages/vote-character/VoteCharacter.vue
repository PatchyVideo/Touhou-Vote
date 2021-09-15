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
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': characterHonmei.id != character0.id }"
            @click="
              characterHonmei.id === character0.id
                ? (() => {
                    characterHonmeiIsSelected = true
                    characterSelectOpen = true
                  })()
                : ''
            "
          ></icon-uil-plus>
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50">
          <transition name="characterHonmei" mode="out-in">
            <div v-if="characterHonmei.id != character0.id" key="selecting">
              <CharacterHonmeiCard v-model:character-honmei="characterHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
              可以从喜欢的角色中选择一位<br />
              把Ta选为你的本命票哦
            </div>
          </transition>
        </div>
      </div>

      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>{{ '我喜欢的角色(' + charactersVotedNumber + '/8)' }}</div>
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
            <div v-if="charactersVotedNumber">
              <transition-group name="characterList" tag="div">
                <div
                  v-for="(character, index) in charactersReverse"
                  :key="character.id"
                  class="inline-block transition transition-all duration-200 mr-3 w-3/10"
                >
                  <CharacterCard
                    v-model:character="charactersReverse[index]"
                    v-model:charactersSelectedList="characters"
                    class="opacity-80"
                  />
                </div>
              </transition-group>
            </div>
            <div v-else class="w-full text-center text-gray-400 py-15">请为您喜爱的角色投上一票吧!</div>
          </transition>
        </div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': loading }"
        @click="vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>{{ loading ? '投票中' : '投票！' }}</label>
      </button>
    </div>
    <CharacterSelect
      v-model:open="characterSelectOpen"
      v-model:characterSelected="characters[charactersVotedNumber]"
      v-model:characterHonmeiSelected="characterHonmei"
      :character-honmei-is-selected="characterHonmeiIsSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import CharacterSelect from './components/CharacterSelect.vue'
import CharacterCard from '@/vote-character/components/CharacterCard.vue'
import CharacterHonmeiCard from './components/CharacterHonmeiCard.vue'
import { ref, computed } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { character0 } from '@/vote-character/lib/voteData'
import { characterHonmei, characters } from '@/vote-character/lib/voteData'

const charactersReverse = computed<Character[]>(() => {
  const charactersCopy: Character[] = []
  characters.value.map((character) => {
    if (character.id != character0.id) charactersCopy.push(character)
  })
  return charactersCopy.reverse()
})
const charactersVotedNumber = computed<number>(() => charactersReverse.value.length)

const characterSelectOpen = ref(false)
const characterHonmeiIsSelected = ref(false)

const loading = ref(false)
async function vote(): Promise<void> {
  if (!window.confirm('确定要投票吗？（投票期间可随时更改）')) return
  loading.value = true
  alert('投票成功！')
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
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
