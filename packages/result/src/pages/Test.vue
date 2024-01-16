<template>
  <div>{{ getIDtoCharacterName() }}</div>
  <div>{{ getIDtoMusicName() }}</div>
</template>
<script lang="ts" setup>
import { getIDtoCharacterName, getIDtoMusicName } from '@/lib/getIDtoName'
</script>
