<template>
  <!-- 背景层：保持不变 -->
  <div class="fixed inset-0 -z-1 w-screen h-screen bg-gradient-to-b from-pink-500/10 to-pink-500/5 pointer-events-none"></div>
  
  <div class="w-full max-w-screen-lg mx-auto">
    <div class="flex flex-col py-10vh lg:py-15vh mx-2">
      <!-- Header -->
      <div class="quicksand text-gray-800 md:text-xl font-bold">
        <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://static.thwiki.cc/favicon.png" alt="THBWiki" /> 
        THBWiki &
        <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/assets/logoVoilelabs.png" alt="VoileLabs" /> 
        VoileLabs
      </div>
      
      <h1 class="text-5xl mt-2 mb-4">
        <img class="h-12" alt="中文东方人气投票" src="@/assets/title.svg" />
      </h1>

      <!-- 最新一届的大按钮 -->
      <a
        class="group flex flex-row flex-nowrap items-center gap-2 my-3 md:my-4 p-2 md:p-4 rounded-xl border-2 md:border-4 border-pink-300 border-dashed 
               hover:border-solid hover:bg-pink-50 
               transition-all duration-300 ease-out
               hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_rgba(236,72,153,0.3)]"
        :href="'/' + latestLink"
      >
        <div
          :style="'background-image: url(' + latestIcon + ')'"
          class="w-16 h-16 md:w-20 md:h-20 bg-[length:192px_192px] md:bg-[length:240px_240px] shrink-0"
          :class="resultListIconPosition[(latestOriginalIndex ?? 0) % 9]"
        />
        <div>
          <div class="text-2xl md:text-4xl text-pink-600 font-bold group-hover:text-pink-700 transition-colors">
            <template v-if="voting">
              参与第{{ latestTitle }}回人气投票
              <!-- 让箭头也有个小动画 -->
              <i class="inline-block align-text-bottom mb-px md:mb-1 i-carbon-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </template>
            <template v-else>查看第{{ latestTitle }}回人气投票结果</template>
          </div>
          <div class="text-sm sm:text-base text-gray-600 mt-1">
            <template v-if="voting">距结束还有 <span class="font-mono font-bold">{{ ddlHint }}</span></template>
            <template v-else>投票时间 {{ latestTime }}</template>
          </div>
        </div>
      </a>

      <!-- 往届列表 -->
      <div class="grid lg:grid-cols-2 gap-3">
        <a
          v-for="([link, title, icon, time, _, originalIndex]) in resultList.slice(1)"
          :key="link"
          class="flex flex-row items-center flex-nowrap gap-2 p-2 md:px-3 md:py-2 rounded-lg border-2 border-pink-300 border-dotted 
                 hover:border-solid hover:bg-pink-50 
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-[0_4px_20px_-4px_rgba(236,72,153,0.2)]"
          :href="'/' + link"
        >
          <div
            :style="'background-image: url(' + icon + ')'"
            class="w-12 h-12 md:w-14 md:h-14 bg-[length:144px_144px] md:bg-[length:168px_168px] shrink-0"
            :class="resultListIconPosition[(originalIndex ?? 0) % 9]"
          />
          <div>
            <div class="text-xl md:text-3xl text-pink-500 font-bold">第{{ title }}回结果页</div>
            <div class="text-sm sm:text-base text-gray-500">投票时间 {{ time }}</div>
          </div>
        </a>
      </div>

      <!-- Copyright -->
      <div class="quicksand w-full text-center my-6 text-gray-500 text-sm">
        &copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.<br />
        Backend Deployed on <a class="text-pink-500 hover:underline" target="_blank" href="https://cloud.touhou.best">车万云</a>.
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { formatDuration, intervalToDuration } from 'date-fns'
import dateFnsZhCN from 'date-fns/locale/zh-CN'

// ResultListRaw的类型定义
type PollTuple = [string, string, string, string, string?, number?]

const resultListRaw: PollTuple[] = [
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
  // byd 截止时间不要写死在前面的变量里面，我更倾向于把这个List从后端请求过来，但为了保持一致性，这里加了一个示例
  ['v11', '11', 'https://asset.lilywhite.cc/test/test2.png', '2023/12/29 ~ 01/14', '2024-01-15T00:00:00+08:00'],
]

const resultListIconPosition = [
  'bg-left-top', 'bg-top', 'bg-right-top',
  'bg-left', 'bg-center', 'bg-right',
  'bg-left-bottom', 'bg-bottom', 'bg-right-bottom',
]

// 把index给塞进去，原来倒序排列会让图片被搞乱，所以这里先正序塞index再倒序，虽然原来也没给倒序的按钮
const resultList = resultListRaw.map((item, index) => [...item, index] as unknown as PollTuple).reverse()

const latest = resultList[0]
// 新增 latestEndDate 和 latestOriginalIndex
const [latestLink, latestTitle, latestIcon, latestTime, latestEndDate, latestOriginalIndex] = latest

// 如果数据里配了截止时间就用，没配就给个 0 (已结束)
const votingEnd = latestEndDate ? new Date(latestEndDate) : new Date(0)

const now = useNow({ interval: 1000 })

// 增加空值判断，防止没有截止时间时也显示倒计时
const voting = computed(() => {
  return latestEndDate && now.value < votingEnd
})

// 时间到截止日期的距离
const ddlHint = computed(() => {
  if (!voting.value) return ''
  return formatDuration(
    intervalToDuration({
      start: now.value,
      end: votingEnd,
    }),
    { locale: dateFnsZhCN }
  )
})
</script>