<template>
  <div class="inline-block relative">
    <div
      ref="VoteSelectRoot"
      class="baseBlock flex justify-between cursor-pointer p-1 md:px-3"
      @click="listHidden = !listHidden"
    >
      {{ selected.name === '' ? selectedName : selected.name }}
      <div
        class="inline-block transform-gpu origin-center transition-all duration-200"
        :class="{ 'rotate-180': !listHidden }"
      >
        ▼
      </div>
    </div>
    <div
      v-if="itemList.length"
      class="baseBlock absolute z-52 mt-1 w-full overflow-hidden"
      :class="{ 'p-1': !listHidden }"
    >
      <ul
        class="space-y-1 overflow-x-hidden overflow-y-auto transform-gpu transition-all duration-200"
        :style="{ marginTop: listHidden ? '-' + 40 * itemList.length + '%' : '0' }"
      >
        <li
          v-for="(item, index) in itemList"
          :key="index"
          class="truncate cursor-pointer transition transition-colors hover:bg-accent-color-600"
          @click="selectItem(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import type { PropType } from 'vue'
import { useEventListener, useVModel } from '@vueuse/core'

interface SelectList {
  name: string
  value: string | number
}

const props = defineProps({
  itemList: {
    type: Array as PropType<SelectList[]>,
    default: () => [],
    requred: true,
  },
  selected: {
    type: Object as PropType<SelectList>,
    default: () => {
      return {
        name: '',
        value: '',
      }
    },
    requred: true,
  },
  selectedName: {
    type: String,
    default: '请选择',
  },
})

const emit = defineEmits<{
  (event: 'update:selected', value: string): void
}>()

const selected = useVModel(props, 'selected', emit)

const listHidden = ref<boolean>(true)

function selectItem(item: SelectList): void {
  selected.value = item
}

// Click to hide the list
const VoteSelectRoot = shallowRef<HTMLDivElement | null>(null)
useEventListener(document, 'click', (e) => {
  if (!VoteSelectRoot.value?.contains(e.target as HTMLElement)) {
    listHidden.value = true
  }
})
</script>
