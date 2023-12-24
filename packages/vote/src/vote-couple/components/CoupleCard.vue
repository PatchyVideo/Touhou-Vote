<template>
  <div class="baseBoxRoundedShadow p-1 space-y-2">
    <div class="flex justify-between items-center">
      <div>{{ '投票位' + (indexOfCouple + 1) }}</div>
      <icon-uil-times class="cursor-pointer" @click="closeCard()"></icon-uil-times>
    </div>
    <div class="innerBox p-1 flex overflow-hidden">
      <transition-group name="characterList">
        <div
          v-for="(character, index) in charactersValid"
          :key="index"
          class="baseBoxRoundedShadow relative min-w-[calc(33.3%-0.5rem)] p-1 pt-5 m-1"
        >
          <icon-uil-times
            class="absolute right-0 top-0 cursor-pointer"
            @click="deleteCharacter(index)"
          ></icon-uil-times>
          <div
            class="character-image relative w-full aspect-ratio-1/1 rounded-xl border border-accent-color-600 overflow-hidden"
            :class="{ 'before:hidden': couple.seme != index }"
          >
            <img class="w-full object-contain" :src="character.image ? character.image : characterImages" />
          </div>
          <div class="p-1 truncate text-center text-xs md:text-base">
            {{ character.name }}
          </div>
          <button class="w-full py-1 text-sm md:text-base" @click="chooseAsSeme(index)">
            {{ couple.seme === index ? '撤销' : '选为主动' }}
          </button>
        </div>
        <div
          v-if="moreCharacterCanBeSelected"
          class="baseBoxRoundedShadow min-w-[calc(33.3%-0.5rem)] p-1 pt-5 pb-8 m-1 flex flex-col cursor-pointer"
          @click="characterSelectOpen = true"
        >
          <div class="w-1/2 aspect-ratio-1/1 mx-auto">
            <icon-uil-plus class="w-full" />
          </div>
          <div class="p-1 truncate text-center text-xs md:text-base">添加角色</div>
        </div>
      </transition-group>
    </div>
    <div class="p-2 pt-0">
      <input
        ref="reasonInput"
        v-model="couple.reason"
        placeholder="点此填写理由（可选）"
        class="innerBox p-1 truncate w-full ring ring-accent-color-300 outline-none"
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
  @apply absolute z-1 -right-9 top-1.5 md:top-1 transform transform-gpu rotate-45 px-10 md:py-0.5 origin-center bg-accent-color-600 bg-opacity-90 text-white text-xs md:text-base;
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
