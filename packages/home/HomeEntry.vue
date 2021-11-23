<template><Component :is="isLogin ? UserHome2 : Home" /></template>

<script lang="ts" setup>
import { isLogin } from '@/home/lib/user'
import Home from './Home.vue'
import UserHome2 from './UserHome2.vue'
</script>
