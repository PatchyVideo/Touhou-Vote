<template>
  <div class="p-1 rounded shadow bg-white">
    <img class="rounded border" src="https://i.loli.net/2021/08/15/vKAr1ubSEVtofFN.png" />
    <div class="p-1 truncate text-center text-xs">东风谷 早苗</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, defineProps, defineEmits } from 'vue'
import { useVModels } from '@vueuse/core'

const props = defineProps({
  character: { type: String, required: true },
  honmei: { type: Boolean, default: false },
})
const emit = defineEmits<{
  (event: 'update:character', value: string): void
}>()

const { character } = useVModels(props, emit)
</script>
