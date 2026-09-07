<!--
  首页的「分享我的投票」常驻入口。
  只列出已经投完的部门——没投过的部门点进去只会得到「你还没有投票数据」，
  与其让用户撞一次墙，不如不显示。三个部门都没投完时整块不渲染。
-->
<template>
  <div v-if="hasAnyVote" class="space-y-1">
    <div class="flex flex-nowrap items-end gap-2">
      <h2 class="text-xl">分享我的投票</h2>
      <span class="text-sm">把你的选择做成图片发出去</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <ExportCharacterVoteImage v-if="voteCharacterComplete" />
      <ExportMusicVoteImage v-if="voteMusicComplete" />
      <ExportCoupleVoteImage v-if="voteCoupleComplete" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { voteCharacterComplete, voteCoupleComplete, voteMusicComplete } from '@/home/lib/user'
import ExportCharacterVoteImage from '@/common/components/ExportCharacterVoteImage.vue'
import ExportMusicVoteImage from '@/common/components/ExportMusicVoteImage.vue'
import ExportCoupleVoteImage from '@/common/components/ExportCoupleVoteImage.vue'

const hasAnyVote = computed(
  () => voteCharacterComplete.value || voteMusicComplete.value || voteCoupleComplete.value
)
</script>
