<template>
  <div class="grid w-full h-100vh mx-auto place-items-center bg-pink-200">
    <div class="grid w-screen-xl h-100vh mx-auto py-20 place-items-center">
      <div class="w-full px-10 pt-10 pb-14 rounded-xl bg-white bg-opacity-90">
        <div class="flex w-full justify-between text-gray-500">
          <div>
            <h1 class="block text-xl">国内东方人气投票 第⑩回</h1>
            <a class="block float-arrow-box -mt-1 text-base text-blue-400"
              >查看往届结果<icon-uil-arrow-right class="float-arrow inline -ml-0.5 w-5 h-5 align-middle"
            /></a>
          </div>
          <div class="text-lg">
            欢迎回来，<span class="text-black" v-text="username"></span>!
            <a class="border-b border-cyan-200">退出登录</a>
          </div>
        </div>
        <div class="mt-2 mx-2">
          <div class="w-full mt-10 content-end border-b-2 border-gray-300">
            <h2 class="inline-block mx-2 text-3xl">问卷部分</h2>
            <span class="font-light">填写调查问卷</span>
          </div>
          <div class="flex mt-4 flex-row space-x-6">
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">一个官作角色</div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">官作相关</h3>
                  <span class="text-gray-600">官方出版作品的调查</span>
                </div>
              </div>
            </div>
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">一个二创角色</div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">二创相关</h3>
                  <span class="text-gray-600">二次创作作品的调查</span>
                </div>
              </div>
            </div>
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">展会照片？</div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">日常相关</h3>
                  <span class="text-gray-600">展会等现实方面的调查</span>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full mt-12 content-end border-b-2 border-gray-300">
            <h2 class="inline-block mx-2 text-3xl">投票部分</h2>
            <span class="font-light">投上属于你的一票</span>
          </div>
          <div class="flex mt-4 flex-row space-x-6">
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">一个官作角色</div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">人妖部门</h3>
                  <span class="text-gray-600">为喜欢的角色(组)投票</span>
                </div>
              </div>
            </div>
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">
                  大概是<br />虹龙洞封面
                </div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">作品部门</h3>
                  <span class="text-gray-600">为喜欢的官作作品投票</span>
                </div>
              </div>
            </div>
            <div class="card-box flex w-full h-32 flex-row rounded-xl border-2 border-pink-200">
              <div class="card-img flex-shrink-0 w-28 h-full overflow-hidden">
                <div class="grid w-full h-full place-items-center rounded-l-xl bg-purple-300">幸运的<br />专辑封面</div>
              </div>
              <div class="flex flex-col justify-around ml-3">
                <div>
                  <h3 class="text-xl text-cyan-500">音乐部门</h3>
                  <span class="text-gray-600">为喜欢的官作音乐投票</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="quicksand absolute bottom-0 w-99.8vw text-center">
      &copy; Copyright 2021 VoileLabs, THBWiki. Licensed under GPL-3.0.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const username = ref('TestUser144')
</script>

<style lang="postcss" scoped>
.card-box {
  transition: width 300ms ease-out;
  .card-img {
    transition: width 300ms ease-out;
  }
}
.card-box:hover {
  width: 110%;
  .card-img {
    width: 8rem;
  }
}
</style>
