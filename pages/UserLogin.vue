<template>
  <div>
    <!-- 背景图片 -->
    <div class="LoginImg fixed w-screen h-screen bg-cover -z-1">
      <div class="h-full w-full bg-white opacity-75"></div>
    </div>
    <!-- 登录页面 -->
    <div class="flex flex-wrap items-center justify-around h-screen px-40 py-40">
      <div class="leading-10 h-32">
        <div class="tracking-wide text-3xl font-bold mb-2">第⑨届</div>
        <div class="tracking-wide text-3xl font-bold mb-2">中文东方人气投票</div>
      </div>
      <form class="w-84">
        <label class="font-mono tracking-wide text-3xl font-bold mb-2">您好，请登录</label>
        <div class="mb-4">
          <input
            id="username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="邮箱地址"
          />
          <a class="underline">发送验证码</a>
        </div>
        <div class="mb-6">
          <input
            id="password"
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="请输入密码"
          />
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            登录
          </button>
        </div>
      </form>
    </div>
    <divider />
    <!-- 投票说明 -->
    <div class="h-screen">
      投票说明
    </div>
    <divider />
    <!-- 常见问题 -->
    <div class="h-screen">
      投票说明
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'
import divider from '~/components/Divider.vue'

export default defineComponent({
  components: { divider },
  setup() {
    return {}
  },
})
</script>

<style lang="postcss" scoped></style>
