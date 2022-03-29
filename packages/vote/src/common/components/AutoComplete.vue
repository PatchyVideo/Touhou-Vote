<template>
  <div class="shadow rounded h-7 w-full flex justify-start items-center">
    <icon-uil-search class="flex-shrink-0 inline ml-2 mr-1" />
    <input v-model="searchContent" class="nline-block h-full outline-none w-full rounded" @keydown.enter="search()" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { keyword as keywordCharacter } from '@/vote-character/lib/characterList'
import { keyword as keywordMusic } from '@/vote-music/lib/musicList'

const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => {
      return ['character', 'music'].indexOf(value) !== -1
    },
    default: 'character',
  },
})

const searchContent = ref<string>(props.type === 'character' ? keywordCharacter.value : keywordMusic.value)

function search(): void {
  searchContent.value = searchContent.value.trim()
  props.type === 'character'
    ? (keywordCharacter.value = searchContent.value)
    : (keywordMusic.value = searchContent.value)
}
</script>
