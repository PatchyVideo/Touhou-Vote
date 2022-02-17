<template>
  <div
    class="relative p-2 opacity-80 rounded shadow bg-white space-y-1 cursor-pointer border"
    style="border-color: #fc4328"
  >
    <div class="flex justify-between items-center">
      <div class="font-bold text-2xl truncate">{{ doujin.title }}</div>
      <div
        class="text-sm px-1 border rounded"
        :style="
          'border-color:' + doujinTypes.find((item) => item.value === doujin.dojinType)?.color || doujinTypes[0].color
        "
      >
        {{ doujinTypes.find((item) => item.value === doujin.dojinType)?.name || doujinTypes[0].name }}
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center">
        <icon-uil-user />
        <div class="truncate">{{ doujin.author }}</div>
      </div>
      <div class="flex items-center">
        <icon-uil-link />
        <div class="truncate">{{ doujin.url }}</div>
      </div>
    </div>
    <div class="text-sm text-gray-700 line-clamp-2">{{ doujin.reason }}</div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Doujin, doujinTypes } from '@/vote-doujin/lib/doujin'

const props = defineProps({
  doujin: {
    type: Object as PropType<Doujin>,
    requred: true,
    default: function () {
      return new Doujin()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:doujin', value: Doujin): void
}>()
const doujin = useVModel(props, 'doujin', emit)
</script>
