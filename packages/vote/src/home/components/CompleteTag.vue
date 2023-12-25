<template>
  <div class="inline-block">
    <div
      v-if="props.complete"
      class="px-1 text-textaccent rounded border border-textaccent bg-accent-color-300 bg-opacity-0"
      :class="{ truncate: props.truncate }"
    >
      完成
    </div>
    <div
      v-else
      class="px-1 text-accent-color-600 rounded border border-accent-color-300 bg-accent-color-300 bg-opacity-100"
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
