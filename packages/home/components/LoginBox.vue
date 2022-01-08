<template>
  <transition name="loginBox">
    <div
      v-if="open"
      class="fixed max-h-full top-1/2 mx-auto left-0 right-0 -mt-40 p-4 w-19/20 rounded-xl bg-white md:w-100 z-51"
    >
      <div class="w-full overflow-hidden">
        <div
          class="w-2/1 flex transform-gpu transition-transform duration-300 space-x-1"
          :class="{ '-translate-x-1/2': useOldSystemLogin }"
        >
          <!-- Normal Login -->
          <div class="w-1/2 space-y-2">
            <div class="flex justify-between items-center">
              <div class="text-lg">请先登陆</div>
              <icon-uil-times class="w-8 h-8 cursor-pointer" @click="loading || close()"></icon-uil-times>
            </div>
            <div>
              <label class="input-border flex flex-row py-2 px-4">
                <span class="h-6 w-6"><icon-uil-user class="inline-block w-6 h-6 text-gray-700" /></span>
                <input
                  v-model="userEmailOrPhoneNum"
                  class="ml-2 w-full bg-transparent focus:outline-none"
                  placeholder="手机号(国内)或邮箱"
                  type="text"
              /></label>
              <div class="text-accent-color-600 text-xs h-5" v-text="userTypeError"></div>
              <div class="flex justify-between">
                <label class="w-1/2 py-2 px-4 inline-block input-border flex flex-row">
                  <span class="h-6 w-6"><icon-uil-lock-alt class="inline-block w-6 h-6 text-gray-700" /></span>
                  <input
                    v-model="verificationCode"
                    class="ml-2 w-full bg-transparent focus:outline-none"
                    placeholder="验证码"
                    type="text"
                /></label>
                <button
                  class="py-2 px-5 rounded-xl text-white bg-accent-color-600"
                  :class="{ 'bg-accent-color-300': !verificationCodeAvailable || loading }"
                  @click="verificationCodeGet()"
                >
                  {{ '获取' + (verificationCodeAvailable ? '' : '(' + verificationCodeAvailableTime + ')') }}
                </button>
              </div>
              <div class="text-accent-color-600 text-xs h-5" v-text="verificationCodeError"></div>
              <button
                class="w-full py-2 rounded-xl text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
                :class="{ 'bg-accent-color-300': loading }"
                @click="login()"
              >
                <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>开始投票</label>
              </button>
            </div>
            <div class="h-1 w-full"></div>
            <!-- The third party login -->
            <!-- <div class="flex justify-between items-center space-y-1 border-t-2 p-2">
              <div class="text-gray-600 text-sm">其他方式登陆:</div>
              <div class="flex flex-row-reverse">
                <div class="rounded-full shadow p-0.5 mx-2 border-3 border-accent-color-300">
                  <img
                    class="w-5 h-6 cursor-pointer mx-0.5"
                    src="@/common/assets/logoPatchyVideo.png"
                    title="通过 PatchyVideo 登录"
                  />
                </div>
                <div class="rounded-full shadow p-0.5 mx-2 border-3 border-accent-color-300">
                  <img class="w-6 h-6 cursor-pointer" src="https://thwiki.cc/favicon.ico" title="通过 THBWiki 登录" />
                </div>
                <div
                  class="rounded-full shadow p-0.5 mx-2 border-3 border-accent-color-300"
                  @click="loading || (useOldSystemLogin = true)"
                >
                  <img
                    class="w-6 h-6 cursor-pointer"
                    src="@/common/assets/logoOldSystem.ico"
                    title="使用旧版账号密码登陆"
                  />
                </div>
              </div>
            </div> -->
            <div
              class="text-gray-600 text-sm text-right cursor-pointer transition transition-colors hover:text-accent-color-600"
              @click="loading || (useOldSystemLogin = true)"
            >
              使用旧版账号密码登陆
            </div>
          </div>
          <!-- Old System Login -->
          <div class="w-1/2 pr-1/100">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <icon-uil-angle-left-b class="w-8 h-8" @click="loading || (useOldSystemLogin = false)" />
                <div class="text-lg">使用账号密码登陆</div>
              </div>
            </div>
            <div class="mt-10">
              <label class="input-border flex flex-row py-2 px-4">
                <span class="h-6 w-6"><icon-uil-user class="inline-block w-6 h-6 text-gray-700" /></span>
                <input
                  v-model="userName"
                  class="ml-2 w-full bg-transparent focus:outline-none"
                  placeholder="邮箱"
                  type="text"
              /></label>
              <div class="text-accent-color-600 text-xs h-5" v-text="userNameError"></div>
              <label class="input-border flex flex-row py-2 px-4">
                <span class="h-6 w-6"><icon-uil-lock-alt class="inline-block w-6 h-6 text-gray-700" /></span>
                <input
                  v-model="userPassword"
                  class="ml-2 w-full bg-transparent focus:outline-none"
                  placeholder="密码"
                  type="password"
              /></label>
              <div class="text-accent-color-600 text-xs h-5" v-text="userPasswordError"></div>
              <button
                class="w-full py-2 rounded-xl text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
                :class="{ 'bg-accent-color-300': loading }"
                @click="oldSystemlogin()"
              >
                <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>登陆</label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent></div>
  </Transition>
</template>
<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import { useMutation, gql } from '@/graphql'
import type { Mutation } from '@/graphql'
import { setUserDataToLocalStorage } from '@/home/lib/user'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()
const open = useVModel(props, 'open', emit)

watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function close(): void {
  open.value = false
}

const loading = computed<boolean>(
  () => newLoginPhoneNumLoading.value || newLoginEmailLoading.value || oldLoginLoading.value
)

/* Verification Code Login */
const emailFormat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const phoneFormat = /^1[3-9]\d{9}$/
const userEmailOrPhoneNum = ref<string>('')
const userTypeError = ref<' ' | '请输入邮箱或手机号！' | '请输入正确格式的邮箱或手机号！(不支持海外手机号)'>(' ')
const userType = computed<'phone' | 'email' | 'invalid'>(() => {
  if (emailFormat.test(userEmailOrPhoneNum.value)) return 'email'
  else if (phoneFormat.test(userEmailOrPhoneNum.value)) return 'phone'
  else return 'invalid'
})
function userEmailOrPhoneNumVerify(): boolean {
  userTypeError.value = ' '
  verificationCodeError.value = ' '
  if (userEmailOrPhoneNum.value === '') {
    userTypeError.value = '请输入邮箱或手机号！'
    return false
  } else if (userType.value === 'invalid') {
    userTypeError.value = '请输入正确格式的邮箱或手机号！(不支持海外手机号)'
    return false
  }
  return true
}
const verificationCode = ref<string>('')
const verificationCodeError = ref<' ' | '请输入验证码！' | '请输入正确的验证码！' | '网络错误！请稍后重试'>(' ')
const verificationCodeAvailable = ref(true)
const verificationCodeAvailableTime = ref(120)
let verificationCodeAvailableTimer: number
async function verificationCodeGet(): Promise<void> {
  if (!verificationCodeAvailable.value || loading.value) return
  if (!userEmailOrPhoneNumVerify()) return
  verificationCodeAvailable.value = false
  verificationCodeAvailableTime.value = 120
  verificationCodeAvailableTimer = setInterval(() => {
    verificationCodeAvailableTime.value--
  }, 1000)
  if (userType.value === 'phone') getPhoneCode({ phone: userEmailOrPhoneNum.value })
  else if (userType.value === 'email') getEmailCode({ email: userEmailOrPhoneNum.value })
}
watchEffect(() => {
  if (!verificationCodeAvailableTime.value) {
    clearInterval(verificationCodeAvailableTimer)
    verificationCodeAvailable.value = true
  }
})
const { mutate: getPhoneCode } = useMutation<Mutation>(
  gql`
    mutation ($phone: String!) {
      requestPhoneCode(phone: $phone)
    }
  `
)
const { mutate: getEmailCode } = useMutation<Mutation>(
  gql`
    mutation ($email: String!) {
      requestEmailCode(email: $email)
    }
  `
)
async function login(): Promise<void> {
  if (!userEmailOrPhoneNumVerify() || loading.value) return
  if (verificationCode.value === '') {
    verificationCodeError.value = '请输入验证码！'
    return
  }
  if (userType.value === 'phone') {
    newLoginPhoneNum({ phone: userEmailOrPhoneNum.value, verifyCode: verificationCode.value })
  } else if (userType.value === 'email') {
    newLoginEmailNum({ email: userEmailOrPhoneNum.value, verifyCode: verificationCode.value })
  } else return
}
const {
  mutate: newLoginPhoneNum,
  loading: newLoginPhoneNumLoading,
  onDone: newLoginPhoneNumDone,
  onError: newLoginPhoneNumError,
} = useMutation<Mutation>(
  gql`
    mutation ($phone: String!, $nickname: String, $verifyCode: String!) {
      loginPhone(phone: $phone, nickname: $nickname, verifyCode: $verifyCode) {
        user {
          username
          pfp
          password
          phone
          email
          thbwiki
          patchyvideo
        }
        sessionToken
        voteToken
      }
    }
  `
)
newLoginPhoneNumDone((result) => {
  if (result.data?.loginPhone.user && result.data?.loginPhone.voteToken && result.data?.loginPhone.sessionToken) {
    setUserDataToLocalStorage(
      result.data?.loginPhone.user,
      result.data?.loginPhone.voteToken,
      result.data?.loginPhone.sessionToken
    )
  }
  location.reload()
})
newLoginPhoneNumError((error) => {
  if (error.graphQLErrors[0].extensions.error_kind === 'INCORRECT_VERIFY_CODE')
    verificationCodeError.value = '请输入正确的验证码！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else verificationCodeError.value = '网络错误！请稍后重试'
  console.log(error)
})
const {
  mutate: newLoginEmailNum,
  loading: newLoginEmailLoading,
  onDone: newLoginEmailDone,
  onError: newLoginEmailError,
} = useMutation<Mutation>(
  gql`
    mutation ($email: String!, $nickname: String, $verifyCode: String!) {
      loginEmail(email: $email, nickname: $nickname, verifyCode: $verifyCode) {
        user {
          username
          pfp
          password
          phone
          email
          thbwiki
          patchyvideo
        }
        sessionToken
        voteToken
      }
    }
  `
)
newLoginEmailDone((result) => {
  if (result.data?.loginEmail.user && result.data?.loginEmail.voteToken && result.data?.loginEmail.sessionToken) {
    setUserDataToLocalStorage(
      result.data?.loginEmail.user,
      result.data?.loginEmail.voteToken,
      result.data?.loginEmail.sessionToken
    )
  }
  location.reload()
})
newLoginEmailError((error) => {
  if (error.graphQLErrors[0].extensions.error_kind === 'INCORRECT_VERIFY_CODE')
    verificationCodeError.value = '请输入正确的验证码！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else verificationCodeError.value = '网络错误！请稍后重试'
  console.log(error)
})

/* Old System Login */
const useOldSystemLogin = ref(false)
const userName = ref<string>('')
const userNameError = ref<' ' | '请输入用户名！' | '用户名或密码错误！'>(' ')
const userPassword = ref<string>('')
const userPasswordError = ref<' ' | '请输入密码！' | '网络错误！请稍后重试'>(' ')
async function oldSystemlogin(): Promise<void> {
  oldLogin({ email: userName.value, password: userPassword.value })
}
const {
  mutate: oldLogin,
  loading: oldLoginLoading,
  onDone: oldLoginDone,
  onError: oldLoginError,
} = useMutation<Mutation>(
  gql`
    mutation ($email: String!, $password: String!) {
      loginEmailPassword(email: $email, password: $password) {
        user {
          username
          pfp
          password
          phone
          email
          thbwiki
          patchyvideo
        }
        sessionToken
        voteToken
      }
    }
  `
)
oldLoginDone((result) => {
  if (
    result.data?.loginEmailPassword.user &&
    result.data?.loginEmailPassword.voteToken &&
    result.data?.loginEmailPassword.sessionToken
  ) {
    setUserDataToLocalStorage(
      result.data?.loginEmailPassword.user,
      result.data?.loginEmailPassword.voteToken,
      result.data?.loginEmailPassword.sessionToken
    )
  }
  location.reload()
})
oldLoginError((error) => {
  if (error.graphQLErrors[0].extensions.error_kind === 'NOT_FOUND') userNameError.value = '用户名或密码错误！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else userPasswordError.value = '网络错误！请稍后重试'
  console.log(error.graphQLErrors)
})
</script>
<style lang="postcss" scoped>
.loginBox-enter-active,
.loginBox-leave-active {
  @apply transition-all duration-200;
}

.loginBox-enter-from,
.loginBox-leave-to {
  @apply opacity-0;
}
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
