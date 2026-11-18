<template>
  <div class="inline-flex align-middle">
    <div
      v-if="props.complete"
      class="px-1.5 py-0.5 rounded-md border border-accent-color-400 text-accent-color-800 bg-white text-xs leading-4 whitespace-nowrap"
      :class="{ truncate: props.truncate }"
    >
      完成
    </div>
    <div
      v-else
      class="px-1.5 py-0.5 rounded-md border border-accent-color-300 text-accent-color-800 bg-accent-color-100 text-xs leading-4 whitespace-nowrap"
      :class="{ truncate: props.truncate }"
    >
      未完成
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  complete: {
    type: Boolean,
    default: true,
  },
  truncate: {
    type: Boolean,
    default: true,
  },
})
</script>
