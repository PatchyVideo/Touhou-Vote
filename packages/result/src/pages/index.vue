<template>
  <!-- Cover -->
  <div class="page"></div>
  <div class="flex justify-center">
    <div class="flex w-full h-45vh md:h-70vh flex-col">
      <div class="flex-1"></div>

      <div ref="titleEl" class="flex-1 flex mx-2 my-auto max-h-32 justify-center items-center">
        <div class="flex flex-col">
          <div class="quicksand flex items-center gap-1 text-gray-800 md:text-xl">
            <img class="w-5" src="https://thwiki.cc/favicon.ico" />
            THBWiki &
            <img class="w-8" src="@/assets/logoVoilelabs.png" />
            VoileLabs
          </div>

          <div class="flex mx-2 md:mx-12 flex-col gap-y-2">
            <img class="w-96" src="@/assets/title.svg" />
            <img class="ml-2/3 w-1/4" src="@/assets/title10.svg" />
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-between items-center">
        <div class="mt-12 mx-4 md:max-w-60vw">
          <div>感谢各位的参与，本次人气投票活动已圆满结束</div>
          <div>所有的投票结果将发布在本站内，请点击下面的链接进入相应的部分查看结果数据</div>
          <span class="text-sm italic text-gray-700">*请注意，一切在本站之外发表的排行、分析、视频均为非官方性质</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Nav -->
  <div class="my-5">
    <Nav v-if="screenSizes['md']" no-padding />
    <div v-else class="min-w-50 mx-auto space-y-1">
      <router-link
        :to="item.to"
        v-for="item in resultTypeMeta"
        :key="item.name"
        class="flex items-center justify-center p-2 w-full max-w-100 border-y border-accent-400 bg-opacity-30 bg-accent-100 shadow cursor-pointer transition transition-all active:translate-1"
      >
        <img :src="item.img" class="w-10 h-10" />
        <div class="text-black text-xl">{{ item.name }}</div>
      </router-link>
    </div>
  </div>

  <!-- Copyright -->
  <div class="w-full text-center">
    <div>
      <a rel="noopener noreferrer" href="/nav">历届人气投票结果</a>&ensp;
      <a target="_blank" rel="noopener noreferrer" href="https://jq.qq.com/?k=0BnkgDKx">反馈问题</a>
    </div>
    <div class="quicksand">&copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.</div>
  </div>
</template>

<script lang="ts" setup>
import { screenSizes } from '@/composables/style'

setSiteTitle('投票结果 - 第⑩回 中文东方人气投票')

const resultTypeMeta = ref([
  {
    img: 'https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png/100px-THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png',
    name: '角色部门',
    to: '/character',
  },
  {
    img: 'https://upload.thwiki.cc/thumb/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png/100px-THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png',
    name: '音乐部门',
    to: '/music',
  },
  {
    img: 'https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png/100px-THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png',
    name: 'CP部门',
    to: '/couple',
  },
  {
    img: 'https://upload.thwiki.cc/thumb/f/f7/THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png/100px-THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png',
    name: '提名部门',
    to: '/doujin',
  },
  {
    img: 'https://upload.thwiki.cc/thumb/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png/100px-THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    name: '调查问卷',
    to: '/questionnaire',
  },
])
</script>

<style lang="postcss" scoped></style>

<route lang="yaml">
meta:
  layout: blank
  navid: summary
</route>
