<template>
  <span
    v-if="props.complete"
    class="px-1 text-textaccent truncate rounded border border-textaccent bg-accent-color-300 bg-opacity-0"
    >完成
  </span>
  <span
    v-else
    class="px-1 text-accent-color-600 truncate rounded border border-accent-color-300 bg-accent-color-300 bg-opacity-100"
    >未完成
  </span>
</template>

<script lang="ts" setup>
const props = defineProps({
  complete: {
    type: Boolean,
    default: true,
  },
})
</script>
