<template>
  <div class="shadow rounded h-7 w-full flex justify-start items-center">
    <icon-uil-search class="flex-shrink-0 inline ml-2 mr-1" />
    <input
      v-model="searchContent"
      class="nline-block h-full outline-none dark:bg-gray-800 w-full rounded"
      @keydown.enter="search()"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { keyword as keywordCharacter } from '@/vote-character/lib/characterList'

const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => {
      return ['character', 'music'].indexOf(value) !== -1
    },
    default: 'character',
  },
})

const searchContent = ref(props.type === 'character' ? keywordCharacter : '')

function search(): void {
  searchContent.value = searchContent.value.trim()
  props.type === 'character' ? (keywordCharacter.value = searchContent.value) : ''
}
</script>
<style lang="postcss" scoped></style>
