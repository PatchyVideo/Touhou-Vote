<template>
  <div v-if="props.show" class="w-8 h-8 pr-2">
    <icon-uil-angle-left-b class="w-full h-full cursor-pointer" @click="backToHome()"></icon-uil-angle-left-b>
    <button
      v-if="screenSizes['md']"
      class="fixed flex items-center bottom-5 right-5 px-3 py-1 text-lg"
      @click="backToHome()"
    >
      <icon-uil-angle-right-b class="fill-current mr-1" />
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
        ? '您想要回到主页吗？（放心，未提交的内容会暂存本地哦）'
        : '您想要回到主页吗？（请注意，会失去未提交的内容！）'
    )
  ) {
    router.push('/')
  }
}
</script>
