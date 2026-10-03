<template>
  <div class="vote-card-template w-[640px] bg-white p-10 flex flex-col font-sans" style="min-height: 1100px">
    <div class="card-heading mb-10">
      <h1 class="break-words text-3xl font-black text-black">
        {{ title }}
      </h1>
      <span class="shrink-0 whitespace-nowrap text-gray-400 text-lg font-bold"> 第{{ year }}回中文东方人气投票 </span>
    </div>

    <div v-if="honmeiCouple" class="mb-10">
      <div
        class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
        :style="{ background: darkenColor(honmeiThemeColor, 0.18) }"
      >
        <div
          class="absolute inset-0 pointer-events-none opacity-40"
          :style="{
            background:
              'radial-gradient(900px 280px at 20% 10%, rgba(255,255,255,.35), transparent 60%), radial-gradient(900px 280px at 80% 0%, rgba(255,255,255,.18), transparent 55%)',
          }"
        />

        <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div
            class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
          >
            <HonmeiBadgeText />
          </div>
        </div>

        <div class="flex items-center justify-center gap-6 mb-6">
          <div
            v-for="char in honmeiCouple.members"
            :key="char.memberIndex"
            class="flex-1 max-w-[160px] flex justify-center"
          >
            <div
              class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white border-opacity-60 bg-white"
            >
              <img :src="char.image" class="w-full h-full object-cover" />

              <div
                v-if="honmeiCouple.activeIndex === char.memberIndex"
                class="absolute left-0 right-0 bottom-0 h-[30%] flex items-center justify-center"
                :style="{
                  background: honmeiThemeColor,
                  clipPath: 'ellipse(70% 80% at 50% 100%)',
                }"
              >
                <span class="text-white text-xs font-black tracking-widest">主动</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mb-6 relative">
          <h2 class="text-4xl font-black mb-2 text-white">
            {{ honmeiCouple.members.map((c) => c.name).join(' × ') }}
          </h2>
          <p class="text-lg font-bold opacity-90 text-white">
            {{ honmeiCouple.members.map((c) => (c.works || []).join(' / ')).join(' | ') }}
          </p>
        </div>

        <div
          v-if="showReason && honmeiCouple.reason.trim()"
          class="pt-5 border-t border-white border-opacity-30 relative"
        >
          <p class="text-xl leading-relaxed opacity-95 break-words whitespace-pre-wrap text-white text-left -mt-1">
            "{{ honmeiCouple.reason }}"
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-6 mb-16">
      <div
        v-for="(cp, cpIndex) in otherCouples"
        :key="cpIndex"
        class="rounded-2xl p-5 shadow-md overflow-hidden relative"
        :style="{ background: darkenColor(cpThemeColor(cp), 0.12) }"
      >
        <div
          class="absolute inset-0 pointer-events-none opacity-35"
          :style="{
            background:
              'radial-gradient(700px 220px at 15% 0%, rgba(255,255,255,.30), transparent 60%), radial-gradient(700px 220px at 90% -10%, rgba(255,255,255,.15), transparent 55%)',
          }"
        />

        <div class="relative">
          <div class="flex items-center justify-center gap-6">
            <div v-for="char in cp.members" :key="char.memberIndex" class="flex-1 max-w-[170px] flex justify-center">
              <div
                class="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white border-opacity-60 bg-white"
              >
                <img :src="char.image" class="w-full h-full object-cover" />

                <div
                  v-if="cp.activeIndex === char.memberIndex"
                  class="absolute left-0 right-0 bottom-0 h-[32%] flex items-center justify-center"
                  :style="{
                    background: cpThemeColor(cp),
                    clipPath: 'ellipse(70% 80% at 50% 100%)',
                  }"
                >
                  <span class="text-white text-[10px] font-black tracking-widest">主动</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <div class="text-xl font-black text-white break-words whitespace-normal px-2 drop-shadow">
              {{ cp.members.map((c) => c.name).join(' × ') }}
            </div>
          </div>
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
const honmeiCouple = computed(() => props.entries.find((entry) => entry.isHonmei))
const otherCouples = computed(() => props.entries.filter((entry) => !entry.isHonmei))
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
function cpThemeColor(cp: CardEntry) {
  return cp.members[0]?.color || '#FC4328'
}
const honmeiThemeColor = computed(() => (honmeiCouple.value ? cpThemeColor(honmeiCouple.value) : '#FC4328'))
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
