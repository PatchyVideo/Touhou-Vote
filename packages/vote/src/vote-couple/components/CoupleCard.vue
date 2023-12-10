<template>
  <div class="baseBlock p-1 opacity-80 rounded space-y-2">
    <div class="flex justify-between items-center">
      <div>{{ '投票位' + (indexOfCouple + 1) }}</div>
      <icon-uil-times class="cursor-pointer" @click="closeCard()"></icon-uil-times>
    </div>
    <div class="innerBox p-1 flex space-x-4 overflow-hidden">
      <transition-group name="characterList">
        <div
          v-for="(character, index) in charactersValid"
          :key="index"
          class="baseBlock relative w-3/10 min-h-30 md:min-h-40 3xl:min-h-50 p-1 pt-5 rounded"
        >
          <icon-uil-times
            class="absolute right-0 top-0 cursor-pointer"
            @click="deleteCharacter(index)"
          ></icon-uil-times>
          <div
            class="character-image relative w-full aspect-ratio-1/1 rounded border border-accent-color-600"
            :class="{ 'before:hidden': couple.seme != index }"
          >
            <img class="w-full object-contain" :src="character.image ? character.image : characterImages" />
          </div>
          <div class="p-1 truncate text-center text-xs md:text-base">
            {{ character.name }}
          </div>
          <button
            class="w-full py-1 shadow rounded bg-accent-color-600 text-sm md:text-base"
            @click="chooseAsSeme(index)"
          >
            {{ couple.seme === index ? '撤销' : '选为主动' }}
          </button>
        </div>
      </transition-group>
      <transition name="selectedMore" mode="out-in">
        <div
          v-if="moreCharacterCanBeSelected"
          class="w-3/10 min-h-30 md:min-h-40 3xl:min-h-50 p-1 shadow rounded flex flex-col cursor-pointer"
          @click="characterSelectOpen = true"
        >
          <icon-uil-plus class="w-1/2 mx-auto flex-grow" />
          <div class="p-1 truncate text-center text-xs md:text-base">添加角色</div>
        </div>
      </transition>
    </div>
    <div class="p-2 pt-0">
      <input
        ref="reasonInput"
        v-model="couple.reason"
        placeholder="点此填写理由（可选）"
        class="innerBox px-1 truncate w-full rounded ring ring-accent-color-300 outline-none"
        type="text"
      />
    </div>
  </div>
  <CharacterSelect
    v-model:open="characterSelectOpen"
    v-model:characterSelected="characterSelected"
    v-model:flag="flag"
    :couple-selected="couple"
  ></CharacterSelect>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { Couple } from '@/vote-couple/lib/couple'
import { couples } from '@/vote-couple/lib/voteData'
import CharacterSelect from '@/vote-couple/components/CharacterSelect.vue'
import { Character, character0 } from '@/vote-character/lib/character'
import characterImages from '@/vote-character/assets/defaultCharacterImage.png?url'

const props = defineProps({
  indexOfCouple: {
    type: Number,
    default: 0,
  },
  couple: {
    type: Object as PropType<Couple>,
    requred: true,
    default: function () {
      return new Couple()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:couple', value: Couple): void
}>()
const couple = useVModel(props, 'couple', emit)

const characterSelectOpen = ref(false)
const charactersValid = computed<Character[]>(() =>
  couple.value.characters.filter((character) => character.id != character0.id)
)
const characterSelected = ref(couple.value.characters[charactersValid.value.length])
const flag = ref(0)
watch(flag, () => {
  if (characterSelected.value.id != character0.id)
    couple.value.characters[charactersValid.value.length] = characterSelected.value
})
const moreCharacterCanBeSelected = computed<boolean>(() =>
  couple.value.characters.find((character) => character.id === character0.id) &&
  couple.value.characters[0] != couple.value.characters[1]
    ? true
    : false
)

function chooseAsSeme(index: number): void {
  couple.value.seme === index ? (couple.value.seme = -1) : (couple.value.seme = index)
}

function deleteCharacter(index: number): void {
  couple.value.characters.splice(index, 1)
  couple.value.characters.push(new Character())
  characterSelected.value = couple.value.characters[charactersValid.value.length]
}

function closeCard(): void {
  couples.value.splice(props.indexOfCouple, 1)
  couples.value.push(new Couple())
}
</script>

<style lang="postcss" scoped>
.character-image::before {
  content: '主动';
  @apply absolute -right-9 top-1.5 md:top-1 transform transform-gpu rotate-45 px-10 md:py-0.5 origin-center bg-accent-color-600 text-white text-xs md:text-base;
}
.selectedMore-enter-active,
.selectedMore-leave-active {
  @apply transition-all duration-200;
}
.selectedMore-enter-from,
.selectedMore-leave-to {
  @apply opacity-0;
}
.characterList-enter-active,
.characterList-leave-active {
  @apply transition transition-all duration-200;
}

.characterList-enter-from,
.characterList-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
