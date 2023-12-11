<template>
  <div
    class="rounded-lg px-3 py-2 max-w-80ch cursor-pointer border-2 border-accent-color-300 hover:shadow hover:border-accent-color-600 transition-all ease-in-out"
  >
    <div class="flex overflow-hidden">
      <div class="w-42">
        <div class="aspect-ratio-10/16 overflow-hidden border rounded">
          <picture class="h-full w-full object-contain">
            <source
              :srcset="
                doujin.imageUrl === Doujin0.imageUrl ? Doujin0NoImageUrl : doujin.imageUrl.replace(/^http:/, 'https:')
              "
            />
            <img class="h-full w-full object-contain" :src="Doujin0NoImageUrl" />
          </picture>
        </div>
      </div>
      <div class="w-8/10 flex flex-col space-y-1 pl-1">
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
            <div class="truncate" v-text="doujin.url"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-1 line-clamp-4" v-text="doujin.reason"></div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
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
