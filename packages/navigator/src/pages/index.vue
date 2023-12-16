<template>
  <div class="bg"></div>
  <div class="w-full max-w-screen-lg mx-auto">
    <div class="flex flex-col py-10vh lg:py-15vh mx-2">
      <div class="quicksand text-gray-800 md:text-xl">
        <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
        <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/assets/logoVoilelabs.png" />VoileLabs
      </div>
      <h1 class="text-5xl"><img class="h-12" alt="中文东方人气投票" src="@/assets/title.svg" /></h1>
      <a
        class="flex flex-row flex-nowrap items-center gap-2 my-3 md:my-4 p-2 md:p-4 rounded-xl border-2 md:border-4 border-pink-300 border-dashed md:border-dashed"
        :href="'/' + latestLink"
      >
        <div
          class="w-16 h-16 md:w-20 md:h-20 bg-[length:192px_192px] md:bg-[length:240px_240px]"
          :style="'background-image: url(' + latestIcon + ')'"
        />
        <div>
          <div class="text-2xl md:text-4xl text-pink-600">
            <template v-if="voting">
              参与第{{ latestTitle }}回人气投票
              <i class="inline-block align-text-bottom mb-px md:mb-1 i-carbon-arrow-right"></i>
            </template>
            <template v-else>查看第{{ latestTitle }}回人气投票结果</template>
          </div>
          <div class="text-sm sm:text-base">
            <template v-if="voting">距结束还有 {{ ddlHint }}</template>
            <template v-else>投票时间 {{ latestTime }}</template>
          </div>
        </div>
      </a>
      <div class="grid lg:grid-cols-2 gap-3">
        <a
          v-for="([link, title, icon, time], index) in resultList.slice(1)"
          :key="link"
          class="flex flex-row items-center flex-nowrap gap-1 p-2 md:px-3 md:py-2 rounded-lg border-2 border-pink-300 border-dotted"
          :href="'/' + link"
        >
          <div
            :style="'background-image: url(' + icon + ')'"
            class="w-12 h-12 md:w-14 md:h-14 bg-[length:144px_144px] md:bg-[length:168px_168px]"
            :class="resultListIconPosition[index % 9]"
          />
          <div>
            <div class="text-xl md:text-3xl text-pink-500">第{{ title }}回结果页</div>
            <div class="text-sm sm:text-base">投票时间 {{ time }}</div>
          </div>
        </a>
      </div>
      <!-- Copyright -->
      <div class="quicksand w-full text-center my-6">
        &copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDuration, intervalToDuration } from 'date-fns'
import dateFnsZhCN from 'date-fns/locale/zh-CN'

const resultListRaw: [string, string, string, string][] = [
  ['v1', '一', 'https://asset.lilywhite.cc/test/test1.png', '2012/7/23 ~ 7/30'],
  ['v2', '二', 'https://asset.lilywhite.cc/test/test1.png', '2013/10/1 ~ 10/7'],
  ['v3', '三', 'https://asset.lilywhite.cc/test/test1.png', '2014/8/22 ~ 8/28'],
  ['v4', '四', 'https://asset.lilywhite.cc/test/test1.png', '2015/10/1 ~ 10/15'],
  ['v5', '五', 'https://asset.lilywhite.cc/test/test1.png', '2016/10/1 ~ 10/15'],
  ['v6', '六', 'https://asset.lilywhite.cc/test/test1.png', '2017/10/1 ~ 10/15'],
  ['v7', '七', 'https://asset.lilywhite.cc/test/test1.png', '2018/09/30 ~ 10/14'],
  ['v8', '八', 'https://asset.lilywhite.cc/test/test1.png', '2019/09/30 ~ 10/14'],
  ['v9', '⑨', 'https://asset.lilywhite.cc/test/test1.png', '2020/12/18 ~ 12/31'],
  ['v10', '⑩', 'https://asset.lilywhite.cc/test/test2.png', '2022/06/17 ~ 07/03'],
]
const resultListIconPosition = [
  'bg-left-top',
  'bg-top',
  'bg-right-top',
  'bg-left',
  'bg-center',
  'bg-right',
  'bg-left-bottom',
  'bg-bottom',
  'bg=right-bottom',
]
const resultList = resultListRaw.reverse()
const latest = resultList[0]
const [latestLink, latestTitle, latestIcon, latestTime] = latest

const votingEnd = new Date('2022-07-04T16:00:00.000Z')
const now = useNow({
  interval: 1000,
})
const voting = computed(() => now.value < votingEnd)
const ddlHint = computed(() =>
  formatDuration(
    intervalToDuration({
      start: now.value,
      end: votingEnd,
    }),
    { locale: dateFnsZhCN }
  )
)
</script>

<style lang="postcss" scoped>
.bg {
  position: fixed;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(233, 82, 142, 0.1), rgba(233, 82, 142, 0.05));
}
</style>
