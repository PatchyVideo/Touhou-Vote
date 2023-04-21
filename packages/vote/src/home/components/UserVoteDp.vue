<template>
  <div>
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">参与投票</h2>
      <span class="text-gray-700">为您喜爱的角色/曲目/CP投上一票吧！</span>
    </div>
    <div class="flex flex-wrap gap-3 mt-1">
      <RouterLink
        v-for="(vote, voteId) in votes"
        :key="voteId"
        class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 border-accent-color-400 cursor-pointer"
        :to="'/vote/' + voteId"
      >
        <img class="w-32 h-32 object-cover" :src="vote.image" />
        <div>
          <span
            v-if="vote.compelete.value"
            class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
            >已投票</span
          >
          <span v-else class="px-1 text-amber-600 rounded border border-amber-300 bg-amber-50 bg-opacity-50"
            >未投票</span
          >
          <h3 class="text-black text-2xl max-w-17ch" v-text="vote.name"></h3>
          <span class="text-gray-700" v-text="vote.desc"></span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { voteCharacterComplete, voteCoupleComplete, voteMusicComplete, username } from '../lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle(username.value + ' - 第⑩回 中文东方人气投票')

const votes = {
  character: {
    name: '角色部门',
    desc: '为喜欢的角色投票',
    image: 'https://s3c.lilywhite.cc/thvote/imgs/nav/character@100px.png',
    compelete: voteCharacterComplete,
  },
  music: {
    name: '音乐部门',
    desc: '为喜欢的音乐投票',
    image: 'https://s3c.lilywhite.cc/thvote/imgs/nav/music@100px.png',
    compelete: voteMusicComplete,
  },
  couple: {
    name: 'CP部门',
    desc: '为喜欢的角色组合投票',
    image: 'https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png',
    compelete: voteCoupleComplete,
  },
}
</script>
