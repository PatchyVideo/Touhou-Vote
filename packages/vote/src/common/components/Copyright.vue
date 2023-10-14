<template>
  <div
    :class="{ 'fixed bottom-0 left-0': props.copyrightType === 'fixed', 'absolute w-100vw left-0 bottom-1': props.copyrightType === 'absolute' }"
    class="w-full text-center my-6">
    &copy; Copyright 2022 - 2023 THBWiki, VoileLabs, All rights reserved. Licensed under GPL-3.0.&ensp;
    <div>
      <a target="_blank" rel="noopener noreferrer" href="https://jq.qq.com/?k=0BnkgDKx">反馈问题</a>&ensp;
      <a target="_blank" rel="noopener noreferrer" href="/nav">往届结果</a>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  copyrightType: {
    type: String,
    validator: (value: string) => ['static', 'fixed', 'absolute'].includes(value),
    default: 'static'
  },
})
</script>
