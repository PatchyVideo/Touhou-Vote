<template>
  <div class="Input">
    <input :class="{ inputError: error }" :type="type" :placeholder="placeholder" v-on="inputListeners" />
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
  computed: {
    inputListeners(): Object {
      const vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign(
        {},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input(event: InputEvent) {
            vm.$emit('input', (<HTMLInputElement>event.target).value)
          },
        }
      )
    },
  },
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
