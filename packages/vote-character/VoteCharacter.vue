<template>
  <div class="p-2 shadow flex items-center">
    <div class="font-medium">第⑩届 国内东方人气投票 - 角色部门</div>
  </div>
  <div class="p-2 flex flex-wrap space-y-2">
    <div class="p-1 rounded w-full shadow">
      <div class="p-1">本命角色(1/1)</div>
      <div class="p-2 rounded shadow-inner bg-gray-50 flex space-x-1">
        <div class="w-1/3"><CharacterCard v-model:character="characterHonmei" /></div>
      </div>
    </div>
    <div class="p-1 rounded w-full shadow">
      <div class="p-1">我喜欢的角色(3/3)</div>
      <div class="p-2 rounded shadow-inner bg-gray-50 flex justify-between">
        <div class="w-3/10"><CharacterCard v-model:character="characterSecond" /></div>
        <div class="w-3/10"><CharacterCard v-model:character="characterThird" /></div>
        <div class="w-3/10"><CharacterCard v-model:character="characterFourth" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CharacterCard from '@/vote-character/components/CharacterCard.vue'
import { ref } from 'vue'

const characterHonmei = ref<string>('none')
const characterSecond = ref<string>('none')
const characterThird = ref<string>('none')
const characterFourth = ref<string>('none')
</script>
