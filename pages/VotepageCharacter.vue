<template>
  <div class="w-4/5 bg-gray-100 p-20 mx-auto">
    <p class="text-6xl">第九届东方计划人气投票 人妖部门</p>
    <nuxt-link to="/home" target="_blank">点击我查看投票规则</nuxt-link>
    <p>请选择您的<strong>本命票</strong>：</p>
    <!-- <div v-for="(character, key, index) in Character" :key="index">
      <div>{{ key }}</div>
      <div v-for="(item, i) in character" :key="i">{{ item.name }}</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data() {
    return {
      // 问卷
      Questionnaire: Array(4),
    }
  },
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
