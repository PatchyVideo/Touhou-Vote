<template>
  <div class="w-4/5 bg-gray-100 p-40 m-auto">
    <div>Returns: {{ apiVersion }}; ServerDate: {{ serverDate.toDateString() }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useApollo, gql } from '@/plugins/apollo'

export default defineComponent({
  setup() {
    const apiVersion = ref('')
    const serverDate = ref(new Date())

    const apollo = useApollo()

    onMounted(async () => {
      const resultq = await apollo.query({
        query: gql`
          query {
            frontendInfo @client {
              voteData2020 {
                allchar: characters {
                  name
                  appeared {
                    name
                  }
                }
                reimu_by_name: characters(name: "博丽灵梦") {
                  name
                  appeared {
                    name
                    people {
                      name
                    }
                  }
                }
                games {
                  name
                  date
                }
              }
            }
          }
        `,
      })
      console.log(apollo.client, resultq)
      const resultm = await apollo.mutate({
        mutation: gql`
          mutation {
            apiVersion
            serverDate
          }
        `,
      })
      apiVersion.value = resultm.data?.apiVersion || 'unknown'
      serverDate.value = new Date(resultm.data?.serverDate || '0000')
    })

    return { apiVersion, serverDate }
  },
})
</script>
