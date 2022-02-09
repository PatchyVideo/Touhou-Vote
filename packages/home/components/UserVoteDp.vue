<template>
  <div>
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">参与投票</h2>
      <span class="text-gray-700">为你喜爱的角色/曲目/CP投上一票吧！</span>
    </div>
    <div class="flex flex-wrap gap-3 mt-1">
      <RouterLink
        v-for="(vote, voteId) in votes"
        class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 border-accent-color-400 cursor-pointer"
        :to="'/vote/' + voteId"
      >
        <img class="w-32 h-32 object-cover" :src="vote.image" />
        <div>
          <span
            v-if="vote.compelete.value"
            class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
            >已填写</span
          >
          <span v-else class="px-1 text-amber-600 rounded border border-amber-300 bg-amber-50 bg-opacity-50"
            >未填写</span
          >
          <h3 class="text-black text-2xl max-w-17ch" v-text="vote.name"></h3>
          <span class="text-gray-700" v-text="vote.desc"></span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { voteCharacterComplete, voteMusicComplete, voteCoupleComplete } from '../lib/user'

const votes = {
  character: {
    name: '角色部门',
    desc: '为喜欢的角色投票',
    image: 'https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png',
    compelete: voteCharacterComplete,
  },
  music: {
    name: '音乐部门',
    desc: '为喜欢的音乐投票',
    image: 'https://upload.thwiki.cc/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png',
    compelete: voteMusicComplete,
  },
  couple: {
    name: 'CP部门',
    desc: '为喜欢的角色组合投票',
    image: 'https://upload.thwiki.cc/0/02/THBWiki-LOGO-%E4%B8%89%E6%9C%88%E7%B2%BE.png',
    compelete: voteCoupleComplete,
  },
}
</script>
