<!--
  投票提交成功后的引导弹层。
  提交完成是用户最想给人看自己选择的时刻，原本这里只有一个一闪而过的 toast，
  所以把导出分享图的入口放在这。插槽里传对应部门的导出组件。
-->
<template>
  <VoteMessageBox v-model:open="open" :title="`${department}投票成功！`">
    <div class="p-2 pb-4 flex flex-col items-center text-center space-y-3">
      <p>你的{{ department }}投票已经提交。</p>
      <p class="text-sm text-gray-500">趁热做一张分享图？</p>
      <div class="flex flex-col items-center gap-2 w-full">
        <slot />
        <button class="px-4 py-1 text-sm" @click="goHome">回首页</button>
      </div>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useVModel } from '@vueuse/core'
import VoteMessageBox from './VoteMessageBox.vue'

const props = withDefaults(defineProps<{ open?: boolean; department: string }>(), { open: false })
const emit = defineEmits<{ (event: 'update:open', value: boolean): void }>()

const open = useVModel(props, 'open', emit)
const router = useRouter()

/** 和原来提交成功后的跳转保持一致：回首页并展开「参与投票」。 */
function goHome(): void {
  open.value = false
  router.push({ path: '/', query: { tab: 1, openList: 'vote', open: 1 } })
}
</script>
