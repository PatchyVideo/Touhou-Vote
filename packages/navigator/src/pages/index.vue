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
        <img class="w-16 h-16 md:w-20 md:h-20" :src="latestIcon" />
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
          v-for="[link, title, icon, time] in resultList.slice(1)"
          :key="link"
          class="flex flex-row items-center flex-nowrap gap-1 p-2 md:px-3 md:py-2 rounded-lg border-2 border-pink-300 border-dotted"
          :href="'/' + link"
        >
          <img class="w-12 h-12 md:w-14 md:h-14" :src="icon" />
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
  [
    'v1',
    '一',
    'https://upload.thwiki.cc/thumb/8/8d/%E4%B8%B0%E8%81%AA%E8%80%B3%E7%A5%9E%E5%AD%90%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E4%B8%B0%E8%81%AA%E8%80%B3%E7%A5%9E%E5%AD%90%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2012/7/23 ~ 7/30',
  ],
  [
    'v2',
    '二',
    'https://upload.thwiki.cc/thumb/9/92/%E7%A7%A6%E5%BF%83%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E7%A7%A6%E5%BF%83%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2013/10/1 ~ 10/7',
  ],
  [
    'v3',
    '三',
    'https://upload.thwiki.cc/thumb/f/ff/%E4%BA%8C%E5%B2%A9%E7%8C%AF%E8%97%8F%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E4%BA%8C%E5%B2%A9%E7%8C%AF%E8%97%8F%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2014/8/22 ~ 8/28',
  ],
  [
    'v4',
    '四',
    'https://upload.thwiki.cc/thumb/9/99/%E7%BA%AF%E7%8B%90%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E7%BA%AF%E7%8B%90%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2015/10/1 ~ 10/15',
  ],
  [
    'v5',
    '五',
    'https://upload.thwiki.cc/thumb/a/ac/%E8%B5%AB%E5%8D%A1%E6%8F%90%E4%BA%9A%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E8%B5%AB%E5%8D%A1%E6%8F%90%E4%BA%9A%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2016/10/1 ~ 10/15',
  ],
  [
    'v6',
    '六',
    'https://upload.thwiki.cc/thumb/1/1a/%E6%91%A9%E5%A4%9A%E7%BD%97%E9%9A%90%E5%B2%90%E5%A5%88%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E6%91%A9%E5%A4%9A%E7%BD%97%E9%9A%90%E5%B2%90%E5%A5%88%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2017/10/1 ~ 10/15',
  ],
  [
    'v7',
    '七',
    'https://upload.thwiki.cc/thumb/9/9a/%E4%BE%9D%E7%A5%9E%E5%A5%B3%E8%8B%91%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E4%BE%9D%E7%A5%9E%E5%A5%B3%E8%8B%91%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2018/09/30 ~ 10/14',
  ],
  [
    'v8',
    '八',
    'https://upload.thwiki.cc/thumb/4/4a/%E5%9F%B4%E5%AE%89%E7%A5%9E%E8%A2%BF%E5%A7%AC%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E5%9F%B4%E5%AE%89%E7%A5%9E%E8%A2%BF%E5%A7%AC%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2019/09/30 ~ 10/14',
  ],
  [
    'v9',
    '⑨',
    'https://upload.thwiki.cc/thumb/8/82/%E5%A5%A5%E9%87%8E%E7%94%B0%E7%BE%8E%E5%AE%B5%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E5%A5%A5%E9%87%8E%E7%94%B0%E7%BE%8E%E5%AE%B5%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2020/12/18 ~ 12/31',
  ],
  [
    'v10',
    '⑩',
    'https://upload.thwiki.cc/thumb/c/cf/%E5%A4%A9%E5%BC%93%E5%8D%83%E4%BA%A6%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png/100px-%E5%A4%A9%E5%BC%93%E5%8D%83%E4%BA%A6%EF%BC%88Q%E7%89%88%E7%AB%8B%E7%BB%98%EF%BC%89.png',
    '2022/06/17 ~ 07/03',
  ],
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
