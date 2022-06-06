<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh p-3vh backdrop-filter backdrop-blur-1 grid grid-cols-1 gap-3 content-between">
    <div class="w-full">
      <div class="quicksand text-gray-800 md:text-xl">
        <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
        <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/assets/logoVoilelabs.png" />VoileLabs
      </div>
      <div class="w-full flex flex-wrap space-y-2">
        <div class="w-full"><img src="@/assets/title.svg" /></div>
        <div class="w-full"><img class="w-1/4 inline-block" src="@/assets/title10.svg" /></div>
      </div>
    </div>
    <div class="space-y-2">
      <div class="">
        感谢各位的参与，本次人气投票活动已圆满结束<br />
        所有的投票结果将发布在本站内，请点击下面的链接进入相应的部分查看结果数据<br />
        <label class="text-sm italic text-gray-700">*请注意，一切在本站之外发表的排行、分析、视频均为非官方性质</label>
      </div>
      <div class="space-y-2">
        <div
          v-for="item in departments"
          :key="item.title"
          class="grid grid-cols-5 grid-rows-2 gap-1 rounded border-1 border-accent-600 p-1 shadow cursor-pointer"
        >
          <img :src="item.icon" class="col-span-1 row-span-2 rounded" />

          <div class="col-span-4 text-xl font-bold">{{ item.title }}</div>
          <div class="col-span-4 text-gray-700">{{ '有效票数：' + item.votes }}</div>
        </div>
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
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const departments = ref([
  {
    title: '角色部门',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    votes: 0,
  },
  {
    title: '音乐部门',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    votes: 0,
  },
  {
    title: 'CP部门',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    votes: 0,
  },
  {
    title: '提名部门',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    votes: 0,
  },
  {
    title: '调查问卷',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    votes: 0,
  },
])
</script>
<style lang="postcss" scoped></style>
