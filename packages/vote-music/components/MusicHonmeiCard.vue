<template>
  <div class="relative w-full p-1 rounded shadow bg-white flex">
    <img class="w-1/3 rounded border" :src="musicHonmei.image" />
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="w-2/3 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate opacity-60">{{ musicHonmei.album }}</div>
        <div class="font-semibold text-xl truncate">
          {{ musicHonmei.name }}
        </div>
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
import { Music } from '@/vote-music/lib/music'
import { music0 } from '@/vote-music/lib/voteData'

const props = defineProps({
  musicHonmei: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return music0
    },
  },
})
const emit = defineEmits<{
  (event: 'update:musicHonmei', value: Music): void
}>()
const musicHonmei = useVModel(props, 'musicHonmei', emit)

function closeCard(): void {
  musicHonmei.value = music0
}
</script>
