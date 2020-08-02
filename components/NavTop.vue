<template>
  <div class="NavTop">
    <span class="text-2xl">(LOGO)THBWiki & PatchyVideo</span>
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
.NavTop {
  @apply p-2;
  @apply shadow;
  @apply bg-gray-100;
}
</style>
