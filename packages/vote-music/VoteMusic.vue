<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - 音乐部门</div>
    </div>

    <div
      class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 lg:w-1/3 xl:w-1/4 3xl:w-1/5 md:m-auto"
    >
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>
            {{ '本命曲(' + (musicHonmei.id === music0.id ? 0 : 1) + '/1)' }}
          </div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': musicHonmei.id != music0.id }"
            @click="
              musicHonmei.id === music0.id
                ? (() => {
                    musicHonmeiIsSelected = true
                    musicSelectOpen = true
                  })()
                : ''
            "
          ></icon-uil-plus>
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50">
          <transition name="musicHonmei" mode="out-in">
            <div v-if="musicHonmei.id != music0.id" key="selecting">
              <MusicHonmeiCard v-model:music-honmei="musicHonmei" class="opacity-80" />
            </div>
            <div v-else key="no-selecting" class="w-full aspect-69/200"></div>
          </transition>
        </div>
      </div>

      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl®">
          <div>{{ '我喜欢的曲目(' + musicsVotedNumber + '/11)' }}</div>
          <icon-uil-plus
            class="cursor-pointer"
            :class="{ 'text-gray-400': musicsVotedNumber === 8 }"
            @click="
              musicsVotedNumber === 8
                ? ''
                : (() => {
                    musicHonmeiIsSelected = false
                    musicSelectOpen = true
                  })()
            "
          ></icon-uil-plus>
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50 whitespace-nowrap overflow-x-auto">
          <div v-if="musicsVotedNumber">
            <transition-group name="musicList" tag="div">
              <div
                v-for="(music, index) in musicsReverse"
                :key="music.id"
                class="inline-block transition transition-all duration-200 mr-3 w-3/10"
              >
                <MusicCard
                  v-model:music="musicsReverse[index]"
                  v-model:musicsSelectedList="musics"
                  class="opacity-80"
                />
              </div>
            </transition-group>
          </div>
          <div v-else class="w-full aspect-21/49"></div>
        </div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': loading }"
        @click="vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>{{ loading ? '投票中' : '投票！' }}</label>
      </button>
    </div>
    <MusicSelect
      v-model:open="musicSelectOpen"
      v-model:musicSelected="musics[musicsVotedNumber]"
      v-model:musicHonmeiSelected="musicHonmei"
      :music-honmei-is-selected="musicHonmeiIsSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import MusicSelect from '@/vote-music/components/MusicSelect.vue'
import MusicCard from '@/vote-music/components/MusicCard.vue'
import MusicHonmeiCard from '@/vote-music/components/MusicHonmeiCard.vue'
import { ref, computed } from 'vue'
import { Music } from '@/vote-music/lib/music'
import { music0 } from '@/vote-music/lib/voteData'
import { musicHonmei, musics } from '@/vote-music/lib/voteData'

const musicsReverse = computed<Music[]>(() => {
  const musicsCopy: Music[] = []
  musics.value.map((music) => {
    if (music.id != music0.id) musicsCopy.push(music)
  })
  return musicsCopy.reverse()
})
const musicsVotedNumber = computed<number>(() => musicsReverse.value.length)

const musicSelectOpen = ref(false)
const musicHonmeiIsSelected = ref(false)

const loading = ref(false)
async function vote(): Promise<void> {
  if (!window.confirm('确定要投票吗？（投票期间可随时更改）')) return
  loading.value = true
  alert('投票成功！')
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>
<style lang="postcss" scoped>
.musicHonmei-enter-active,
.musicHonmei-leave-active {
  @apply transition-all duration-200;
}

.musicHonmei-enter-from,
.musicHonmei-leave-to {
  @apply opacity-0;
}
.musicList-leave-active {
  @apply absolute;
  @apply max-w-30;
}

.musicList-enter,
.musicList-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
