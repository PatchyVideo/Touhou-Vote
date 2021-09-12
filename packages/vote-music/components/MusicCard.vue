<template>
  <div class="relative p-1 pt-5 rounded shadow bg-white">
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer" @click="closeMusicCard()"></icon-uil-times>
    <img class="w-full rounded border" :src="music.image" />
    <div class="p-1 truncate text-center text-xs md:text-base">
      {{ music.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Music } from '@/vote-music/lib/music'
import { music0, musics } from '@/vote-music/lib/voteData'

const props = defineProps({
  music: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return music0
    },
  },
})
const emit = defineEmits<{
  (event: 'update:music', value: Music): void
}>()
const music = useVModel(props, 'music', emit)

function closeMusicCard(): void {
  musics.value = musics.value.map((cha): Music => {
    if (cha.id === music.value.id) return music0
    else return cha
  })
}
</script>
