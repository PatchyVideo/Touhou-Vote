<template>
  <div class="relative w-full p-1 rounded shadow bg-white flex">
    <div class="w-2/5 max-w-32 md:max-w-none">
      <div class="border rounded aspect-ratio-1/1 overflow-hidden">
        <img class="object-contain" :src="musicHonmei.image ? musicHonmei.image : MusicImages" />
      </div>
    </div>
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="w-3/5 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate opacity-60">{{ musicHonmei.album }}</div>
        <div class="font-semibold text-xl line-clamp-2 whitespace-pre-wrap">
          {{ musicHonmei.name }}
        </div>
        <input
          ref="reasonInput"
          v-model="reasonEdit"
          maxlength="1000"
          placeholder="点此填写理由（可选）"
          class="truncate"
          type="text"
          @blur="updateReason()"
          @keydown.enter="updateReason()"
        />
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
import type { PropType } from 'vue'
import { ref, shallowRef, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { Music } from '@/vote-music/lib/music'
import { musics } from '@/vote-music/lib/voteData'
import MusicImages from '@/vote-music/assets/defaultMusicImage.jpg?url'

const props = defineProps({
  musicHonmei: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return new Music()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:musicHonmei', value: Music): void
}>()
const musicHonmei = useVModel(props, 'musicHonmei', emit)

const reasonInput = shallowRef<HTMLInputElement | null>(null)
const reasonEdit = ref(musicHonmei.value.reason)
watch(musicHonmei, () => {
  reasonEdit.value = musicHonmei.value.reason
})
function updateReason(): void {
  musics.value.map((item) => {
    if (item.honmei) item.reason = reasonEdit.value
  })
  reasonInput.value?.blur()
}

function closeCard(): void {
  musics.value.map((item) => (item.honmei = false))
}
</script>
