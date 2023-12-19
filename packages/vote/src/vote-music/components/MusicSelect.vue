<template>
  <transition name="selectBox">
    <div
      v-if="open"
      class="baseBoxRoundedShadow fixed top-1/10 left-0 right-0 h-4/5 flex flex-col p-3 z-51 space-y-2 w-[calc(100%-1rem)] mx-auto md:w-1/2 3xl:w-1/4 text-sm md:text-base xl:text-xl 2xl:text-2xl"
    >
      <div class="flex justify-between border-b">
        <div>请选择曲目</div>
        <icon-uil-times class="cursor-pointer" @click="loading || close()"></icon-uil-times>
      </div>

      <div v-if="!musicHonmeiIsSelected" class="flex justify-between items-center">
        <div class="w-1/2">
          <AutoComplete type="music" />
        </div>
        <VoteSelect v-model:selected="order" :item-list="orderOptions" />
        <div class="cursor-pointer shadow p-1" @click="advancedFilterOpen = true">筛选</div>
      </div>

      <div v-if="!musicHonmeiIsSelected"><small>可通过名称、所属作品来搜索，支持部分匹配和拼音匹配。</small></div>

      <div class="innerBox flex-grow overflow-y-auto p-2 pr-0 flex flex-col space-y-3">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="!musicList.length"
          class="text-center py-10"
          v-html="
            musicHonmeiIsSelected
              ? '只能从喜欢的曲目中选择自己的本命哦<br />请回到上一个界面，点击<strong> + </strong>按钮<br />选择一位自己喜欢的曲目吧！'
              : '没有符合条件的曲目QAQ'
          "
        ></div>
        <!-- eslint-enable vue/no-v-html -->
        <div v-for="item in musicList" v-else :key="item.id" class="baseBoxRoundedShadow p-1 flex">
          <div class="flex-shrink-0 w-1/3 max-w-32">
            <div class="baseBoxRoundedShadow aspect-ratio-1/1 border border-accent-color-600">
              <img class="object-contain" loading="lazy" :src="item.image ? item.image : MusicImages" />
            </div>
          </div>
          <div class="flex-1 min-w-0 p-1 flex flex-wrap content-between md:p-2">
            <div class="w-full">
              <div class="truncate opacity-60 text-xs md:text-base xl:text-lg 2xl:text-xl">{{ item.album }}</div>
              <div
                class="font-semibold truncate md:line-clamp-2 md:whitespace-pre-wrap md:text-lg xl:text-xl 2xl:text-2xl"
              >
                {{ item.name }}
              </div>
              <div v-if="item.include.length && !musicHonmeiIsSelected" class="text-xs md:text-sm opacity-60">
                {{
                  screenSizes['md']
                    ? '*包含收录于' +
                      (item.include.length <= 2
                        ? '专辑「' + item.include.join('」、「') + '」'
                        : '「' + item.include[0] + '」、「' + item.include[1] + '」等专辑') +
                      '的改编曲'
                    : '*包含收录于其他专辑的改编曲'
                }}
              </div>
            </div>
            <div class="w-full flex justify-between">
              <button
                class="flex items-center px-3 md:px-5 py-1 text-sm md:text-base"
                :class="{ 'ring ring-accent-color-300': musicPlaying === item.music }"
                @click="playAudio(item.music)"
              >
                <icon-uil-spinner-alt v-if="musicPlaying === item.music && musicLoading" class="animate-spin" />
                <icon-uil-pause v-else-if="musicPlaying === item.music" />
                试听
              </button>
              <button class="px-3 md:px-5 py-1 text-sm md:text-base" @click="musicSelect(item.id)">选择</button>
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
import { useVModels } from '@vueuse/core'
import AdvancedFilter from './AdvancedFilter.vue'
import { screenSizes } from '@/tailwindcss'
import { Music } from '@/vote-music/lib/music'
import { musicsVotedWithoutHonmei, musicListLeftWithFilter, order, orderOptions } from '@/vote-music/lib/musicList'
import { musics } from '@/vote-music/lib/voteData'
import VoteSelect from '@/common/components/VoteSelect.vue'
import Mask from '@/common/components/Mask.vue'
import AutoComplete from '@/common/components/AutoComplete.vue'
import MusicImages from '@/vote-music/assets/defaultMusicImage.jpg?url'

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
  audio.value.pause()
  open.value = false
}
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})

const loading = ref(false)
const advancedFilterOpen = ref(false)

const musicList = computed(() =>
  props.musicHonmeiIsSelected ? musicsVotedWithoutHonmei.value : musicListLeftWithFilter.value
)

function musicSelect(id: string): void {
  const targetMusic = props.musicHonmeiIsSelected
    ? musicsVotedWithoutHonmei.value.find((item) => item.id === id)
    : musicListLeftWithFilter.value.find((item) => item.id === id)
  if (targetMusic) {
    if (props.musicHonmeiIsSelected) {
      musics.value.map((item) => (item.id === id ? (item.honmei = true) : (item.honmei = false)))
    } else {
      musicSelected.value = targetMusic
    }
  }
  close()
}

const audio = ref(new Audio())
audio.value.addEventListener('canplay', () => {
  musicLoading.value = false
})
audio.value.addEventListener('waiting', () => {
  musicLoading.value = true
})
const musicLoading = ref(false)
const musicPlaying = ref<string>('')
function playAudio(musicSrc: string): void {
  if (musicLoading.value) return
  if (musicSrc === audio.value.src && !audio.value.paused) {
    audio.value.pause()
    musicPlaying.value = ''
  } else {
    audio.value.src = musicSrc
    musicPlaying.value = musicSrc
    audio.value.play()
  }
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
