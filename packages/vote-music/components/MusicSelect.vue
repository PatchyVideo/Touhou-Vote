<template>
  <transition name="selectBox">
    <div
      v-if="open"
      class="
        fixed
        top-1/10
        left-0
        right-0
        h-4/5
        flex flex-col
        p-3
        z-51
        space-y-2
        bg-white
        rounded
        w-9/10
        mx-auto
        md:w-1/2
        lg:w-1/3
        3xl:w-1/4
        text-sm
        md:text-base
        xl:text-xl
        2xl:text-2xl
      "
    >
      <div class="flex justify-between border-b">
        <div>请选择曲目</div>
        <icon-uil-times class="cursor-pointer" @click="loading || close()"></icon-uil-times>
      </div>
      <div v-if="!musicHonmeiIsSelected" class="flex justify-between items-center">
        <div class="shadow rounded h-7 w-1/2 flex justify-start items-center">
          <icon-uil-search class="flex-shrink-0 inline ml-2 mr-1" />
          <input class="nline-block h-full outline-none dark:bg-gray-800 w-full rounded" />
        </div>
        <VoteSelect v-model:selected="order" :item-list="orderOptions" />
        <div class="cursor-pointer shadow p-1">筛选</div>
      </div>
      <div class="flex-grow overflow-y-auto p-2 rounded shadow-inner bg-gray-50 flex flex-col space-y-3">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="!musicList.length"
          class="text-center text-gray-400 py-10"
          v-html="
            musicHonmeiIsSelected
              ? '只能从喜欢的曲目中选择自己的本命哦<br />先选择一首自己喜欢的曲目吧！'
              : '没有符合条件的曲目QAQ'
          "
        ></div>
        <!-- eslint-enable vue/no-v-html -->
        <div v-for="(item, index) in musicList" v-else :key="index" class="p-1 rounded shadow bg-white flex">
          <img class="w-1/3 rounded border" :src="item.image" />
          <div class="w-2/3 p-1 flex flex-wrap content-between md:p-2">
            <div class="w-full">
              <div class="truncate opacity-60">{{ item.album }}</div>
              <div class="font-semibold truncate text-lg md:text-xl xl:text-2xl 2xl:text-3xl">
                {{ item.name }}
              </div>
            </div>
            <div class="w-full flex justify-end">
              <button class="px-3 md:px-5 py-1 shadow rounded text-sm md:text-base" @click="musicSelect(item.id)">
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
</template>

<script lang="ts" setup>
import { ref, watchEffect, defineProps, PropType, computed } from 'vue'
import { useVModels } from '@vueuse/core'
import { Music } from '@/vote-music/lib/music'
import { musicListLeft, musicHonmeiListLeft } from '@/vote-music/lib/musicList'
import { musics } from '@/vote-music/lib/voteData'
import VoteSelect from '@/common/components/VoteSelect.vue'

const props = defineProps({
  open: {
    type: Boolean,
    requred: true,
  },
  musicHonmeiIsSelected: {
    type: Boolean,
    requred: true,
    default: true,
  },
  musicSelected: {
    type: Object as PropType<Music>,
    requred: true,
    default: function () {
      return new Music()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'update:musicSelected', value: string): void
}>()
const { open, musicSelected } = useVModels(props, emit)
function close(): void {
  open.value = false
}
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})

const loading = ref(false)

const musicList = computed(() => (props.musicHonmeiIsSelected ? musicHonmeiListLeft.value : musicListLeft.value))

const orderOptions = [
  {
    name: '从新到旧',
    value: 'newest',
  },
  {
    name: '从旧到新',
    value: 'oldest',
  },
]
const order = ref(orderOptions[0])

function musicSelect(id: string): void {
  const targetMusic = props.musicHonmeiIsSelected
    ? musicHonmeiListLeft.value.find((item) => item.id === id)
    : musicListLeft.value.find((item) => item.id === id)
  if (targetMusic) {
    if (props.musicHonmeiIsSelected) {
      musics.value.map((item) => (item.id === id ? (item.honmei = true) : (item.honmei = false)))
    } else {
      musicSelected.value = targetMusic
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
