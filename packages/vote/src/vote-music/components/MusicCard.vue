<template>
  <div class="relative p-1 pt-5 opacity-80 rounded shadow bg-subaccent bg-opacity-90">
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer" @click="closeMusicCard()"></icon-uil-times>
    <div class="aspect-ratio-1/1 rounded border border-accent-color-600">
      <img class="object-contain" :src="music.image ? music.image : MusicImages" />
    </div>
    <div class="p-1 pb-0 line-clamp-2 whitespace-pre-wrap text-center text-xs h-9 md:text-base md:h-13">
      {{ music.name }}
    </div>
    <button class="w-full py-1 shadow rounded bg-accent-color-600 text-sm md:text-base" @click="openReasonBox()">
      编辑投票理由
    </button>
  </div>
  <VoteMessageBox v-model:open="reasonBoxOpen" :title="reasonTitle">
    <div class="space-y-3 py-5">
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          ref="reasonInput"
          v-model="reasonEdit"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="理由："
          type="text"
          @keydown.enter="commitReasonBox()"
      /></label>
      <button class="w-full py-2 shadow rounded bg-accent-color-600 text-sm md:text-base" @click="commitReasonBox()">
        确定
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import { Music } from '@/vote-music/lib/music'
import { musics } from '@/vote-music/lib/voteData'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import MusicImages from '@/vote-music/assets/defaultMusicImage.jpg?url'

const props = defineProps({
  music: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return new Music()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:music', value: Music): void
}>()
const music = useVModel(props, 'music', emit)

const reasonInput = shallowRef<HTMLInputElement | null>(null)
const reasonTitle = computed(() => '选择 ' + music.value.name + ' 的理由')
const reasonBoxOpen = ref(false)
const reasonEdit = ref('')
function openReasonBox(): void {
  reasonBoxOpen.value = true
  reasonEdit.value = music.value.reason
}
watchEffect(() => {
  if (reasonInput.value) reasonInput.value.focus()
})
function commitReasonBox(): void {
  music.value.reason = reasonEdit.value
  reasonBoxOpen.value = false
}

function closeMusicCard(): void {
  musics.value.splice(
    musics.value.findIndex((item) => item.id === music.value.id),
    1
  )
  musics.value.push(new Music())
}
</script>
