<template>
  <div
    class="
      fixed
      top-0
      inset-x-0
      max-h-100vh
      min-h-100
      z-51
      p-3
      md:p-10
      rounded
      shadow
      bg-white
      overflow-auto
      transform-gpu
      transition-transform
      duration-[250ms]
      ease-in-out
    "
    :class="{ '-translate-y-full': !open }"
  >
    <VoteSelect
      v-model:selected="selectedQuestionnaire"
      class="w-full"
      :item-list="
        questionnaireKeyToName.map((item) => {
          return {
            name: item.name,
            value: item.smallQuestionnaire,
          }
        })
      "
    />
    <div class="flex flex-wrap">
      <div
        v-for="(answer, index) in questionDone[bigQuestionnaire][smallQuestionnaire].answers"
        :key="index"
        class="rounded-full ring ring-accent-color-600 m-3 w-8 h-8 leading-8 text-center cursor-pointer"
        :class="[answer.done ? 'text-white bg-accent-color-600' : 'text-black bg-accent-color-100']"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent @click="close()"></div>
  </Transition>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { questionnaireComputed, questionDone, questionnaireKeyToName } from '@/questionnaire/lib/questionnaireData'
import { watchEffect, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import VoteSelect from '@/common/components/VoteSelect.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
  bigQuestionnaire: {
    type: String,
    default: 'mainQuestionnaire',
    requred: true,
  },
  smallQuestionnaire: {
    type: String,
    default: 'requiredQuestionnaire',
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
  bigQuestionnaire.value = props.bigQuestionnaire
  smallQuestionnaire.value = props.smallQuestionnaire
  selectedQuestionnaire.value = {
    name: questionnaireComputed.value[props.bigQuestionnaire][props.smallQuestionnaire].name,
    value: props.smallQuestionnaire,
  }
}

const bigQuestionnaire = ref(props.bigQuestionnaire)
const smallQuestionnaire = ref(props.smallQuestionnaire)
const selectedQuestionnaire = ref({
  name: questionnaireComputed.value[props.bigQuestionnaire][props.smallQuestionnaire].name,
  value: props.smallQuestionnaire,
})
watch(selectedQuestionnaire, () => {
  bigQuestionnaire.value =
    questionnaireKeyToName.value.find((item) => item.smallQuestionnaire == selectedQuestionnaire.value.value)
      ?.bigQuestionnaire || questionnaireKeyToName.value[0].bigQuestionnaire
  smallQuestionnaire.value = selectedQuestionnaire.value.value
})
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
