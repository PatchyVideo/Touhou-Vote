<template>
  <div v-if="props.show" class="w-8 h-8 pr-2 md:w-0 md:pr-0">
    <icon-uil-angle-left-b
      v-if="screenSizes['<md']"
      class="w-full h-full cursor-pointer"
      @click="backToHome()"
    ></icon-uil-angle-left-b>
    <button
      v-else
      class="fixed flex items-center bottom-5 right-5 px-3 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
      @click="backToHome()"
    >
      <icon-uil-angle-right-b class="fill-current" />
      返回主页
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { popConfirmText } from '../lib/popMessage'
import { screenSizes } from '@/tailwindcss'

const router = useRouter()

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  saveable: {
    type: Boolean,
    default: true,
  },
})

async function backToHome() {
  if (
    await popConfirmText(
      props.saveable
        ? '你确定要回到主页吗？（未提交的内容会暂存本地哦）'
        : '你确定要回到主页吗？（会失去未提交的内容哦！）'
    )
  ) {
    router.push('/')
  }
}
</script>
