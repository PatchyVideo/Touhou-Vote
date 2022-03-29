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
      <div v-if="!characterHonmeiIsSelected" class="flex justify-between items-center">
        <div class="w-1/2">
          <AutoComplete type="character" />
        </div>
        <VoteSelect v-model:selected="order" :item-list="orderOptions" />
        <div class="cursor-pointer shadow p-1" @click="advancedFilterOpen = true">筛选</div>
      </div>
      <div class="flex-grow overflow-y-auto p-2 rounded shadow-inner bg-gray-50 flex flex-col space-y-3">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="!characterList.length"
          class="text-center text-gray-400 py-10"
          v-html="
            characterHonmeiIsSelected
              ? '只能从喜欢的角色中选择自己的本命哦<br />先选择一位自己喜欢的角色吧！'
              : '没有符合条件的角色QAQ'
          "
        ></div>
        <!-- eslint-enable vue/no-v-html -->
        <div
          v-for="item in characterList"
          v-else
          :key="item.id"
          class="flex flex-row p-1 rounded shadow bg-white ring"
          :style="'--tw-ring-color:' + item.color"
        >
          <div class="w-1/3 max-w-32">
            <div class="aspect-ratio-1/1 rounded border">
              <img loading="lazy" :src="item.image ? item.image : characterImages" />
            </div>
          </div>
          <div class="flex-1 p-1 flex flex-wrap content-between md:p-2">
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
import type { PropType } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { useVModels } from '@vueuse/core'
import AdvancedFilter from './AdvancedFilter.vue'
import { Character } from '@/vote-character/lib/character'
import characterImages from '@/vote-character/assets/defaultCharacterImage.png?url'
import {
  characterHonmeiListLeft,
  characterListLeftWithFilter,
  order,
  orderOptions,
} from '@/vote-character/lib/characterList'
import { characters } from '@/vote-character/lib/voteData'
import VoteSelect from '@/common/components/VoteSelect.vue'
import AutoComplete from '@/common/components/AutoComplete.vue'

const props = defineProps({
  open: {
    type: Boolean,
    requred: true,
  },
  characterHonmeiIsSelected: {
    type: Boolean,
    requred: true,
    default: true,
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

const characterList = computed(() =>
  props.characterHonmeiIsSelected ? characterHonmeiListLeft.value : characterListLeftWithFilter.value
)

function characterSelect(id: string): void {
  const targetCharacter = props.characterHonmeiIsSelected
    ? characterHonmeiListLeft.value.find((item) => item.id === id)
    : characterListLeftWithFilter.value.find((item) => item.id === id)
  if (targetCharacter) {
    if (props.characterHonmeiIsSelected) {
      characters.value.map((item) => (item.id === id ? (item.honmei = true) : (item.honmei = false)))
    } else {
      characterSelected.value = targetCharacter
    }
  }
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
