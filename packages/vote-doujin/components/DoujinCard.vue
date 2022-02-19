<template>
  <div class="p-2 rounded shadow bg-white bg-opacity-80 space-y-1 cursor-pointer border" style="border-color: #fc4328">
    <div class="flex overflow-hidden">
      <div class="w-3/10">
        <div class="aspect-ratio-10/16 overflow-hidden border rounded">
          <object
            class="h-full w-full object-contain"
            :data="doujin.imageUrl === Doujin0.imageUrl ? Doujin0NoImageUrl : doujin.imageUrl"
          >
            <img class="h-full w-full object-contain" :src="Doujin0NoImageUrl" />
          </object>
        </div>
      </div>
      <div class="w-7/10 flex flex-col space-y-1 pl-1">
        <div class="flex justify-between items-center">
          <div class="font-medium text-lg truncate" v-text="doujin.title"></div>
          <div
            class="text-sm px-1 border rounded whitespace-nowrap"
            :style="{ borderColor: doujinType.color }"
            v-text="doujinType.name"
          ></div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <icon-uil-user class="flex-shrink-0" />
            <div class="truncate" v-text="doujin.author"></div>
          </div>
          <div class="flex items-center gap-1">
            <icon-uil-link class="flex-shrink-0" />
            <div class="truncate" v-text="doujin.url.replace(/^https?:\/\/(www\.)?/, '')"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm mt-1 text-gray-700 line-clamp-2">{{ doujin.reason }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { Doujin, Doujin0, Doujin0NoImageUrl, getDoujinTypeData } from '@/vote-doujin/lib/doujin'

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
