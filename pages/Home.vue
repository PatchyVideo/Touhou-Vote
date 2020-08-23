<template>
  <div class="w-4/5 bg-gray-100 p-40 m-auto flex flex-col">
    <p>朋友，在投票前请先填写一下问卷吧！</p>
    <nuxt-link class="voteLink" to="/VotepageList">调查问卷</nuxt-link>
    <nuxt-link class="voteLink" to="/VotepageCharacter">人妖部门</nuxt-link>
    <nuxt-link class="voteLink" to="/VotepageTitle">作品部门</nuxt-link>
    <nuxt-link class="voteLink" to="/VotepageMusic">音乐部门</nuxt-link>
    <nuxt-link class="voteLink" to="/VotepageCouple">CP部门</nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="postcss" scoped>
.voteLink {
  @apply text-4xl;
  @apply my-2;
}
.voteLink:hover {
  @apply bg-gray-200;
}
</style>
