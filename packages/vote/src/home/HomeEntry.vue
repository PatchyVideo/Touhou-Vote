<template>
  <Component
    :is="voteNotStart() ? StartPage : voteEnded() ? (isLogin ? UserSettings : EndPage) : isLogin ? UserHome : Home"
  />
</template>

<script lang="ts" setup>
import Home from './Home.vue'
import UserHome from './UserHome.vue'
import UserSettings from './UserSettings.vue'
import { isLogin } from '@/home/lib/user'
import { voteNotStart } from '@/start-page/lib/voteStart'
import { voteEnded } from '@/end-page/lib/voteEnded'
import StartPage from '@/start-page/StartPage.vue'
import EndPage from '@/end-page/EndPage.vue'
</script>
