<template>
  <VoteMessageBox
    v-for="(msg, index) in messages"
    :key="index + msg.text"
    :open="msg.open.value"
    confirm
    @update:open="(value) => (msg.open.value = value)"
    >{{ msg.text }}</VoteMessageBox
  >
</template>

<script lang="ts" setup>
import VoteMessageBox from './VoteMessageBox.vue'
import { messages } from '../lib/popMessage'
</script>
