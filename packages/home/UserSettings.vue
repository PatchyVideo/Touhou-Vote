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
              <div class="truncate text-xl">{{ user.username }}</div>
              <!-- <div class="truncate text-sm text-gray-600">注册于2021年⑨月1日</div> -->
              <div class="space-x-2">
                <label class="text-red-600 underline cursor-pointer">修改头像</label>
                <label class="text-red-600 underline cursor-pointer">修改用户名</label>
              </div>
            </div>
          </div>
          <div class="mt-3 divide-y divide-accent-color-300">
            <div class="p-3 flex items-center justify-between">
              <div>{{ '邮箱：' + user.email === '' ? user.email : '未绑定' }}</div>
              <label class="text-red-300 underline cursor-pointer">{{ user.email === '' ? '修改' : '去绑定' }}</label>
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '手机：' + user.phone === '' ? user.phone : '未绑定' }}</div>
              <label class="text-red-600 underline cursor-pointer">{{ user.phone === '' ? '修改' : '去绑定' }}</label>
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>{{ '密码：' + user.password ? '已设置' : '未设置' }}</div>
              <label class="text-red-600 underline cursor-pointer">修改</label>
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
</template>

<script lang="ts" setup>
import { user, createDefaultVoter } from '@/home/lib/user'
import { computed } from 'vue'

const username = computed(() => {
  const defaultUser = createDefaultVoter()
  if (user.value.username != defaultUser.username) return user.value.username
  else if (user.value.phone != defaultUser.phone) return user.value.phone
  else if (user.value.email != defaultUser.email) return user.value.email
  else return defaultUser.username
})
</script>

<style lang="postcss" scoped></style>
