<template>
  <div class="w-full"></div>
</template>
<script lang="ts" setup>
import { useQuery, gql } from '@/graphql'
import type { Query } from '@/graphql'
import { watch } from 'vue'
const { result } = useQuery<Query>(
  gql`
    query ($userToken: String!) {
      userTokenStatus(userToken: $userToken)
    }
  `,
  {
    userToken: localStorage.getItem('voteToken') || '',
  }
)
watch(result, (value) => {
  console.log(value)
})
</script>
<style lang="postcss" scoped></style>
