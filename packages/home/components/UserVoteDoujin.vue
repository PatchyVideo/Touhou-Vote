<template>
  <div>
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">参与提名</h2>
      <span class="text-gray-700"></span>
    </div>
    <div class="flex flex-wrap gap-3 mt-1">
      <RouterLink
        v-for="(vote, voteId) in votes"
        class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 border-accent-color-400 cursor-pointer"
        :to="'/' + voteId"
      >
        <img class="w-32 h-32 object-contain" :src="vote.image" />
        <div>
          <span
            v-if="vote.compelete.value"
            class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
            >已填写</span
          >
          <span v-else class="px-1 text-amber-600 rounded border border-amber-300 bg-amber-50 bg-opacity-50"
            >未填写</span
          >
          <div class="flex items-center text-black text-2xl">
            <label class="text-accent-color-600">(NEW)</label>
            <h3 class="max-w-17ch" v-text="vote.name"></h3>
          </div>
          <span class="text-gray-700" v-text="vote.desc"></span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { voteDoujinComplete } from '@/home/lib/user'

const votes = {
  doujin: {
    name: '提名系统',
    desc: '新系统，为自己喜爱的同人作品提名！',
    image: 'https://upload.thwiki.cc/f/f1/ConstructionClock.png',
    compelete: voteDoujinComplete,
  },
}
</script>
