<template>
  <div class="z-51 p-2 space-x-2 shadow flex items-center fixed inset-x-0 border-b border-accent-200 bg-white">
    <div class="w-6 h-6" :class="drawerOpen ? 'i-uil:times' : 'i-uil:list-ul'" @click="drawerOpen = !drawerOpen" />
    <div class="font-medium">投票结果 - 第⑩回 国内东方人气投票</div>
  </div>
  <!-- Padding -->
  <div class="h-10" />

  <!-- Drawer -->
  <div
    class="w-1/2 max-w-50 z-52 shadow fixed flex top-10 bottom-0 transform transition-transform ease-in-out"
    :class="{ '-translate-x-full': !drawerOpen }"
  >
    <div class="w-full flex flex-col gap-3 p-3 rounded-r overflow-y-auto border border-accent-200 bg-white">
      <div v-for="item in links" :key="item.name">
        <div class="flex items-center space-x-2">
          <div :class="item.icon" />
          <div class="font-medium">{{ item.name }}</div>
        </div>
        <router-link
          :to="item2.to"
          class="block indent-7 mt-1 text-gray-600 transition transition-transform md:hover:-translate-1 active:translate-1"
          v-for="item2 in item.links"
          :key="item2.name"
        >
          {{ item2.name }}
        </router-link>
      </div>
    </div>
  </div>
  <Transition name="mask">
    <div v-if="drawerOpen" class="fixed inset-0 z-50" @click="drawerOpen = false"></div>
  </Transition>
</template>

<script lang="ts" setup>
const drawerOpen = ref(false)

const links = [
  {
    name: '首页',
    icon: 'i-uil:estate',
    links: [
      {
        name: '导航页',
        to: '/nav',
      },
      {
        name: '结果首页',
        to: '/',
      },
    ],
  },
  {
    name: '本届结果',
    icon: 'i-uil:chart-pie',
    links: [
      {
        name: '角色部门',
        to: '/character',
      },
      {
        name: '音乐部门',
        to: '/',
      },
      {
        name: 'CP部门',
        to: '/',
      },
      {
        name: '提名部门',
        to: '/',
      },
      {
        name: '调查问卷',
        to: '/',
      },
    ],
  },
  {
    name: '往届结果',
    icon: 'i-uil:clock',
    links: [
      {
        name: '第一回',
        to: '/character',
      },
      {
        name: '第二回',
        to: '/',
      },
      {
        name: '第三回',
        to: '/',
      },
      {
        name: '第四回',
        to: '/',
      },
      {
        name: '第五回',
        to: '/',
      },
      {
        name: '第六回',
        to: '/',
      },
      {
        name: '第七回',
        to: '/',
      },
      {
        name: '第八回',
        to: '/',
      },
      {
        name: '第九回',
        to: '/',
      },
    ],
  },
]
</script>
<style lang="postcss" scoped></style>
