<template><Component :is="isLogin ? UserHome : Home" /></template>

<script lang="ts" setup>
import { ref } from 'vue'
import Home from './Home.vue'
import UserHome from './UserHome.vue'

const isLogin = ref(true)
</script>
