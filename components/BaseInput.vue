<template>
  <div class="Input">
    <input v-model="value" :class="{ inputError: error }" :type="type" :placeholder="placeholder" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'

export default defineComponent({
  props: {
    // placeholder,原生属性
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    // type，原生属性
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    // value，原生属性
    value: {
      type: String,
      required: false,
      default: '',
    },
    // 判断输入内容是否错误
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
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
.Input {
  @apply w-full;
}
input {
  @apply shadow;
  @apply appearance-none;
  @apply border;
  @apply rounded;
  @apply w-full;
  @apply py-2;
  @apply px-3;
  @apply text-gray-700;
  @apply mb-3;
  @apply leading-tight;
}
input:focus {
  @apply outline-none;
  @apply shadow-outline;
}
.inputError {
  @apply border-base-error;
}
</style>
