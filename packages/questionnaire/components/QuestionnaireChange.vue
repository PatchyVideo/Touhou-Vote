<template>
  <div
    class="
      fixed
      right-0
      inset-y-0
      z-51
      p-1
      rounded
      w-3/4
      lg:w-auto
      shadow
      bg-white bg-opacity-80
      overflow-auto
      transform-gpu
      transition-transform
      duration-[250ms]
      ease-in-out
    "
    :class="{ 'translate-x-full': !open }"
  >
    <div>问卷列表：</div>
    <div v-for="(bigQuestionaire, bigIndex) in questionnaireComputed" :key="bigIndex">
      <div v-for="(smallQuestionaire, smallIndex) in bigQuestionaire" :key="smallIndex">
        {{ smallQuestionaire.name }}
      </div>
    </div>
  </div>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent @click="close()"></div>
  </Transition>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { questionnaireComputed } from '@/questionnaire/lib/questionnaireData'
import { watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: string): void
}>()

const open = useVModel(props, 'open', emit)
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function close(): void {
  open.value = false
}
</script>
<style lang="postcss" scoped>
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
