<template>
  <div class="w-4/5 bg-gray-100 p-40 m-auto">
    <div>Returns: {{ apiVersion }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useMutation, gql } from '@/plugins/apollo'

export default defineComponent({
  setup() {
    const apiVersion = ref('')

    onMounted(async () => {
      const result = await useMutation({
        mutation: gql`
          mutation {
            apiVersion
          }
        `,
      })
      apiVersion.value = result.data?.apiVersion || 'unknown'
    })

    return { apiVersion }
  },
})
</script>
