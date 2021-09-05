<template><Component :is="isLogin ? UserHome2 : Home" /></template>

<script lang="ts" setup>
import { ref } from 'vue'
import Home from './Home.vue'
import UserHome2 from './UserHome2.vue'

const isLogin = ref(false)
</script>
