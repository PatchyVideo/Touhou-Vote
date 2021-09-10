<template>
  <div
    class="relative p-1 pt-5 rounded shadow bg-white ring"
    :style="'--tw-ring-color:' + character.color + ';color:' + character.color"
  >
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer" @click="closeCharacterCard()"></icon-uil-times>
    <img class="w-full rounded border" :src="character.image" />
    <div class="p-1 truncate text-center text-xs md:text-base" :style="'color:' + character.color">
      {{ character.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Character } from '@/vote-character/lib/character'
import { character0, characters } from '@/vote-character/lib/voteData'

const props = defineProps({
  character: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return character0
    },
  },
})
const emit = defineEmits<{
  (event: 'update:character', value: Character): void
}>()
const character = useVModel(props, 'character', emit)

function closeCharacterCard(): void {
  characters.value = characters.value.map((cha): Character => {
    if (cha.id === character.value.id) return character0
    else return cha
  })
}
</script>
