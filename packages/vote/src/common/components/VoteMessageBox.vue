<template>
  <transition name="messageBox">
    <div
      v-if="open"
      class="baseBlock fixed max-h-2/3 top-1/2 mx-auto left-0 right-0 -mt-70 p-2 w-19/20 max-w-70ch z-51 flex flex-col"
    >
      <div class="flex justify-between items-center">
        <div class="text-lg truncate">{{ props.title }}</div>
        <icon-uil-times class="w-8 h-8 cursor-pointer" @click="close()"></icon-uil-times>
      </div>
      <slot></slot>
      <div class="flex justify-center" @click="() => (open = false)">
        <button v-if="closeButton" class="px-4 py-1" @click="close">确定</button>
      </div>
    </div>
  </transition>
  <Mask v-model:open="open" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import Mask from '@/common/components/Mask.vue'

const props = withDefaults(
  defineProps<{
    open?: boolean
    title?: string
    closeButton?: boolean
  }>(),
  {
    open: false,
    title: '',
    closeButton: false,
  }
)

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const open = useVModel(props, 'open', emit)
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function close(): void {
  open.value = false
}
onBeforeUnmount(() => {
  document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
})
</script>
<style lang="postcss" scoped>
.messageBox-enter-active,
.messageBox-leave-active {
  @apply transition-all duration-200;
}

.messageBox-enter-from,
.messageBox-leave-to {
  @apply opacity-0;
}
</style>
