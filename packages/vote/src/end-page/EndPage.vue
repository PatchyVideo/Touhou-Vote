<template>
  <div class="page"></div>
  <div class="flex flex-wrap items-center w-full min-h-100vh">
    <div
      class="baseBoxRoundedShadow space-y-6vh w-full p-5 md:py-10 md:flex md:flex-col md:flex-wrap md:content-center md:space-y-4vh"
    >
      <div class="md:w-1/2 xl:w-1/3 space-y-2">
        <div class="quicksand md:text-xl">
          <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://static.thwiki.cc/favicon.png" />THBWiki &
          <img class="inline-block w-8 h-10 pb-1 align-middle" src="@/common/assets/logoVoilelabs.png" />VoileLabs
        </div>
        <div class="w-full flex flex-wrap space-y-2">
          <div class="w-full"><img src="@/common/assets/title.svg" /></div>
          <div class="w-full"><img class="w-1/4 inline-block" src="@/common/assets/titleNum.svg" /></div>
        </div>
      </div>
      <div>
        <div>
          投票已经结束,如果您想修改自己的账户信息，请点击<a
            class="underline underline-accent-color-600 transition transition-colors px-2 text-xl"
            @click="loginBoxOpen = true"
            >这里</a
          >登录
        </div>
      </div>
    </div>
    <div v-if="screenSizes['<md']"></div>
    <Copyright copyright-type="fixed" />
  </div>
  <LoginBox v-model:open="loginBoxOpen" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import LoginBox from '@/home/components/LoginBox.vue'
import Copyright from '@/common/components/Copyright.vue'

setSiteTitle('已结束')

const loginBoxOpen = ref(false)
</script>
<style lang="postcss" scoped></style>
