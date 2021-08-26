<template>
  <div class="page grid w-full h-full max-w-screen-2xl mx-auto place-items-center">
    <div class="w-full h-full backdrop-filter backdrop-blur-1">
      <!-- Main Content -->
      <div class="w-full h-100vh max-h-screen-lg">
        <div class="grid w-full h-full place-items-center mx-auto">
          <div class="flex w-4/5 flex-row justify-between">
            <!-- Left Text -->
            <div>
              <!-- Logo -->
              <div class="quicksand text-3xl text-gray-800">
                <img class="inline-block w-10 h-11 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />THBWiki &
                <img
                  class="inline-block w-15 h-15 pb-1 align-middle"
                  src="@/common/assets/logoVoilelabs.png"
                />VoileLabs
              </div>
              <!-- Title -->
              <div class="mt-10 h-15 w-128"><img src="@/common/assets/title.svg" /></div>
              <div class="flex mr-15 mt-4 flex-row items-center justify-between">
                <div class="h-12 w-37 rounded"><img src="@/common/assets/title10.svg" /></div>
                <div class="flex items-center space-x-1">
                  <icon-uil-clock-five></icon-uil-clock-five>
                  <div class="text-right text-gray-700 font-sans">距离投票结束还有 00天00时00分</div>
                </div>
              </div>
              <div class="mt-8 w-128 text-gray-600 text-xl font-light">
                这是一个为了调查东方Project系列在中文圈的大致情况而举办的一次调查活动。在活动期间，我们同往届一样，接受来自中文圈内的东方爱好者们的投票，并在投票结束后择日公布本次投票的结果。敬请期待。<br />
                <a v-if="false" class="float-arrow-box"
                  >查看往届结果<icon-uil-arrow-right class="float-arrow inline -ml-1 w-8 h-8 align-middle"
                /></a>
              </div>
            </div>
            <!-- Login Box -->
            <div
              class="relative w-146 shadow-around rounded-3xl bg-white bg-opacity-90 backdrop-filter backdrop-blur-4"
            >
              <div class="w-full flex content-between text-center">
                <div
                  class="pl-5 py-4 w-9/20 rounded-tl-3xl"
                  :class="{ 'bg-cool-gray-300 bg-opacity-50 cursor-pointer shadow-innery': !loginWithVerificationCode }"
                  @click="loginWithVerificationCode = true"
                >
                  手机号/邮箱验证码登陆
                </div>
                <div class="w-1/10 overflow-hidden">
                  <div
                    class="aspect-1/1 relative opacity-50"
                    :class="[loginWithVerificationCode ? 'tab-active-left' : 'tab-active-right']"
                  ></div>
                </div>
                <div
                  class="pr-7 py-4 w-9/20 rounded-tr-3xl"
                  :class="{ 'bg-cool-gray-300 bg-opacity-50 cursor-pointer shadow-innery': loginWithVerificationCode }"
                  @click="loginWithVerificationCode = false"
                >
                  其他方式登陆
                </div>
              </div>
              <div v-if="loginWithVerificationCode" class="px-10 py-8">
                <label class="input-border flex flex-row mt-5 py-2.5 px-4"
                  ><icon-uil-user class="inline-block w-6 h-6 text-gray-700" /><input
                    class="ml-2 w-full bg-transparent focus:outline-none"
                    placeholder="在这里输入你的邮箱或手机号"
                    type="text"
                /></label>
                <div class="text-accent-color-600">请输入正确格式的邮箱或手机号！</div>
                <div class="mt-4 flex justify-between">
                  <label class="w-2/3 py-2.5 px-4 inline-block input-border flex flex-row"
                    ><icon-uil-lock-alt class="inline-block w-6 h-6 text-gray-700" /><input
                      class="ml-2 w-full bg-transparent focus:outline-none"
                      placeholder="在这里输入验证码"
                      type="password"
                  /></label>
                  <button class="p-3 rounded-xl text-white bg-accent-color-600">获取验证码</button>
                </div>
                <div class="text-accent-color-600">请输入正确的验证码！</div>
                <button class="mt-5 w-full h-12 rounded-xl text-lg text-white bg-accent-color-600">开始投票</button>
              </div>
              <div v-else class="px-10 py-8 space-y-5">
                <div class="linkbox-border w-full text-lg text-center mt-2 px-4 pt-2 pb-1 text-gray-800 cursor-pointer">
                  <img
                    class="inline-block w-8 h-9 pb-1 align-middle"
                    src="@/common/assets/logoOldSystem.ico"
                  /><span></span>
                  <span> 使用旧版账号密码登陆</span>
                </div>
                <div class="linkbox-border w-full text-lg text-center mt-2 px-4 pt-2 pb-1 text-gray-800 cursor-pointer">
                  <img class="inline-block w-8 h-9 pb-1 align-middle" src="https://thwiki.cc/favicon.ico" />
                  <span> 通过 THBWiki 登录</span>
                </div>
                <div class="linkbox-border w-full text-lg text-center mt-2 px-4 pt-2 pb-1 text-gray-800 cursor-pointer">
                  <img class="inline-block w-6 h-9 pb-1 align-middle" src="@/common/assets/logoPatchyVideo.png" /><span>
                    通过 PatchyVideo 登录</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Messages -->
      <div class="w-3/4 mx-auto py-12">
        <div class="w-full h-full p-8 shadow-around rounded-xl bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
          <article class="prose-xl">
            <h2>其他信息</h2>
            <p>投票的举办地点与结果的发布地点均为本站。</p>
            <p>
              本次投票的规则与上一届相同。 <strong>角色票为8个，音乐票为12个。</strong><br />
              投票过程为黑箱投票，即在投票过程中不显示当前总体投票情况，而是在投票结束后计算出结果进行展示。
            </p>
            <p>
              如果想了解投票活动的最新动态的话，请关注<strong>东方人气投票组委会</strong>：<a
                class="ani-link px-1"
                target="_blank"
                rel="noopener noreferrer"
                href="https://weibo.com/touhouvote"
                >新浪微博</a
              >，或者收藏本站。
            </p>
            <p>
              为了防止刷票等影响公平的行为出现，我们将会采取一切我们认为必要的手段，这一点还请各位投票者注意。<br />
              希望大家能够在公平公正的原则下，为你所喜欢的项目投上属于你的一票。
            </p>
            <!-- ... -->
          </article>
        </div>
      </div>

      <!-- Copyright -->
      <div class="quicksand text-center my-6">
        <div>&copy; Copyright 2021 VoileLabs, THBWiki. Licensed under GPL-3.0.</div>
        <div>
          Thanks
          <template
            v-for="([name, url], index) in [
              ['Vite', 'https://vitejs.dev/'],
              ['ViteIcons', 'https://github.com/antfu/vite-plugin-icons'],
              ['Vue.js 3', 'https://v3.vuejs.org/'],
              ['VueRouter', 'https://next.router.vuejs.org/'],
              ['VueUse', 'https://vueuse.org/'],
              ['VueI18n', 'https://vue-i18n.intlify.dev/'],
              ['VueApollo', 'https://v4.apollo.vuejs.org/'],
              ['ApolloClient', 'https://www.apollographql.com/docs/react/'],
              ['WindiCSS', 'https://windicss.org/'],
              ['PostCSS', 'https://postcss.org/'],
            ]"
            :key="name"
            ><template v-if="index !== 0">, </template
            ><a class="text-blue-500" :href="url" target="_blank" rel="noopener noreferrer" v-text="name"></a
          ></template>
          and others!
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const loginWithVerificationCode = ref(true)
</script>

<style lang="postcss" scoped>
.page {
  background-image: radial-gradient(
    circle at top left,
    transparent 0 min(60vw, 1152px),
    theme('colors.accent-color.600') min(60vw, 1152px),
    theme('colors.accent-color.500')
  );
}
.tab-active-left:before,
.tab-active-right:before {
  content: ' ';
  position: absolute;
  @apply h-12;
  @apply w-50;
  @apply transform;
  @apply -rotate-135;
  @apply shadow-tab;
}
.tab-active-left:before {
  left: -109px;
  @apply -rotate-135;
}
.tab-active-right:before {
  right: -109px;
  @apply rotate-135;
}
.tab-active-left {
  background: linear-gradient(to top right, transparent 50%, theme('colors.gray.300') 0);
}
.tab-active-right {
  background: linear-gradient(to top left, transparent 50%, theme('colors.gray.300') 0);
}
</style>
