<template>
  <div>
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">参与投票</h2>
      <span>为您喜爱的角色/曲目/CP投上一票吧！</span>
    </div>
    <div class="flex flex-wrap gap-3 mt-1">
      <RouterLink
        v-for="(vote, voteId) in votes"
        :key="voteId"
        class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 cursor-pointer border-accent-color-300 hover:shadow hover:border-accent-color-600 transition-all ease-in-out"
        :to="'/vote/' + voteId"
      >
        <img class="w-32 h-32 object-cover" :src="vote.image" />
        <div>
          <CompleteTag :complete="vote.compelete.value" />
          <h3 class="text-2xl max-w-17ch" v-text="vote.name"></h3>
          <span v-text="vote.desc"></span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { username, voteCharacterComplete, voteCoupleComplete, voteMusicComplete } from '../lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import CompleteTag from '@/home/components/CompleteTag.vue'

setSiteTitle(String(username.value))

const votes = {
  character: {
    name: '角色部门',
    desc: '为喜欢的角色投票',
    image: 'https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png',
    compelete: voteCharacterComplete,
  },
  music: {
    name: '音乐部门',
    desc: '为喜欢的音乐投票',
    image: 'https://asset.lilywhite.cc/thvote/imgs/nav/music@100px.png',
    compelete: voteMusicComplete,
  },
  couple: {
    name: 'CP部门',
    desc: '为喜欢的角色组合投票',
    image: 'https://asset.lilywhite.cc/thvote/imgs/nav/couple@100px.png',
    compelete: voteCoupleComplete,
  },
}
</script>
