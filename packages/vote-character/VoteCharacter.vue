<template>
  <div class="p-2 shadow flex items-center">
    <div class="font-medium">第⑩届 国内东方人气投票 - 角色部门</div>
  </div>
  <div class="p-2 flex flex-wrap space-y-2 md:p-5 md:w-1/2 md:m-auto lg:w-1/3">
    <div class="p-1 rounded w-full shadow">
      <div class="p-1 flex justify-between">
        <div>本命角色(1/1)</div>
        <icon-uil-plus class="cursor-pointer"></icon-uil-plus>
      </div>
      <div class="p-2 rounded shadow-inner bg-gray-50 flex">
        <CharacterHonmeiCard v-model:character-honmei="characterHonmei" />
      </div>
    </div>
    <div class="p-1 rounded w-full shadow">
      <div class="p-1 flex justify-between">
        <div>我喜欢的角色(3/3)</div>
        <icon-uil-plus class="cursor-pointer"></icon-uil-plus>
      </div>
      <div class="p-2 rounded shadow-inner bg-gray-50 flex justify-between">
        <div class="w-3/10"><CharacterCard v-model:character="characterSecond" /></div>
        <div class="w-3/10"><CharacterCard v-model:character="characterThird" /></div>
        <div class="w-3/10"><CharacterCard v-model:character="characterFourth" /></div>
      </div>
    </div>
  </div>
  <CharacterSelect />
</template>

<script lang="ts" setup>
import CharacterSelect from './components/CharacterSelect.vue'
import CharacterCard from '@/vote-character/components/CharacterCard.vue'
import CharacterHonmeiCard from './components/CharacterHonmeiCard.vue'
import { ref } from 'vue'

const characterHonmei = ref<string>('none')
const characterSecond = ref<string>('none')
const characterThird = ref<string>('none')
const characterFourth = ref<string>('none')
</script>
