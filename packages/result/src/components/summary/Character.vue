<template>
  <div class="mx-1 my-3">
    <div
      class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png/100px-THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">角色部门</h2>
        <span class="ml-3 text-xl">目录</span>
      </div>
      <div class="grid grid-cols-3 grid-rows-2 gap-1 text-center">
        <div>参投角色总数</div>
        <div>总本命票数</div>
        <div>总有效票数</div>
        <div>{{ characterList.length }}</div>
        <div>0</div>
        <div>0</div>
      </div>
    </div>

    <div class="md:m-4 p-1 bg-white bg-opacity-80 md:bg-opacity-0">
      <div
        class="grid p-1 md:grid-cols-2 gap-4 md:gap-8 shadow-inner md:shadow-transparent bg-gray-50 bg-opacity-50 md:bg-opacity-0"
      >
        <div
          v-for="item in pages"
          :key="item.title"
          class="col-span-1 p-3 w-full max-w-100 md:mx-auto rounded opacity-80 bg-white shadow md:shadow-around cursor-pointer transition transition-all md:hover:-translate-1 md:hover:bg-accent-100 active:translate-1"
        >
          <div class="text-black text-xl font-bold">{{ item.title }}</div>
          <div class="text-gray-700">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为人气投票角色部门的结果目录，请点击上面的对应项目查看详细数据。<br />
      *本届与上一届相同，数据展示的结构和层次均进行了重新的设计，本届的结果都在一个页面内集中展示。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { characterList } from '@touhou-vote/shared/data/character'

const pages = [
  {
    title: '本届投票结果',
    desc: '本届的所有角色投票信息均整理在该页面',
  },
  {
    title: '上届对比结果',
    desc: '与上一届的角色投票信息进行比对的页面',
  },
  {
    title: '投票演进比对',
    desc: '选择角色并对比其投票演进与变化的情况',
  },
  {
    title: '同投关系可视化',
    desc: '角色的同投率关系可视化',
  },
]
</script>
