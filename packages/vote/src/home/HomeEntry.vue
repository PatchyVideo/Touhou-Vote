<template>
  <Component
    :is="
      voteNotStart()
        ? StartPage
        : voteEnded()
        ? resultPage
          ? Result
          : isLogin
          ? UserSettings
          : EndPage
        : isLogin
        ? UserHome
        : Home
    "
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isLogin } from '@/home/lib/user'
import { voteNotStart } from '@/start-page/lib/voteStart'
import { voteEnded } from '@/end-page/lib/voteEnded'
import Home from './Home.vue'
import UserHome from './UserHome.vue'
import UserSettings from './UserSettings.vue'
import StartPage from '@/start-page/StartPage.vue'
import EndPage from '@/end-page/EndPage.vue'
import Result from '@/result/Result.vue'

const route = useRoute()

const resultPage = computed<boolean>(() => {
  return route.query.result
    ? Array.isArray(route.query.result)
      ? Boolean(route.query.result[0])
      : Boolean(route.query.result)
    : false
})
</script>
