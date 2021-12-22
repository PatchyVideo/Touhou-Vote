<template>
  <div class="w-full min-h-100vh page flex flex-col space-y-2 md:space-y-0 md:z-50">
    <!-- Top Nav -->
    <div class="w-full h-11 py-1 pr-3 bg-white bg-opacity-80 shadow flex items-center space-x-2">
      <router-link to="/" class="text-black w-8 h-8 cursor-pointer"
        ><icon-uil-angle-left-b class="w-full h-full"></icon-uil-angle-left-b
      ></router-link>
      <div class="text-gray-600 text-xl">用户设定</div>
    </div>
    <!-- Main Content -->
    <div class="md:p-3 md:w-1/3 md:min-w-95 md:m-auto md:flex md:flex-grow">
      <div
        class="
          md:w-full
          md:rounded-xl
          md:p-3
          md:bg-white
          md:bg-opacity-50
          md:backdrop-filter
          md:backdrop-blur-2
          md:shadow
          md:flex
          md:flex-grow
          md:items-center
        "
      >
        <div class="w-full md:ring-accent-color-600 p-3 divide-y divide-accent-color-300">
          <div class="flex items-center space-x-3">
            <img
              class="h-25 w-25 rounded-full ring-2 ring-accent-color-500 cursor-pointer"
              src="@/home/assets/DefaultAvatar.jpg"
            />
            <div class="space-y-2">
              <div class="truncate text-xl">{{ username }}</div>
              <!-- <div class="truncate text-sm text-gray-600">注册于2021年⑨月1日</div> -->
              <!-- <div class="space-x-2">
                <label class="text-red-600 underline cursor-pointer" @click="WIP()">修改头像</label>
                <label class="text-red-600 underline cursor-pointer" @click="WIP()">修改用户名</label>
              </div> -->
              <div class="text-accent-color-600 text-sm">*出于防刷票考虑，投票期间不能修改账户绑定信息哦</div>
            </div>
          </div>
          <div class="mt-3 divide-y divide-accent-color-300">
            <div class="p-3 flex items-center justify-between">
              <div>{{ '邮箱：' + (user.email != null ? user.email : '未绑定') }}</div>
              <!-- <label class="text-red-600 underline cursor-pointer" @click="WIP()">{{
                user.email != null ? '修改' : '去绑定'
              }}</label> -->
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '手机：' + (user.phone != null ? user.phone : '未绑定') }}</div>
              <!-- <label class="text-red-600 underline cursor-pointer" @click="WIP()">{{
                user.phone != null ? '修改' : '去绑定'
              }}</label> -->
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '密码：' + (user.password ? '已设置' : '未设置') }}</div>
              <label class="text-red-600 underline cursor-pointer" @click="changePasswordOpen = true">{{
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
        </div>
      </div>
    </div>
  </div>
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
          type="password"
      /></label>
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="passwordNewConfirm"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="请重复新密码"
          type="password"
          @keydown.enter="updatePassword()"
      /></label>
      <button
        class="w-full py-2 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
        :class="{ 'bg-accent-color-300': updatePasswordLoading }"
        @click="updatePassword()"
      >
        <icon-uil-spinner-alt v-if="updatePasswordLoading" class="animate-spin" /><label>确定</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { user, username, sessionToken } from '@/home/lib/user'
import { useMutation, gql } from '@/graphql'
import type { Mutation } from '@/graphql'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle('用户设置 - 第⑩回 中文东方人气投票')

// function WIP(): void {
//   alert('投票期间不能修改个人信息哦，才不是因为没还做完呢(o˘д˘)o')
// }

const changePasswordOpen = ref(false)
const passwordOld = ref('')
const passwordNew = ref('')
const passwordNewConfirm = ref('')
function updatePassword(): void {
  if (updatePasswordLoading.value) return
  if ((user.value.password && !passwordOld.value) || !passwordNew.value || !passwordNewConfirm.value) {
    alert('请填写完整！')
    return
  }
  if (passwordNew.value != passwordNewConfirm.value) {
    alert('输入的两次新密码不一致！')
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
  if (result.data?.updatePassword) alert('修改成功！')
  else alert('旧密码输入错误！')
  changePasswordOpen.value = false
})
updatePasswordError((error) => {
  console.log(error)
  alert('修改失败，旧密码输入错误或网络错误！')
  changePasswordOpen.value = false
})
</script>


