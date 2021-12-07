<template>
  <div class="page w-full">
    <div
      class="
        flex flex-wrap
        items-center
        justify-between
        w-full
        px-3vh
        backdrop-filter backdrop-blur-1
        md:w-9/10 md:mx-auto
        xl:w-2/3
      "
    >
      <!-- Title -->
      <div class="w-full min-h-100vh pt-6vh space-y-6vh md:w-9/19 md:pt-0 md:flex md:flex-wrap md:content-center">
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
        <div v-if="screenSizes['<md']" class="text-gray-600 text-lg">
          这是一个为了调查东方Project系列在中文圈的大致情况而举办的一次调查活动。在活动期间，我们同往届一样，接受来自中文圈内的东方爱好者们的投票，并在投票结束后择日公布本次投票的结果。敬请期待。
        </div>
        <a class="float-arrow-box space-x-3 flex items-center" @click="loginBoxOpen = true"
          ><img class="w-3/5" src="@/common/assets/login.svg" /><img
            src="@/common/assets/loginIcon.svg"
            class="float-arrow w-1/6"
        /></a>
        <div class="w-full text-lg flex items-center space-x-1">
          <icon-uil-clock-five></icon-uil-clock-five>
          <div class="text-right text-md text-gray-700 font-sans">
            {{ '距结束还有 ' + daysWith0 + '天' + hoursWith0 + '时' + minutesWith0 + '分' + secondsWith0 + '秒' }}
          </div>
        </div>
      </div>

      <div
        v-if="screenSizes['md']"
        class="
          w-9/19
          text-gray-600 text-xl
          rounded-xl
          p-8
          shadow-around
          bg-white bg-opacity-50
          backdrop-filter backdrop-blur-2
        "
      >
        这是一个为了调查东方Project系列在中文圈的大致情况而举办的一次调查活动。在活动期间，我们同往届一样，接受来自中文圈内的东方爱好者们的投票，并在投票结束后择日公布本次投票的结果。敬请期待。
      </div>

      <div
        class="
          w-full
          absolute
          top-94vh
          left-0
          text-xl text-center text-accent-color-500
          cursor-pointer
          transition
          hover:text-accent-color-600
        "
        @click="showMoreInfo()"
      >
        <icon-uil-angle-double-down class="w-10 h-10 fill-current animate-bounce" />
      </div>

      <!-- Other Messages -->
      <div
        class="
          w-full
          pt-6vh
          md:p-10
          md:shadow-around
          md:rounded-xl
          md:bg-white
          md:bg-opacity-50
          md:backdrop-filter
          md:backdrop-blur-2
          md:mt-10
        "
      >
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

      <!-- Copyright -->
      <div class="quicksand w-full text-center my-6">
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
            ><a class="text-accent-color-500" :href="url" target="_blank" rel="noopener noreferrer" v-text="name"></a
          ></template>
          and others!
        </div>
      </div>
    </div>
  </div>
  <LoginBox v-model:open="loginBoxOpen" />
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { screenSizes } from '@/tailwindcss'
import LoginBox from './components/LoginBox.vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle('第⑩回 中文东方人气投票')

const loginBoxOpen = ref(false)

function showMoreInfo(): void {
  window.scrollTo({
    top: screen.height,
    behavior: 'smooth',
  })
}

// Calculate Time Remains
const days = ref<number>(0)
const daysWith0 = computed<string>(() => SupplementZero(days.value))
const hours = ref<number>(0)
const hoursWith0 = computed<string>(() => SupplementZero(hours.value))
const minutes = ref<number>(0)
const minutesWith0 = computed<string>(() => SupplementZero(minutes.value))
const seconds = ref<number>(0)
const secondsWith0 = computed<string>(() => SupplementZero(seconds.value))
function SupplementZero(num: number): string {
  let stringNumber = '00' + String(num)
  return stringNumber.substr(stringNumber.length - 2)
}

let timer = setInterval(() => {
  let d = new Date()
  let hoursNow = d.getHours()
  let minutesNow = d.getMinutes()
  let secondsNow = d.getSeconds()

  let now1 = d.getTime()
  let ddl = new Date('2022/1/1')
  let now2 = ddl.getTime()
  let ddlTime = now2 - now1
  if (ddlTime < 0) return

  days.value = Math.floor(ddlTime / 1000 / 60 / 60 / 24)
  hours.value = 23 - hoursNow
  minutes.value = 59 - minutesNow
  seconds.value = 59 - secondsNow
}, 1000)
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="postcss" scoped></style>
