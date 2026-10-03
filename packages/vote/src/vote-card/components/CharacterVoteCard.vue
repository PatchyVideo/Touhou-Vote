<template>
  <div class="vote-card-template w-[640px] bg-white p-10 flex flex-col font-sans" style="min-height: 1100px">
    <div class="card-heading mb-10">
      <h1 class="break-words text-3xl font-black text-black">
        {{ title }}
      </h1>
      <span class="shrink-0 whitespace-nowrap text-gray-400 text-lg font-bold"> 第{{ year }}回中文东方人气投票 </span>
    </div>

    <div v-if="honmeiCharacter" class="mb-12">
      <div
        class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
        :style="{ background: darkenColor(honmeiCharacter.color || '#C00000', 0.2) }"
      >
        <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div
            class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
          >
            <HonmeiBadgeText />
          </div>
        </div>
        <div class="flex items-center gap-8">
          <div
            class="w-36 h-36 rounded-full border-4 border-white border-opacity-60 overflow-hidden flex-shrink-0 bg-white"
          >
            <img :src="honmeiCharacter.image" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <h2 class="text-5xl font-black mb-3 break-words whitespace-normal text-white">
              {{ honmeiCharacter.name }}
            </h2>
            <p class="text-xl font-bold opacity-90 break-words whitespace-normal text-white">
              {{ honmeiCharacter.origname }}
            </p>
          </div>
        </div>

        <div
          v-if="showReason && honmeiCharacter.reason.trim()"
          class="mt-8 pt-5 border-t border-white border-opacity-30"
        >
          <p class="text-xl leading-relaxed opacity-95 break-words whitespace-pre-wrap text-white text-left -mt-1">
            "{{ honmeiCharacter.reason }}"
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-y-12 gap-x-6 mb-16">
      <div v-for="(char, index) in otherCharacters" :key="index" class="flex flex-col items-center text-center">
        <div class="w-32 h-32 rounded-full p-1 border-4 mb-4 shadow-sm" :style="{ borderColor: char.color }">
          <div class="w-full h-full rounded-full overflow-hidden bg-gray-100">
            <img :src="char.image" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="text-2xl font-black text-black break-words whitespace-normal w-full px-2">
          {{ char.name }}
        </div>
      </div>
    </div>

    <VoteCardFooter :show-qr="showQr" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import VoteCardFooter from './VoteCardFooter.vue'
import HonmeiBadgeText from './HonmeiBadgeText.vue'
import type { CardEntry } from '../lib/types'
const props = defineProps<{
  entries: CardEntry[]
  title: string
  year: number
  showReason?: boolean
  showQr?: boolean
}>()
const honmeiCharacter = computed(() => props.entries.find((entry) => entry.isHonmei))
const otherCharacters = computed(() => props.entries.filter((entry) => !entry.isHonmei))
function darkenColor(input: string | undefined, amount: number) {
  const hex = /^#([0-9a-fA-F]{6})$/.exec(input || '#FC4328')?.[1] || 'FC4328'
  return (
    '#' +
    [0, 2, 4]
      .map((i) =>
        Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}
</script>

<style scoped>
.vote-card-template {
  box-sizing: border-box;
  overflow-wrap: anywhere;
  color: #111;
}
.card-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px 16px;
}
.vote-card-template h1 {
  flex: 0 0 auto;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  margin-right: auto;
}
.vote-card-template h1 + span {
  width: auto;
  flex-shrink: 0;
  text-align: left;
}
.vote-card-template .relative.rounded-\[2rem\] {
  padding-top: 72px;
}
</style>
