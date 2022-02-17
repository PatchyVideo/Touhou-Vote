<template>
  <div
    class="px-3 py-2 max-w-80ch rounded-md shadow cursor-pointer border-2 border-accent-color-400 hover:shadow-md hover:border-accent-color-500 transition-all ease-in-out"
  >
    <div class="flex justify-between items-center">
      <div class="font-medium text-lg truncate" v-text="doujin.title"></div>
      <div class="px-1 border rounded" :style="{ borderColor: doujinType.color }" v-text="doujinType.name"></div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1">
        <icon-uil-user />
        <div class="truncate" v-text="doujin.author"></div>
      </div>
      <div class="flex items-center gap-1">
        <icon-uil-link />
        <div class="truncate" v-text="doujin.url"></div>
      </div>
    </div>
    <div class="mt-1 text-gray-800 line-clamp-4" v-text="doujin.reason"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Doujin, getDoujinTypeData } from '@/vote-doujin/lib/doujin'

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
const doujinType = computed(() => getDoujinTypeData(doujin.value.dojinType))
</script>
