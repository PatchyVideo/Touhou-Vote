<template>
  <div class="relative w-full p-1 rounded shadow bg-subaccent bg-opacity-90 flex">
    <div class="w-2/5 max-w-32 md:max-w-64">
      <div class="border rounded aspect-ratio-1/1 border-accent-color-600">
        <img class="object-contain" :src="musicHonmei.image ? musicHonmei.image : MusicImages" />
      </div>
    </div>
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="flex-1 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate opacity-60">{{ musicHonmei.album }}</div>
        <div class="font-semibold text-xl line-clamp-2 whitespace-pre-wrap">
          {{ musicHonmei.name }}
        </div>
        <input
          ref="reasonInput"
          v-model="reasonEdit"
          placeholder="点此填写理由（可选）"
          class="innerBox w-full truncate px-1 rounded outline-none"
          type="text"
          @blur="updateReason()"
          @keydown.enter="updateReason()"
        />
      </div>
      <div class="w-full flex justify-end">
        <div
          class="transform transform-gpu -rotate-45 border rounded-sm border-accent-color-600 text-accent-color-600 md:text-lg xl:text-xl"
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
import { Music } from '@/vote-music/lib/music'
import { musics } from '@/vote-music/lib/voteData'
import MusicImages from '@/vote-music/assets/defaultMusicImage.jpg?url'

const props = defineProps({
  // Note that characterHonmei in voteData.ts is readonly
  musicHonmei: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return new Music()
    },
  },
})

const reasonInput = shallowRef<HTMLInputElement | null>(null)
const reasonEdit = ref(props.musicHonmei.reason)
watch(props.musicHonmei, function (newv) {
  reasonEdit.value = newv.reason
})
function updateReason(): void {
  musics.value.map((mus) => {
    if (mus.honmei) mus.reason = reasonEdit.value
  })
  reasonInput.value?.blur()
}

function closeCard(): void {
  musics.value.map((mus) => (mus.honmei = false))
}
</script>
