<template>
  <VoteMessageBox
    v-for="(msg, index) in messages"
    :key="index + msg.text"
    title="提示"
    :open="true"
    close-button
    @update:open="() => closeMsg(msg)"
    ><div class="p-2" v-text="msg.text"></div
  ></VoteMessageBox>
  <VoteMessageBox
    v-for="(msg, index) in confirmMessages"
    :key="index + msg.text"
    title="提示"
    :open="true"
    @update:open="() => closeConfirm(msg)"
  >
    <div class="p-2" v-text="msg.text"></div>
    <div class="flex justify-center gap-2">
      <button
        class="px-4 py-1"
        @click="
          () => {
            closeConfirm(msg)
            msg.onCancel?.()
          }
        "
        v-text="msg.cancelText || '取消'"
      ></button>
      <button
        class="px-4 py-1"
        @click="
          () => {
            closeConfirm(msg)
            msg.onConfirm?.()
          }
        "
        v-text="msg.confirmText || '确定'"
      ></button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import type { ConfirmMessageInfo, MessageInfo } from '../lib/popMessage'
import { confirmMessages, messages } from '../lib/popMessage'
import VoteMessageBox from './VoteMessageBox.vue'

const closeMsg = (msg: MessageInfo) => {
  messages.value = messages.value.filter((v) => v !== msg)
}

const closeConfirm = (msg: ConfirmMessageInfo) => {
  confirmMessages.value = confirmMessages.value.filter((v) => v !== msg)
}
</script>
