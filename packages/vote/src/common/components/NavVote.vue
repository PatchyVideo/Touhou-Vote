<template>
  <div class="baseBlock p-2 shadow flex items-center mb-2">
    <BackToHome :show="true" :saveable="false" />
    <div class="font-medium">{{ '第11届 中文东方人气投票 - ' + typeChinese }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import BackToHome from '@/common/components/BackToHome.vue'

const props = defineProps({
  VoteType: {
    type: String,
    validator: (value: string) => ['character', 'music', 'couple', 'doujin'].includes(value),
    default: 'character',
  },
})

const TypeChinese = [
  { name: '角色部门', value: 'character' },
  { name: '音乐部门', value: 'music' },
  { name: 'CP部门', value: 'couple' },
  { name: '作品提名', value: 'doujin' },
]
const typeChinese = computed(
  () => TypeChinese.find((item) => item.value === props.VoteType)?.name || TypeChinese[0].name
)
</script>
