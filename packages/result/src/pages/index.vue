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
          <div>【开发版】感谢各位的参与，本次人气投票活动已圆满结束</div>
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
        class="flex items-center justify-center p-2 w-full border-y border-accent-400 bg-opacity-30 bg-accent-100 shadow cursor-pointer transition transition-all active:translate-1"
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

setSiteTitle('【开发版】投票结果 - 第⑩回 中文东方人气投票')

const resultTypeMeta = ref([
  {
    img: 'https://s3c.lilywhite.cc/thvote/imgs/nav/character@100px.png',
    name: '角色部门',
    to: '/character',
  },
  {
    img: 'https://s3c.lilywhite.cc/thvote/imgs/nav/music@100px.png',
    name: '音乐部门',
    to: '/music',
  },
  {
    img: 'https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png',
    name: 'CP部门',
    to: '/couple',
  },
  {
    img: 'https://s3c.lilywhite.cc/thvote/imgs/nav/doujin@100px.png',
    name: '提名部门',
    to: '/doujin',
  },
  {
    img: 'https://s3c.lilywhite.cc/thvote/imgs/nav/questionnaireDetail@100px.png',
    name: '调查问卷',
    to: '/questionnaireDetail',
  },
])
</script>

<style lang="postcss" scoped></style>

<route lang="yaml">
meta:
  layout: blank
  navid: summary
</route>
