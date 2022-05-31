<template>
  <div class="page"></div>
  <div
    class="flex flex-wrap items-center w-full min-h-100vh px-3vh backdrop-filter backdrop-blur-1 md:mx-auto md:w-4/5 xl:w-1/2"
  >
    <div class="space-y-6vh w-full md:pt-0 md:flex md:flex-wrap md:content-center md:space-y-4vh">
      <div class="w-full space-y-2">
        <div class="quicksand text-gray-800 md:text-xl">
          <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
          <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/common/assets/logoVoilelabs.png" />VoileLabs
        </div>
        <div class="w-full flex flex-wrap space-y-2">
          <div class="w-full"><img src="@/common/assets/title.svg" /></div>
          <div class="w-full"><img class="w-1/4 inline-block" src="@/common/assets/title10.svg" /></div>
        </div>
      </div>
      <div>
        <div>
          {{ '距开始还有 ' + daysWith0 + '天' + hoursWith0 + '时' + minutesWith0 + '分' + secondsWith0 + '秒' }}
        </div>
      </div>
    </div>
    <div v-if="screenSizes['<md']"></div>
    <!-- Copyright -->
    <div class="fixed bottom-0 left-0 quicksand w-full text-center my-6">
      &copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.&ensp;
      <a target="_blank" rel="noopener noreferrer" href="https://jq.qq.com/?k=0BnkgDKx">反馈问题</a>&ensp;
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { startTimeWithTimezoneOffset } from '@/start-page/lib/voteStart'

setSiteTitle('未开始 - 第⑩回 中文东方人气投票')

// Calculate Time Remains
const days = ref<number>(0)
const daysWith0 = computed<string>(() => SupplementZero(days.value))
const hours = ref<number>(0)
const hoursWith0 = computed<string>(() => SupplementZero(hours.value))
const minutes = ref<number>(0)
const minutesWith0 = computed<string>(() => SupplementZero(minutes.value))
const seconds = ref<number>(0)
const secondsWith0 = computed<string>(() => SupplementZero(seconds.value))
function SupplementZero(num: number): string {
  let stringNumber = '00' + String(num)
  return stringNumber.substr(stringNumber.length - 2)
}

useIntervalFn(() => {
  let startTime = startTimeWithTimezoneOffset - Date.now()
  if (startTime < 0) return
  days.value = Math.floor(startTime / 1000 / 60 / 60 / 24)
  hours.value = Math.floor(startTime / 1000 / 60 / 60) % 24
  minutes.value = Math.floor(startTime / 1000 / 60) % 60
  seconds.value = Math.floor(startTime / 1000) % 60
}, 1000)
</script>
<style lang="postcss" scoped></style>
