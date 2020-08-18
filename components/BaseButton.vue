<template>
  <div class="Button">
    <button type="button">
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  setup() {
    return {}
  },
  mounted() {},
})
</script>

<style lang="postcss" scoped>
.Button {
  @apply inline-block;
}
button {
  @apply w-full;
  @apply bg-base-green;
  @apply text-dark-white;
  @apply font-bold;
  @apply py-1;
  @apply px-4;
  @apply rounded;
  transition: ease-in-out 0.2s;
}
button:hover {
  @apply bg-dark-green;
}
button:focus {
  @apply outline-none;
  @apply shadow-outline;
}
</style>
