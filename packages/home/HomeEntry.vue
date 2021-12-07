<template><Component :is="isLogin ? UserHome : Home" /></template>

<script lang="ts" setup>
import { isLogin } from '@/home/lib/user'
import Home from './Home.vue'
import UserHome from './UserHome.vue'
</script>
