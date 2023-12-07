<template>
  <div class="page"></div>
  <div class="flex flex-wrap items-center w-full min-h-100vh px-3vh md:mx-auto md:w-4/5 xl:w-1/2">
    <div class="space-y-6vh w-full md:pt-0 md:flex md:flex-wrap md:content-center md:space-y-4vh">
      <div class="w-full space-y-2">
        <div class="quicksand text-gray-800 md:text-xl">
          <img class="inline-block w-5 h-6 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
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
            class="underline underline-accent-color-600 transition transition-colors px-2 text-lg"
            @click="loginBoxOpen = true"
            >这里</a
          >登录
        </div>
        <div>
          新版的投票结果页面尚处于开发中，如果您想查看结果速报，请点击<a
            class="underline underline-accent-color-600 transition transition-colors px-2 text-lg"
            @click="jumpToResultPage()"
            >这里</a
          >查看
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
import { useRoute, useRouter } from 'vue-router'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import LoginBox from '@/home/components/LoginBox.vue'
import Copyright from '@/common/components/Copyright.vue'

const route = useRoute()
const router = useRouter()

setSiteTitle('已结束 - 第⑩回 中文东方人气投票')

const loginBoxOpen = ref(false)
async function jumpToResultPage() {
  const query = JSON.parse(JSON.stringify(route.query))
  query.result = true
  await router.push({ path: route.path, query })
  location.reload()
}
</script>
<style lang="postcss" scoped></style>
