<template>
  <footer class="mt-auto pt-8 border-t-2 border-gray-100 flex flex-col items-center text-gray-600 gap-3">
    <p>投票链接：https://touhou.vote</p>
    <template v-if="showQr"
      ><img :src="qr" width="140" height="140" alt="投票二维码" />
      <p>浏览器扫一扫参加投票</p></template
    >
  </footer>
</template>
<script setup lang="ts">
import qr from '../assets/vote-qr.svg'
defineProps<{ showQr?: boolean }>()
</script>
<style scoped>
footer p {
  color: #4b5563;
}
</style>
