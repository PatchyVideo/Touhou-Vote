<template>
  <div class="Divider">
    <div class="w-full h-1 bg-gray-900"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="postcss" scoped>
.Divider {
  @apply w-full;
  @apply my-4;
}
</style>
