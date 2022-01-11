<template><Component :is="voteEnded() ? EndPage : isLogin ? UserHome : Home" /></template>

<script lang="ts" setup>
import { isLogin } from '@/home/lib/user'
import { voteEnded } from '@/end-page/lib/voteEnded'
import Home from './Home.vue'
import UserHome from './UserHome.vue'
import EndPage from '@/end-page/EndPage.vue'
</script>
