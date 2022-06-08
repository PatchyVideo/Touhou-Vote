<template>
  <div class="page"></div>
  <div class="w-full backdrop-filter backdrop-blur-1 min-h-100vh flex flex-col content-between">
    <NavTop />
    <div class="grow" :class="{ 'grid grid-cols-1 content-center': props.contentCenter }"><slot /></div>
    <div class="w-full text-center">
      <div>
        <a rel="noopener noreferrer" href="/nav">历届人气投票结果</a>&ensp;
        <a target="_blank" rel="noopener noreferrer" href="https://jq.qq.com/?k=0BnkgDKx">反馈问题</a>
      </div>
      <div class="quicksand">&copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavTop from '@/components/NavTop.vue'

const props = defineProps({
  contentCenter: {
    type: Boolean,
    default: false,
  },
})
</script>
