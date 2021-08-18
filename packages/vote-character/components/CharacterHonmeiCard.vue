<template>
  <div class="relative w-full p-1 rounded shadow bg-white flex">
    <img class="w-1/3 rounded border" src="https://i.loli.net/2021/08/16/vUNt2gOj37F16cs.png" />
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer"></icon-uil-times>
    <div class="w-9/10 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate">祭祀风的人类</div>
        <div class="font-semibold text-xl truncate">东风谷 早苗</div>
      </div>
      <div class="w-full flex justify-end">
        <div class="transform -rotate-45 border rounded-sm border-red-500 text-red-500">本命</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, defineProps, defineEmits } from 'vue'
import { useVModels } from '@vueuse/core'

const props = defineProps({
  characterHonmei: { type: String, required: true },
})
const emit = defineEmits<{
  (event: 'update:characterHonmei', value: string): void
}>()

const { characterHonmei } = useVModels(props, emit)
</script>
