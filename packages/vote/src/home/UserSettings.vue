<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col space-y-2 md:space-y-0 md:z-50">
    <!-- Top Nav -->
    <div
      class="baseBoxRoundedShadow rounded-none w-full h-11 py-1 flex items-center space-x-2"
      :class="{ 'pl-2': voteEnded() }"
    >
      <router-link v-if="!voteEnded()" to="/" class="w-8 h-8 cursor-pointer"
        ><icon-uil-angle-left-b class="w-full h-full"></icon-uil-angle-left-b
      ></router-link>
      <div class="text-xl">用户设定</div>
    </div>
    <!-- Main Content -->
    <div class="md:p-3 md:w-1/3 md:min-w-95 md:m-auto md:flex md:flex-grow">
      <div class="baseBlockMd md:w-full md:p-3 md:shadow md:flex md:flex-grow md:items-center">
        <div class="w-full md:ring-accent-color-600 p-3 divide-y divide-accent-color-300">
          <div class="flex items-center space-x-3">
            <img
              class="h-25 w-25 rounded-full ring-2 ring-accent-color-500 cursor-pointer"
              src="@/home/assets/DefaultAvatar.jpg"
            />
            <div class="space-y-2">
              <div class="truncate text-xl">{{ username }}</div>
              <div class="truncate text-sm">{{ '注册于' + createdAt }}</div>
              <div class="space-x-2">
                <!-- <label class="text-red-600 underline cursor-pointer" @click="">修改头像</label> -->
                <label class="text-accent-color-600 underline cursor-pointer" @click="updateUsernameOpen = true"
                  >修改用户名</label
                >
              </div>
              <div v-if="!voteEnded()" class="text-accent-color-600 text-sm">
                *出于防刷票考虑，投票期间不能修改账户绑定信息哦
              </div>
            </div>
          </div>
          <div class="mt-3 divide-y divide-accent-color-300">
            <div class="p-3 flex items-center justify-between">
              <div>{{ '邮箱：' + (user.email != null ? user.email : '未绑定') }}</div>
              <label
                v-if="voteEnded()"
                class="text-accent-color-600 underline cursor-pointer"
                @click="openChangeEmail()"
                >{{ user.email != null ? '修改' : '去绑定' }}</label
              >
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '手机：' + (user.phone != null ? user.phone : '未绑定') }}</div>
              <label
                v-if="voteEnded()"
                class="text-accent-color-600 underline cursor-pointer"
                @click="openChangePhone()"
                >{{ user.phone != null ? '修改' : '去绑定' }}</label
              >
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '密码：' + (user.password ? '已设置' : '未设置') }}</div>
              <label class="text-accent-color-600 underline cursor-pointer" @click="changePasswordOpen = true">{{
                user.password ? '修改' : '去设置'
              }}</label>
            </div>
            <!-- <div class="p-3 flex items-center justify-between">
              <div>账号绑定:</div>
              <div class="flex">
                <div class="filter grayscale rounded-full shadow p-0.5 mx-2 border-3 border-accent-color-300">
                  <img class="w-6 h-6 cursor-pointer" src="https://thwiki.cc/favicon.ico" title="THBWiki 账户" />
                </div>
                <div class="rounded-full shadow p-0.5 mx-2 border-3 border-accent-color-300">
                  <img
                    class="w-5 h-6 cursor-pointer mx-0.5"
                    src="@/common/assets/logoPatchyVideo.png"
                    title="PatchyVideo 账户"
                  />
                </div>
              </div>
            </div> -->
          </div>
          <button
            class="w-full py-2 flex items-center space-x-1 justify-center"
            :class="{ 'bg-accent-color-300': loading }"
            @click="logout()"
          >
            退出登陆
          </button>
        </div>
      </div>
    </div>
  </div>

  <VoteMessageBox v-model:open="updateUsernameOpen" title="修改用户名">
    <div class="space-y-3 py-5">
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="newUsername"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="请输入新用户名"
          maxlength="30"
          @keydown.enter="updateUsername()"
      /></label>
      <button
        class="w-full py-2 text-sm md:text-base"
        :class="{ 'bg-accent-color-300': loading }"
        @click="updateUsername()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>确定</label>
      </button>
    </div>
  </VoteMessageBox>
  <VoteMessageBox v-model:open="changePasswordOpen" title="修改密码">
    <div class="space-y-3 py-5">
      <label v-if="user.password" class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="passwordOld"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="请输入旧密码"
          type="password"
      /></label>
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="passwordNew"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="请输入新密码"
          maxlength="30"
          type="password"
      /></label>
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="passwordNewConfirm"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="请重复新密码"
          maxlength="30"
          type="password"
          @keydown.enter="updatePassword()"
      /></label>
      <button
        class="w-full py-2 text-sm md:text-base"
        :class="{ 'bg-accent-color-300': loading }"
        @click="updatePassword()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>确定</label>
      </button>
    </div>
  </VoteMessageBox>
  <VoteMessageBox v-model:open="changePhoneOrEmailOpen" :title="'修改绑定的' + changeTypeChinese">
    <div>
      <label class="input-border flex flex-row py-2 px-4">
        <span class="h-6 w-6"><icon-uil-user class="inline-block w-6 h-6 text-gray-700" /></span>
        <input
          v-model="newEmailOrPhone"
          class="ml-2 w-full bg-transparent focus:outline-none"
          :placeholder="changeTypePlaceholder"
          type="text"
          @keypress.enter="
            () => {
              verificationCodeGet()
              codeEl?.focus()
            }
          "
      /></label>
      <div class="text-accent-color-600 text-xs h-5" v-text="userTypeError"></div>
      <div class="flex justify-between">
        <label class="w-1/2 py-2 px-4 inline-block input-border flex flex-row">
          <span class="h-6 w-6"><icon-uil-lock-alt class="inline-block w-6 h-6 text-gray-700" /></span>
          <input
            ref="codeEl"
            v-model="verificationCode"
            class="ml-2 w-full bg-transparent focus:outline-none"
            placeholder="验证码"
            type="text"
            @keypress.enter="updatePhoneOrEmail()"
        /></label>
        <button
          class="py-2 px-5"
          :class="{ 'bg-accent-color-300': !verificationCodeAvailable || loading }"
          @click="verificationCodeGet()"
        >
          {{ '获取' + (verificationCodeAvailable ? '' : '(' + verificationCodeAvailableTime + ')') }}
        </button>
      </div>
      <div class="text-accent-color-600 text-xs h-5" v-text="verificationCodeError"></div>
      <button
        class="w-full py-2 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': loading }"
        @click="updatePhoneOrEmail()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>确定修改</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { createdAt, deleteUserData, sessionToken, user, username } from '@/home/lib/user'
import { gql, useMutation } from '@/graphql'
import type { Mutation } from '@/graphql'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { voteEnded } from '@/end-page/lib/voteEnded'
import { popMessageText } from '@/common/lib/popMessage'

setSiteTitle('用户设置')

const loading = computed<boolean>(
  () =>
    newLoginPhoneLoading.value || updateEmailLoading.value || updatePasswordLoading.value || updateUsernameLoading.value
)

/* Change username*/
const updateUsernameOpen = ref(false)
const newUsername = ref('')
function updateUsername(): void {
  if (updateUsernameLoading.value) return
  if (newUsername.value === '') {
    popMessageText('请输入新用户名！')
    return
  }
  updateUsernameMutate({
    userToken: sessionToken.value,
    newNickname: newUsername.value,
  })
}
const {
  mutate: updateUsernameMutate,
  loading: updateUsernameLoading,
  onDone: updateUsernameDone,
  onError: updateUsernameError,
} = useMutation<Mutation>(
  gql`
    mutation ($userToken: String!, $newNickname: String!) {
      updateNickname(userToken: $userToken, newNickname: $newNickname)
    }
  `
)
updateUsernameDone((result) => {
  popMessageText('修改成功,请重新登录！')
  logout()
})
updateUsernameError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
  updateUsernameOpen.value = false
})

/* Change password */
const changePasswordOpen = ref(false)
const passwordOld = ref('')
const passwordNew = ref('')
const passwordNewConfirm = ref('')
function updatePassword(): void {
  if (updatePasswordLoading.value) return
  if ((user.value.password && !passwordOld.value) || !passwordNew.value || !passwordNewConfirm.value) {
    popMessageText('请填写完整！')
    return
  }
  if (passwordNew.value != passwordNewConfirm.value) {
    popMessageText('输入的两次新密码不一致！')
    return
  }
  user.value.password
    ? updatePasswordMutate({
        userToken: sessionToken.value,
        oldPassword: passwordOld.value,
        newPassword: passwordNew.value,
      })
    : updatePasswordMutate({
        userToken: sessionToken.value,
        newPassword: passwordNew.value,
      })
}
const {
  mutate: updatePasswordMutate,
  loading: updatePasswordLoading,
  onDone: updatePasswordDone,
  onError: updatePasswordError,
} = useMutation<Mutation>(
  gql`
    mutation ($userToken: String!, $oldPassword: String, $newPassword: String!) {
      updatePassword(userToken: $userToken, oldPassword: $oldPassword, newPassword: $newPassword)
    }
  `
)
updatePasswordDone((result) => {
  if (result.data?.updatePassword) popMessageText('修改成功！')
  else popMessageText('旧密码输入错误！')
  changePasswordOpen.value = false
})
updatePasswordError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
  changePasswordOpen.value = false
})

/* Change phone or email */
const changePhoneOrEmailOpen = ref(false)
const changeType = ref<'phone' | 'email'>('phone')
const changeTypeChinese = computed<'手机号' | '邮箱'>(() => (changeType.value === 'phone' ? '手机号' : '邮箱'))
const changeTypePlaceholder = computed(() => (changeType.value === 'phone' ? '新手机号(国内)' : '新邮箱'))
const newEmailOrPhone = ref<string>('')
const newEmailOrPhoneVaild = computed(() => {
  if (changeType.value === 'phone' && phoneFormat.test(newEmailOrPhone.value)) return true
  else if (changeType.value === 'email' && emailFormat.test(newEmailOrPhone.value)) return true
  else return false
})
const userTypeError = ref<
  ' ' | '请输入手机号！' | '请输入邮箱！' | '请输入正确格式的手机号！(不支持海外手机号)' | '请输入正确格式的邮箱!'
>(' ')
const verificationCode = ref<string>('')
const verificationCodeError = ref<
  | ' '
  | '请输入验证码！'
  | '请输入正确的验证码！'
  | '网络错误！请稍后重试'
  | '该手机号已经被使用！'
  | '该邮箱已经被使用！'
>(' ')
const verificationCodeAvailable = ref(true)
const verificationCodeAvailableTime = ref(120)
let verificationCodeAvailableTimer: number
function userEmailOrPhoneVerify(): boolean {
  userTypeError.value = ' '
  verificationCodeError.value = ' '
  if (newEmailOrPhone.value === '') {
    userTypeError.value = changeType.value === 'phone' ? '请输入手机号！' : '请输入邮箱！'
    return false
  } else if (!newEmailOrPhoneVaild.value) {
    userTypeError.value =
      changeType.value === 'phone' ? '请输入正确格式的手机号！(不支持海外手机号)' : '请输入正确格式的邮箱!'
    return false
  }
  return true
}
async function verificationCodeGet(): Promise<void> {
  if (!verificationCodeAvailable.value || loading.value) return
  if (!userEmailOrPhoneVerify()) return
  verificationCodeAvailable.value = false
  verificationCodeAvailableTime.value = 120
  verificationCodeAvailableTimer = setInterval(() => {
    verificationCodeAvailableTime.value--
  }, 1000)
  if (changeType.value === 'phone') getPhoneCode({ phone: newEmailOrPhone.value })
  else if (changeType.value === 'email') getEmailCode({ email: newEmailOrPhone.value })
}
watchEffect(() => {
  if (!verificationCodeAvailableTime.value) {
    clearInterval(verificationCodeAvailableTimer)
    verificationCodeAvailable.value = true
  }
})

const phoneFormat = /^1[3-9]\d{9}$/
function openChangePhone(): void {
  changePhoneOrEmailOpen.value = true
  changeType.value = 'phone'
}
const { mutate: getPhoneCode, onError: getPhoneCodeError } = useMutation<Mutation>(
  gql`
    mutation ($phone: String!) {
      requestPhoneCode(phone: $phone)
    }
  `
)
getPhoneCodeError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT')
    popMessageText('请求过于频繁，请稍后再试！')
  else verificationCodeError.value = '网络错误！请稍后重试'
})
const {
  mutate: updatePhone,
  loading: newLoginPhoneLoading,
  onDone: updatePhoneDone,
  onError: updatePhoneError,
} = useMutation<Mutation>(
  gql`
    mutation ($userToken: String!, $phone: String!, $verifyCode: String!) {
      updatePhone(userToken: $userToken, phone: $phone, verifyCode: $verifyCode)
    }
  `
)
updatePhoneDone((result) => {
  popMessageText('修改成功,请重新登录！')
  logout()
})
updatePhoneError((error) => {
  if (error.graphQLErrors[0].extensions.error_kind === 'INCORRECT_VERIFY_CODE')
    verificationCodeError.value = '请输入正确的验证码！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'PHONE_IN_USE')
    verificationCodeError.value = '该手机号已经被使用！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else verificationCodeError.value = '网络错误！请稍后重试'
  console.log(error.graphQLErrors[0].extensions.error_kind)
})

const emailFormat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
function openChangeEmail(): void {
  changePhoneOrEmailOpen.value = true
  changeType.value = 'email'
}
const { mutate: getEmailCode, onError: getEmailCodeError } = useMutation<Mutation>(
  gql`
    mutation ($email: String!) {
      requestEmailCode(email: $email)
    }
  `
)
getEmailCodeError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT')
    popMessageText('请求过于频繁，请稍后再试！')
  else verificationCodeError.value = '网络错误！请稍后重试'
})
const {
  mutate: updateEmail,
  loading: updateEmailLoading,
  onDone: updateEmailDone,
  onError: updateEmailError,
} = useMutation<Mutation>(
  gql`
    mutation ($userToken: String!, $email: String!, $verifyCode: String!) {
      updateEmail(userToken: $userToken, email: $email, verifyCode: $verifyCode)
    }
  `
)
updateEmailDone((result) => {
  popMessageText('修改成功,请重新登录！')
  logout()
})
updateEmailError((error) => {
  if (error.graphQLErrors[0].extensions.error_kind === 'INCORRECT_VERIFY_CODE')
    verificationCodeError.value = '请输入正确的验证码！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'EMAIL_IN_USE')
    verificationCodeError.value = '该邮箱已经被使用！'
  else if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else verificationCodeError.value = '网络错误！请稍后重试'
  console.log(error.graphQLErrors[0].extensions.error_kind)
})

async function updatePhoneOrEmail(): Promise<void> {
  if (!userEmailOrPhoneVerify() || loading.value) return
  if (verificationCode.value === '') {
    verificationCodeError.value = '请输入验证码！'
    return
  }
  if (changeType.value === 'phone') {
    updatePhone({ userToken: sessionToken.value, phone: newEmailOrPhone.value, verifyCode: verificationCode.value })
  } else if (changeType.value === 'email') {
    updateEmail({ userToken: sessionToken.value, email: newEmailOrPhone.value, verifyCode: verificationCode.value })
  } else return
}

const codeEl = shallowRef<HTMLInputElement | null>()

function logout(): void {
  deleteUserData()
  location.reload()
}
</script>
