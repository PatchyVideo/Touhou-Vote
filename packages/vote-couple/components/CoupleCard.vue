<template>
  <div class="p-1 opacity-80 rounded shadow bg-white space-y-2">
    <div>{{ '投票位' + voteNumber }}</div>
    <div class="flex space-x-5">
      <div v-for="(character, index) in charactersValid" :key="index" class="relative w-3/10 p-1 pt-5 shadow rounded">
        <icon-uil-times class="absolute right-0 top-0 cursor-pointer"></icon-uil-times>
        <div class="character-image relative w-full overflow-hidden" :class="{ 'before:hidden': couple.seme != index }">
          <img class="w-full rounded border" :src="character.image" />
        </div>
        <div class="p-1 truncate text-center text-xs md:text-base" :style="'color:' + character.color">
          {{ character.name }}
        </div>
        <button
          class="w-full py-1 shadow rounded text-white text-sm md:text-base"
          :style="'background-color:' + character.color"
          @click="chooseAsSeme(index)"
        >
          {{ couple.seme === index ? '撤销' : '选为攻' }}
        </button>
      </div>
      <div
        v-if="moreCharacterCanBeSelected"
        class="w-3/10 min-h-30 md:min-h-40 3xl:min-h-50 p-1 shadow rounded flex flex-col"
      >
        <icon-uil-plus class="w-1/2 mx-auto flex-grow" />
        <div class="p-1 truncate text-center text-xs md:text-base">添加角色</div>
      </div>
    </div>
  </div>
  <CharacterSelect v-model:open="characterSelectOpen" v-model:characterSelected="characterSelected"></CharacterSelect>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, ref, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { Couple } from '@/vote-couple/lib/couple'
import { couple0 } from '../lib/voteData'
// import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import CharacterSelect from '@/vote-couple/components/CharacterSelect.vue'
import { character0 } from '@/vote-character/lib/voteData'
import { Character } from '@/vote-character/lib/character'

const props = defineProps({
  couple: {
    type: Object as PropType<Couple>,
    requred: true,
    default: function () {
      return couple0
    },
  },
  voteNumber: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits<{
  (event: 'update:couple', value: Couple): void
}>()
const couple = useVModel(props, 'couple', emit)

const characterSelectOpen = ref(false)
const charactersValid = computed<Character[]>(() =>
  couple.value.characters.filter((character) => {
    character.id != character0.id
  })
)
const characterSelected = ref(couple.value.characters[charactersValid.value.length])
const moreCharacterCanBeSelected = computed<boolean>(() =>
  couple.value.characters.find((character) => character.id === character0.id) ? true : false
)

function chooseAsSeme(index: number): void {
  couple.value.seme === index ? (couple.value.seme = -1) : (couple.value.seme = index)
}
</script>
<style lang="postcss" scoped>
.character-image::before {
  content: '攻';
  @apply absolute -right-9 md:-right-8 transform transform-gpu rotate-45 px-10 md:py-0.5 origin-center bg-accent-color-600 text-white text-xs md:text-base;
}
</style>
