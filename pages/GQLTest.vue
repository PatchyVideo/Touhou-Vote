<template>
  <div class="w-4/5 bg-gray-100 p-40 m-auto">
    <div>Returns: {{ apiVersion }}; ServerDate: {{ serverDate.toDateString() }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useMutation, gql } from '@/plugins/apollo'

export default defineComponent({
  setup() {
    const apiVersion = ref('')
    const serverDate = ref(new Date())

    onMounted(async () => {
      const result = await useMutation({
        mutation: gql`
          mutation {
            apiVersion
            serverDate
          }
        `,
      })
      apiVersion.value = result.data?.apiVersion || 'unknown'
      serverDate.value = result.data?.serverDate || new Date('0000')
    })

    return { apiVersion, serverDate }
  },
})
</script>
