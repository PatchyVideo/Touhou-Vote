import 'cross-fetch/polyfill'
import { provide, inject, defineNuxtPlugin, onGlobalSetup } from '@nuxtjs/composition-api'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  // QueryOptions,
  MutationOptions,
} from '@apollo/client/core'
import * as schema from './__generated__/graphql'
export { schema }

export { gql } from '@apollo/client/core'

const clientSymbol = Symbol('apollo client Symbol')

export function createApollo() {
  const client = new ApolloClient({
    uri: 'http://127.0.0.1:8080/graphql',
    cache: new InMemoryCache(),
  })
  provideClient(client)
}

function provideClient(client: ApolloClient<NormalizedCacheObject>) {
  provide(clientSymbol, client)
}

function injectClient() {
  return <ApolloClient<NormalizedCacheObject>>inject(clientSymbol)!
}

export function useApollo() {
  const client = injectClient()
  return client
}

// export async function useQuery(options: QueryOptions) {
//   const client = injectClient()
//   return await client.query<schema.QueryRoot>(options)
// }

export async function useMutation(options: MutationOptions<schema.MutationRoot>) {
  const client = injectClient()
  return await client.mutate<schema.MutationRoot>(options)
}

export default defineNuxtPlugin(() => {
  onGlobalSetup(() => {
    createApollo()
  })
})
