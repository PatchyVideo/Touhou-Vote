<template>
  <div class="relative w-full p-1 rounded shadow bg-white flex">
    <img class="w-1/3 rounded border" :src="characterHonmei.image" />
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="w-2/3 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate">{{ characterHonmei.title }}</div>
        <div class="font-semibold text-xl truncate">{{ characterHonmei.name }}</div>
      </div>
      <div class="w-full flex justify-end">
        <div
          class="transform transform-gpu -rotate-45 border rounded-sm border-red-500 text-red-500 md:text-lg xl:text-xl"
        >
          本命
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Character } from '@/vote-character/lib/character'
import { character0 } from '@/vote-character/lib/voteData'

const props = defineProps({
  characterHonmei: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return character0
    },
  },
})
const emit = defineEmits<{
  (event: 'update:characterHonmei', value: Character): void
}>()
const characterHonmei = useVModel(props, 'characterHonmei', emit)

function closeCard(): void {
  characterHonmei.value = character0
}
</script>
