<template>
  <div class="page"></div>
  <div class="w-full backdrop-filter backdrop-blur-1">
    <div class="w-full min-h-100vh p-3vh md:w-1/2 md:mx-auto grid grid-cols-1 gap-y-3 md:gap-y-10 content-between">
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
        <div class="md:max-w-120 mx-auto">
          <div>感谢各位的参与，本次人气投票活动已圆满结束</div>
          <div>所有的投票结果将发布在本站内，请点击下面的链接进入相应的部分查看结果数据</div>
          <label class="text-sm italic text-gray-700"
            >*请注意，一切在本站之外发表的排行、分析、视频均为非官方性质</label
          >
        </div>
        <div class="space-y-2 md:space-y-5">
          <router-link
            :to="item.to"
            v-for="item in departments"
            :key="item.title"
            class="max-w-100 mx-auto grid grid-cols-5 grid-rows-2 gap-1 rounded ring ring-accent-600 p-1 opacity-80 bg-white shadow cursor-pointer transition transition-all md:hover:-translate-1 md:hover:bg-accent-100 active:translate-1"
          >
            <img :src="item.icon" class="w-full col-span-1 row-span-2 rounded" />
            <div class="col-span-4 text-black text-xl font-bold">{{ item.title }}</div>
            <div class="col-span-4 text-gray-700">{{ '有效票数：' + item.count }}</div>
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
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { setSiteTitle } from '@touhou-vote/shared/data/setSiteTitle'
setSiteTitle('投票结果 - 第⑩回 中文东方人气投票')

const departments = ref([
  {
    title: '角色部门',
    icon: 'https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png',
    count: 0,
    to: '/character',
  },
  {
    title: '音乐部门',
    icon: 'https://upload.thwiki.cc/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png',
    count: 0,
    to: '/character',
  },
  {
    title: 'CP部门',
    icon: 'https://upload.thwiki.cc/0/02/THBWiki-LOGO-%E4%B8%89%E6%9C%88%E7%B2%BE.png',
    count: 0,
    to: '/character',
  },
  {
    title: '提名部门',
    icon: 'https://upload.thwiki.cc/f/f7/THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png',
    count: 0,
    to: '/character',
  },
  {
    title: '调查问卷',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    count: 0,
    to: '/character',
  },
])
</script>
<style lang="postcss" scoped></style>
