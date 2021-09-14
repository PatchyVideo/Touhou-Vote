<template>
  <div class="w-full">
    <VoteMessageBox v-model:open="open">MessageBox!</VoteMessageBox>
    <button class="w-full my-10 border shadow bg-accent-color-600 text-white" @click="open = true">Click!</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

const open = ref(false)
</script>
<style lang="postcss" scoped></style>
