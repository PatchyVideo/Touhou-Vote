<template>
  <transition name="selectBox">
    <div
      v-if="open"
      class="baseBlock fixed top-1/10 left-0 right-0 h-4/5 flex flex-col p-3 z-51 space-y-2 rounded w-[calc(100%-1rem)] mx-auto md:w-1/2 3xl:w-1/4 text-sm md:text-base xl:text-xl 2xl:text-2xl"
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
            class="inline-block h-full outline-none w-full rounded"
            @keydown.enter="search()"
            :placeholder="'输入关键词搜索角色'"
          />
        </div>
        <VoteSelect v-model:selected="order" :item-list="orderOptions" />
        <div class="cursor-pointer shadow p-1" @click="advancedFilterOpen = true">筛选</div>
      </div>

      <div><small>可通过名称、外号、所属作品来搜索，支持部分匹配和拼音匹配。</small></div>

      <div class="innerBox flex-grow overflow-y-auto p-2 pr-0 rounded flex flex-col space-y-3">
        <div v-for="item in characterListLeftWithFilter" :key="item.id" class="baseBlock p-1 rounded shadow flex">
          <div class="flex-shrink-0 w-1/3 max-w-32">
            <div class="baseBlock aspect-ratio-1/1 rounded border border-accent-color-600">
              <img class="object-contain" loading="lazy" :src="item.image ? item.image : characterImages" />
            </div>
          </div>
          <div class="flex-1 min-w-0 p-1 flex flex-col content-between md:p-2">
            <div class="flex-1">
              <div class="truncate opacity-60" :style="'color:' + item.color">{{ item.title }}</div>
              <div class="font-semibold truncate text-lg md:text-xl xl:text-2xl 2xl:text-3xl">
                {{ item.name }}
              </div>
            </div>
            <div class="flex justify-end">
              <button
                class="px-3 md:px-5 py-1 shadow rounded bg-accent-color-600 text-sm md:text-base"
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
  <Mask v-model:open="open" />
  <AdvancedFilter v-model:open="advancedFilterOpen" />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { useVModels, watchThrottled } from '@vueuse/core'
import { CachedSearcher, SearchLogicContain } from 'pinin'
import AdvancedFilter from './AdvancedFilter.vue'
import VoteSelect from '@/common/components/VoteSelect.vue'
import characterImages from '@/vote-character/assets/defaultCharacterImage.png?url'
import { Character } from '@/vote-character/lib/character'
import { characterList } from '@/vote-character/lib/characterList'
import { Couple } from '@/vote-couple/lib/couple'
import { filterForKind, workSelected } from '@/vote-couple/lib/workList'
import { pinin } from '@/common/lib/pinin'
import Mask from '@/common/components/Mask.vue'

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
  // flag is used to judge whether user selected same character or just close the window
  flag: {
    type: Number,
    requred: true,
    default: 0,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'update:characterSelected', value: string): void
  (event: 'update:flag', value: number): void
}>()
const { open, characterSelected, flag } = useVModels(props, emit)
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

const characterListLeft = computed<Character[]>(() => {
  let charaList = characterList
  // delete repeated characters, somebody think it is not needed
  // .filter((character) => {
  //   let characterInCharacters = false
  //   for (let i = 0; i < props.coupleSelected.characters.length; i++) {
  //     if (props.coupleSelected.characters[i].id === character.id) characterInCharacters = true
  //   }
  //   return !characterInCharacters
  // })

  if (filterForKind.value.length) {
    charaList = charaList.filter((chara) => filterForKind.value.find((k1) => chara.kind.find((k2) => k2 === k1.value)))
  }

  if (workSelected.value.name) {
    charaList = charaList.filter((chara) => chara.work.find((work) => work === workSelected.value.name))
  }
  return charaList
})

const keyword = ref('')
const searchContent = ref<string>(keyword.value)
function search(): void {
  keyword.value = searchContent.value
}
watchThrottled(searchContent, search, { throttle: 100 })
const searcher = computed(() => {
  const s = new CachedSearcher<Character>(SearchLogicContain, pinin)

  for (const c of characterListLeft.value) {
    s.put(c.name.toLowerCase(), c)
    for (const altname of c.altnames) {
      s.put(altname.toLowerCase(), c)
    }
    for (const work of c.work) {
      s.put(work.toLowerCase(), c)
    }
  }

  return s
})
const characterListLeftWithFilter = computed<Character[]>(() => {
  const res = keyword.value ? [...new Set(searcher.value.search(keyword.value.toLowerCase()))] : characterListLeft.value

  if (order.value.name === orderOptions[0].name) {
    res.sort((a, b) => a.date - b.date)
  } else {
    res.sort((a, b) => b.date - a.date)
  }

  return res
})

function characterSelect(id: string): void {
  characterSelected.value =
    characterListLeftWithFilter.value.find((character) => character.id === id) || new Character()
  flag.value++
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
</style>
