<template>
  <transition name="selectBox">
    <div
      v-if="open"
      class="fixed top-1/10 left-0 right-0 h-4/5 flex flex-col p-3 z-51 space-y-2 bg-white rounded w-9/10 mx-auto md:w-1/2 3xl:w-1/4 text-sm md:text-base xl:text-xl 2xl:text-2xl"
    >
      <div class="flex justify-between border-b">
        <div>请选择角色</div>
        <icon-uil-times class="cursor-pointer" @click="loading || close()"></icon-uil-times>
      </div>
      <div class="flex justify-between items-center">
        <div class="shadow rounded h-7 w-1/2 flex justify-start items-center">
          <icon-uil-search class="flex-shrink-0 inline ml-2 mr-1" />
          <input
            v-model="searchContent"
            class="nline-block h-full outline-none dark:bg-gray-800 w-full rounded"
            @keydown.enter="search()"
          />
        </div>
        <VoteSelect v-model:selected="order" :item-list="orderOptions" />
        <div class="cursor-pointer shadow p-1" @click="advancedFilterOpen = true">筛选</div>
      </div>
      <div class="flex-grow overflow-y-auto p-2 rounded shadow-inner bg-gray-50 flex flex-col space-y-3">
        <div
          v-for="item in characterListLeftWithFilter"
          :key="item.id"
          class="p-1 rounded shadow bg-white flex ring"
          :style="'--tw-ring-color:' + item.color"
        >
          <img class="w-1/3 rounded border" loading="lazy" :src="item.image" />
          <div class="w-2/3 p-1 flex flex-wrap content-between md:p-2">
            <div class="w-full">
              <div class="truncate opacity-60" :style="'color:' + item.color">{{ item.title }}</div>
              <div
                class="font-semibold truncate text-lg md:text-xl xl:text-2xl 2xl:text-3xl"
                :style="'color:' + item.color"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="w-full flex justify-end">
              <button
                class="px-3 md:px-5 py-1 shadow rounded text-white text-sm md:text-base"
                :style="'background-color:' + item.color"
                @click="characterSelect(item.id)"
              >
                选择
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent></div>
  </Transition>
  <AdvancedFilter v-model:open="advancedFilterOpen" />
</template>

<script lang="ts" setup>
import { ref, watchEffect, PropType, computed } from 'vue'
import { useVModels } from '@vueuse/core'
import { Character } from '@/vote-character/lib/character'
import { characterList } from '@/vote-character/lib/characterList'
import { Couple } from '@/vote-couple/lib/couple'
import VoteSelect from '@/common/components/VoteSelect.vue'
import AdvancedFilter from './AdvancedFilter.vue'

const props = defineProps({
  open: {
    type: Boolean,
    requred: true,
  },
  coupleSelected: {
    type: Object as PropType<Couple>,
    requred: true,
    default: function () {
      return new Couple()
    },
  },
  characterSelected: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return new Character()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'update:characterSelected', value: string): void
}>()
const { open, characterSelected } = useVModels(props, emit)
function close(): void {
  open.value = false
}
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})

const loading = ref(false)
const advancedFilterOpen = ref(false)

const orderOptions = [
  {
    name: '出场正序',
    value: 'newest',
  },
  {
    name: '出场倒序',
    value: 'oldest',
  },
]
const order = ref(orderOptions[0])

const characterListLeft = computed<Character[]>(() =>
  characterList.filter((character) => {
    let characterInCharacters = false
    for (let i = 0; i < props.coupleSelected.characters.length; i++) {
      if (props.coupleSelected.characters[i].id === character.id) characterInCharacters = true
    }
    return !characterInCharacters
  })
)

const keyword = ref('')
const searchContent = ref<string>(keyword.value)
function search(): void {
  searchContent.value = searchContent.value.trim()
  keyword.value = searchContent.value
}

import { filterForKind, workSelected } from '@/vote-couple/lib/workList'
const characterListLeftWithFilter = computed<Character[]>(() => {
  let list: Character[] = JSON.parse(JSON.stringify(characterListLeft.value))
  list.sort((a, b) =>
    order.value.name === orderOptions[0].name ? Number(a.date) - Number(b.date) : Number(b.date) - Number(a.date)
  )
  if (filterForKind.value.length)
    list = list.filter((item) => {
      for (const work of filterForKind.value) {
        if (item.kind.find((item2) => item2 === work.value)) {
          return true
        }
      }
      return false
    })
  if (workSelected.value.name != '') {
    list = list.filter((item) => {
      if (item.work.find((item2) => item2 === workSelected.value.name)) return true
      else return false
    })
  }
  if (keyword.value != '') {
    const regex = new RegExp(keyword.value)
    list = list.filter((item) => {
      if (regex.test(item.name)) return true
      if (regex.test(item.title)) return true
      else if (item.altnames.length) {
        for (const item2 of item.altnames) {
          if (regex.test(item2)) return true
        }
        return false
      }
    })
  }
  return list
})

function characterSelect(id: string): void {
  characterSelected.value =
    characterListLeftWithFilter.value.find((character) => character.id === id) || new Character()
  close()
}
</script>
<style lang="postcss" scoped>
.selectBox-enter-active,
.selectBox-leave-active {
  @apply transition-all duration-200;
}

.selectBox-enter-from,
.selectBox-leave-to {
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
