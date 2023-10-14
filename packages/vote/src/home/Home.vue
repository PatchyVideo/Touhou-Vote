<template>
  <div class="page"></div>
  <div class="w-full backdrop-filter backdrop-blur-1">
    <div class="flex flex-wrap items-center justify-between w-full px-3vh md:w-9/10 md:mx-auto xl:w-2/3">
      <!-- Title -->
      <div class="grid md:grid-cols-2 place-items-center w-full min-h-100vh gap-16">
        <div class="space-y-6vh md:pt-0 md:flex md:flex-wrap md:content-center md:space-y-4vh">
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
          <div v-if="screenSizes['<md']" class="text-gray-600 text-lg">
            这是一个为了调查东方Project系列在中文社群的大致情况而举办的一次调查活动。在举办期间，我们同往届一样接受来自中文社群的东方爱好者们的投票。并将在投票结束后择日公布本次投票的结果。期待您的参与。
          </div>
          <a class="float-arrow-box space-x-3 flex items-center w-3/5 md:w-1/2" tabindex="0"
            @click="loginBoxOpen = true"><img class="w-3/5" src="@/common/assets/login.svg" /><img
              src="@/common/assets/loginIcon.svg" class="float-arrow w-1/6" /></a>
          <div class="w-full text-lg flex items-center space-x-1">
            <icon-uil-clock-five />
            <div class="text-right text-md text-gray-700 font-sans">
              {{ '距结束还有 ' + daysWith0 + '天' + hoursWith0 + '时' + minutesWith0 + '分' + secondsWith0 + '秒' }}
            </div>
          </div>
        </div>

        <div v-if="screenSizes['md']"
          class="text-gray-600 text-xl rounded-xl p-8 shadow-around bg-white bg-opacity-80 backdrop-filter backdrop-blur-2">
          这是一个为了调查东方Project系列在中文圈的大致情况而举办的一次调查活动。在活动期间，我们同往届一样，接受来自中文圈内的东方爱好者们的投票，并在投票结束后择日公布本次投票的结果。敬请期待。
        </div>
      </div>

      <div
        class="w-full absolute top-94vh left-0 text-xl text-center text-accent-color-500 cursor-pointer transition hover:text-accent-color-600"
        @click="showMoreInfo()">
        <icon-uil-angle-double-down class="w-10 h-10 fill-current animate-bounce" />
      </div>

      <!-- Other Messages -->
      <div
        class="w-full pt-6vh md:p-10 md:shadow-around md:rounded-xl md:bg-white md:bg-opacity-80 md:backdrop-filter md:backdrop-blur-2 md:mt-10">
        <article class="prose-lg lg:prose-xl">
          <h2>投票详情</h2>
          <p>投票的举办地点与结果的发布地点均为本站。</p>
          <p>
            本次投票的规则与上一届相同。 <strong>角色票为8个，音乐票为12个，CP票为4个。</strong><br />
            此外，本届新增加了作品提名部门，<strong>每人有提名5个作品的机会</strong>。<br />
            投票过程为黑箱投票，即在投票过程中不显示实时投票统计，而是在投票结束后计算出结果进行展示。
          </p>
          <p>
            如果想了解投票活动的最新动态的话，请关注<strong>中文东方人气投票组委会</strong>：<a class="ani-link px-1" target="_blank"
              rel="noopener noreferrer" href="https://space.bilibili.com/548871707">bilibili</a>，
            <a class="ani-link px-1" target="_blank" rel="noopener noreferrer"
              href="https://weibo.com/touhouvote">新浪微博</a>，或者收藏本站。<br />
            若投票中遇到问题或有建议想要反馈，请<a class="ani-link px-1" target="_blank" rel="noopener noreferrer"
              href="https://jq.qq.com/?k=0BnkgDKx">加入 QQ 群反馈</a>。
          </p>
          <p>
            为了防止刷票等影响公平的行为出现，我们将会采取一切我们认为必要的手段，这一点还请各位投票者注意。<br />
            希望大家能够在公平公正的原则下，为您所喜欢的项目投上属于您的一票。
          </p>
          <!-- ... -->
        </article>
      </div>
      <Copyright />
    </div>
  </div>
  <LoginBox v-model:open="loginBoxOpen" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import LoginBox from './components/LoginBox.vue'
import Copyright from '@/common/components/Copyright.vue'
import { screenSizes } from '@/tailwindcss'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { deadlineWithTimezoneOffset } from '@/end-page/lib/voteEnded'

setSiteTitle()

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

useIntervalFn(() => {
  let ddlTime = deadlineWithTimezoneOffset - Date.now()
  if (ddlTime < 0) return
  days.value = Math.floor(ddlTime / 1000 / 60 / 60 / 24)
  hours.value = Math.floor(ddlTime / 1000 / 60 / 60) % 24
  minutes.value = Math.floor(ddlTime / 1000 / 60) % 60
  seconds.value = Math.floor(ddlTime / 1000) % 60
}, 1000)
</script>
