<template>
  <div class="NavBottom">
    <div class="text-center">
      Copyright© 2020 <a class="t-lb" href="https://thwiki.cc" target="_blank">THBWiki</a> &
      <a class="t-lb" href="https://patchyvideo.com" target="_blank">Patchyvideo</a>
    </div>
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
.NavBottom {
  @apply p-2;
  @apply shadow;
  @apply bg-gray-100;
}
</style>
