<template>
  <span class="inline-flex items-center gap-1 flex-shrink-0">
    <button
      style="-webkit-tap-highlight-color: transparent"
      class="inline-flex items-center justify-center gap-1 rounded-xl h-[26px] px-2 text-xs leading-4 whitespace-nowrap text-white disabled:cursor-not-allowed"
      :class="[colors[department], { 'opacity-30': !allowed || !departmentVoteComplete || state.status === 'empty' }]"
      :title="access.message || (!departmentVoteComplete ? incompleteMessage : state.error)"
      :disabled="
        access.status !== 'login' &&
        (!allowed || (departmentVoteComplete && state.status !== 'ready' && state.status !== 'empty'))
      "
      @click.stop="open"
    >
      <icon-uil-image-download class="block flex-shrink-0" />
      <span class="text-white">{{
        access.status === 'login'
          ? '导出为图片'
          : access.status === 'ended'
          ? '投票已结束'
          : access.status === 'early'
          ? '尚未开始'
          : access.status === 'checking'
          ? '加载中'
          : access.status === 'error'
          ? '读取失败'
          : !departmentVoteComplete
          ? '导出为图片'
          : state.status === 'loading'
          ? '加载中'
          : state.status === 'error'
          ? '读取失败'
          : '导出为图片'
      }}</span>
    </button>
    <button
      v-if="access.status === 'error' || (departmentVoteComplete && state.status === 'error')"
      class="text-xs underline bg-transparent hover:bg-transparent"
      @click.stop="retry"
    >
      重试
    </button>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { popMessageText } from '@/common/lib/popMessage'
import { voteCharacterComplete, voteCoupleComplete, voteMusicComplete } from '@/home/lib/user'
import { cardAccess, checkCardTime } from '../lib/voteCardAccess'
import { cardDepartments, refreshCardSession } from '../lib/voteCardSession'
import type { Department } from '../lib/types'
const props = defineProps<{ department: Department }>()
const router = useRouter()
const access = cardAccess
const allowed = computed(() => access.value.status === 'allowed')
const departmentVoteComplete = computed(() => {
  const completion = { role: voteCharacterComplete, music: voteMusicComplete, cp: voteCoupleComplete }
  return completion[props.department].value
})
const incompleteMessage = '请先完成投票哦'
const state = computed(() => cardDepartments[props.department])
const colors = { role: 'bg-purple-600', music: 'bg-blue-600', cp: 'bg-pink-600' }
const emptyMessages = { role: '请先选择角色哦', music: '请先选择音乐哦', cp: '请先选择CP哦' }
function open() {
  if (!checkCardTime()) {
    if (access.value.status === 'login') popMessageText('请重新登录')
    return
  }
  if (!departmentVoteComplete.value) {
    popMessageText(incompleteMessage)
    return
  }
  if (state.value.status === 'empty') {
    popMessageText(emptyMessages[props.department])
    return
  }
  if (state.value.status === 'ready') void router.push({ path: '/vote-card', query: { department: props.department } })
}
function retry() {
  void refreshCardSession(true)
}
</script>
