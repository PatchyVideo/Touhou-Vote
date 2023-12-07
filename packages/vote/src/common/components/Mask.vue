<template>
  <Transition name="mask">
    <div
      v-if="open"
      class="fixed inset-0 backdrop-filter backdrop-blur-sm"
      :style="'z-index:' + props.zIndex"
      @click="closeMask()"
      @touchmove.stop.prevent
    />
  </Transition>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
  clickToClose: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 50,
  },
})

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const open = useVModel(props, 'open', emit)

function closeMask() {
  props.clickToClose && (open.value = false)
}
</script>

<style lang="postcss" scoped>
.mask-enter-active,
.mask-leave-active {
  transition: opacity 0.2s ease;
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}
</style>
