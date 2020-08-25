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
          <base-input v-model="userMail" placeholder="请输入邮箱" />
          <a class="underline">发送验证码</a>
        </div>
        <div class="mb-6">
          <base-input v-model="userPassword" placeholder="请输入密码" />
        </div>
        <div>
          <base-button @click="console.log('hi')">登录</base-button>
        </div>
      </form>
    </div>
    <divider />
    <!-- 投票说明 -->
    <div class="h-screen">
      投票说明
      {{ characters.主角组[1].name }}
    </div>
    <divider />
    <!-- 常见问题 -->
    <div class="h-screen">
      常见问题
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import divider from '~/components/BaseDivider.vue'
import baseInput from '~/components/BaseInput.vue'
import baseButton from '~/components/BaseButton.vue'

export default defineComponent({
  components: { divider, baseInput, baseButton },
  data() {
    return {
      // 用户邮箱
      userMail: '',
      // 用户密码
      userPassword: '',
    }
  },
  setup() {
    return {}
  },
})
</script>

<style lang="postcss" scoped></style>
