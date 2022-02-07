<template>
  <div class="inline-block align-middle">
    <input
      id="checkBox"
      read-only="true"
      :checked="check"
      class="hidden checked:label:bg-accent-color-600"
      type="checkbox"
      :disabled="props.readOnly"
      @change="changeCheck()"
    />
    <label
      for="checkBox"
      class="
        inline-block
        w-5
        h-5
        rounded
        border border-accent-color-300
        relative
        cursor-pointer
        before:inline-block
        before:w-4.5
        before:h-1.5
        before:border
        before:border-3
        before:borde-white
        before:border-t-0
        before:border-r-0
        before:transform
        before:transform-gpu
        before:-rotate-45
        before:top-1
        before:left-0
        before:absolute
        before:opacity-0
      "
    ></label>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  check: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'update:check', value: boolean): void
}>()

const check = useVModel(props, 'check', emit)

function changeCheck(): void {
  if (props.readOnly) return
  check.value = !check.value
}
</script>
<style lang="postcss" scoped>
label::before {
  content: ' ';
}
input:checked + label {
  @apply bg-accent-color-600;
}
input:checked + label::before {
  @apply opacity-100;
}
</style>
