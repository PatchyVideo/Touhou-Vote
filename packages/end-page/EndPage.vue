<template>
  <div class="page min-h-100vh">
    <div
      class="flex flex-wrap items-center w-full min-h-100vh px-3vh backdrop-filter backdrop-blur-1 md:mx-auto md:w-4/5 xl:w-1/2"
    >
      <div class="space-y-6vh md:pt-0 md:flex md:flex-wrap md:content-center md:space-y-4vh">
        <div class="w-full space-y-2">
          <div class="quicksand text-gray-800 md:text-xl">
            <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
            <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/common/assets/logoVoilelabs.png" />VoileLabs
          </div>
          <div class="w-full flex flex-wrap space-y-2">
            <div class="w-full"><img src="@/common/assets/title.svg" /></div>
            <div class="w-full"><img class="w-1/4 inline-block" src="@/common/assets/title10.svg" /></div>
          </div>
        </div>
        <div>
          <div>
            投票已经结束，请耐心等待投票结果。如果您想修改自己的账户信息，请点击<a
              class="underline underline-accent-color-600 transition transition-colors px-2 text-lg"
              @click="loginBoxOpen = true"
              >这里</a
            >登录
          </div>
        </div>
      </div>
      <div v-if="screenSizes['<md']"></div>
      <!-- Copyright -->
      <div class="fixed bottom-0 left-0 quicksand w-full text-center my-6">
        <div>&copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.</div>
      </div>
    </div>
  </div>
  <LoginBox v-model:open="loginBoxOpen" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import LoginBox from '@/home/components/LoginBox.vue'

setSiteTitle('已结束 - 第⑩回 中文东方人气投票')

const loginBoxOpen = ref(false)
</script>
<style lang="postcss" scoped></style>
