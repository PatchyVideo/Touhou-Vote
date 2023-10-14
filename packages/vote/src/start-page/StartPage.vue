<template>
  <div class="page"></div>
  <div
    class="flex flex-wrap items-center w-full min-h-100vh px-3vh backdrop-filter backdrop-blur-1 md:mx-auto md:w-4/5 xl:w-1/2">
    <div class="space-y-6vh w-full md:pt-0 md:flex md:flex-col md:flex-wrap md:content-center md:space-y-4vh">
      <div class="md:w-1/2 space-y-2">
        <div class="quicksand text-gray-800 md:text-xl">
          <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
          <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/common/assets/logoVoilelabs.png" />VoileLabs
        </div>
        <div class="w-full flex flex-wrap space-y-2">
          <div class="w-full"><img src="@/common/assets/title.svg" /></div>
          <div class="w-full"><img class="w-1/4 inline-block" src="@/common/assets/title10.svg" /></div>
        </div>
      </div>
      <div
        class="md:text-xl xl:text-3xl 2xl:text-5xl 3xl:text-7xl flex space-x-0.5 md:space-x-1 2xl:space-x-2 items-end md:whitespace-nowrap">
        <div>距开始还有</div>
        <div class="text-2xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl">{{ daysWith0 }}</div>
        <div>天</div>
        <div class="text-2xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl">{{ hoursWith0 }}</div>
        <div>时</div>
        <div class="text-2xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl">{{ minutesWith0 }}</div>
        <div>分</div>
        <div class="text-2xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl">{{ secondsWith0 }}</div>
        <div>秒</div>
      </div>
    </div>
    <div v-if="screenSizes['<md']"></div>
    <Copyright copyright-type="fixed" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { startTimeWithTimezoneOffset } from '@/start-page/lib/voteStart'
import Copyright from '@/common/components/Copyright.vue'


setSiteTitle('未开始')

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
