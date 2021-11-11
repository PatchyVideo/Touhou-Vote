<template>
  <div class="w-full"></div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
function IsInSameQuestionLibrary(ID1: number, ID2: number) {
  return Math.floor(ID1 / 10) === Math.floor(ID2 / 10)
}
console.log(IsInSameQuestionLibrary(11031, 11042))
</script>
<style lang="postcss" scoped></style>
