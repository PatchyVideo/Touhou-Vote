<template>
  <div class="relative p-1 pt-5 opacity-80 rounded shadow bg-white">
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer" @click="closeMusicCard()"></icon-uil-times>
    <img class="w-full rounded border" :src="music.image" />
    <div class="p-1 truncate text-center text-xs md:text-base">
      {{ music.name }}
    </div>
    <button
      class="w-full py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
      @click="openReasonBox()"
    >
      投票理由
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
      <button
        class="w-full py-2 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
        @click="commitReasonBox()"
      >
        确定
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, ref, computed, shallowRef, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import { Music } from '@/vote-music/lib/music'
import { musics } from '@/vote-music/lib/voteData'
import { music0 } from '@/vote-music/lib/voteData'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

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
  musics.value = musics.value.map((item): Music => {
    if (item.id === music.value.id) return music0
    else return item
  })
}
</script>
