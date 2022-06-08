<template>
  <LayoutDefault contentCenter="true">
    <div class="mx-1 my-3 rounded shadow md:shadow-transparent">
      <div
        class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:w-1/2 md:mx-auto md:flex md:justify-between md:items-center"
      >
        <div class="text-4xl align-bottom">角色部门<label class="text-xl ml-3">目录</label></div>
        <div class="grid grid-cols-3 grid-rows-2 gap-1 text-center">
          <div>参投角色总数</div>
          <div>总本命票数</div>
          <div>总有效票数</div>
          <div>{{ characterList.length }}</div>
          <div>0</div>
          <div>0</div>
        </div>
      </div>
      <div class="md:m-5 p-1 bg-white bg-opacity-80 md:bg-opacity-0">
        <div class="p-1 shadow-inner md:shadow-transparent bg-gray-50 bg-opacity-50 md:bg-opacity-0">
          <div
            v-for="item in pages"
            :key="item.title"
            class="m-1 md:m-5 p-3 max-w-100 md:mx-auto rounded opacity-80 bg-white shadow md:shadow-around cursor-pointer transition transition-all md:hover:-translate-1 md:hover:bg-accent-100 active:translate-1"
          >
            <div class="col-span-4 text-black text-xl font-bold">{{ item.title }}</div>
            <div class="col-span-4 text-gray-700">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      <div
        class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700 md:w-1/2 md:mx-auto"
      >
        *本页面为人气投票角色部门的结果目录，请点击上面的对应项目查看详细数据。<br />
        *本届与上一届相同，数据展示的结构和层次均进行了重新的设计，本届的结果都在一个页面内集中展示。
      </div>
    </div>
  </LayoutDefault>
</template>
<script lang="ts" setup>
import { characterList } from '@touhou-vote/shared/data/character'
import { setSiteTitle } from '@touhou-vote/shared/data/setSiteTitle'
setSiteTitle('角色部门结果 - 第⑩回 中文东方人气投票')

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
<style lang="postcss" scoped></style>
