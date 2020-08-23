<template>
  <div class="w-4/5 bg-gray-100 p-40 m-auto flex flex-col">
    <p class="text-lg">第九届东方计划人气投票 人妖部门</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="postcss" scoped>
.voteLink {
  @apply text-4xl;
  @apply my-2;
}
.voteLink:hover {
  @apply bg-gray-200;
}
</style>
