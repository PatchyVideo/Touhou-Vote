<template>
  <div class="relative p-1 pt-5 rounded shadow bg-white">
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer"></icon-uil-times>
    <img class="w-full rounded border" src="https://i.loli.net/2021/08/16/OePWGh6S3Rsl1IJ.png" />
    <div class="p-1 truncate text-center text-xs md:text-base">小恶魔</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, defineProps, defineEmits } from 'vue'
import { useVModels } from '@vueuse/core'

const props = defineProps({
  character: { type: String, required: true },
})
const emit = defineEmits<{
  (event: 'update:character', value: string): void
}>()

const { character } = useVModels(props, emit)
</script>
