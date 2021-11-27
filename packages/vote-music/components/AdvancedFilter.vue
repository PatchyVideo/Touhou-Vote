<template>
  <transition name="advancedFilter">
    <div
      v-if="open"
      class="
        fixed
        top-1/8
        left-0
        right-0
        h-3/5
        flex flex-col
        p-3
        z-53
        space-y-2
        bg-white
        rounded
        w-3/4
        mx-auto
        md:w-2/5
        lg:w-4/15
        3xl:w-1/5
        text-sm
        md:text-base
        xl:text-xl
        2xl:text-2xl
      "
    >
      <div class="flex justify-between border-b">
        <div>高级筛选</div>
        <icon-uil-times class="cursor-pointer" @click="cancelFilter()"></icon-uil-times>
      </div>
      <div class="flex-grow overflow-y-auto p-2 flex flex-col space-y-3">
        <div>初登场作品种类：</div>
        <div class="flex flex-wrap space-x-3">
          <div
            v-for="(kind, index) in kinds"
            :key="index"
            class="cursor-pointer rounded shadow py-1 px-2 mb-2 transition transition-colors select-none"
            :class="{
              'ring ring-accent-color-600 bg-accent-color-400 text-white':
                filterForKindTem.findIndex((filterKind) => filterKind.value === kind.value) != -1,
            }"
            @click="updateFilterForKindTem(kind)"
          >
            {{ kind.name }}
          </div>
        </div>
        <div>初登场作品：</div>
        <VoteSelect v-model:selected="albumSelectedTem" :item-list="albumsListAfterFilterTem" />
        <div
          class="
            text-right text-accent-color-600
            transition transition-colors
            cursor-pointer
            hover:text-accent-color-300
          "
          @click="resetFilter()"
        >
          重置条件
        </div>
      </div>
      <div class="p-2 border-t">
        <button class="w-full py-2 rounded-xl text-white bg-accent-color-600 justify-center" @click="commitFilter()">
          确定
        </button>
      </div>
    </div>
  </transition>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-52" @touchmove.stop.prevent></div>
  </Transition>
</template>

<script lang="ts" setup>
import { defineProps, watch } from 'vue'
import { useVModels } from '@vueuse/core'
import {
  kinds,
  filterForKindTem,
  albumsListAfterFilterTem,
  albumSelectedTem,
  getFilterForKindTem,
  getAlbumSelectedTem,
  resetFilterForKindTem,
  updateFilterForKind,
  updateFilterForKindTem,
  updateAlbumSelected,
  resetAlbumSelectedTem,
} from '@/vote-music/lib/albumList'
import VoteSelect from '@/common/components/VoteSelect.vue'

const props = defineProps({
  open: {
    type: Boolean,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()
const { open } = useVModels(props, emit)
function close(): void {
  open.value = false
}

watch(filterForKindTem.value, resetAlbumSelectedTem)

function cancelFilter(): void {
  getFilterForKindTem()
  getAlbumSelectedTem()
  close()
}
function commitFilter(): void {
  updateFilterForKind()
  updateAlbumSelected()
  close()
}
function resetFilter(): void {
  resetFilterForKindTem()
  resetAlbumSelectedTem()
}
</script>
<style lang="postcss" scoped>
.advancedFilter-enter-active,
.advancedFilter-leave-active {
  @apply transition-all duration-200;
}

.advancedFilter-enter-from,
.advancedFilter-leave-to {
  @apply opacity-0;
}
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
