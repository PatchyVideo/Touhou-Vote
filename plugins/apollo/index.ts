import 'cross-fetch/polyfill'
import { provide, inject, defineNuxtPlugin, onGlobalSetup } from '@nuxtjs/composition-api'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  // QueryOptions,
  MutationOptions,
  from,
  HttpLink,
} from '@apollo/client/core'
import { withScalars } from 'apollo-link-scalars'
import { buildClientSchema, IntrospectionQuery } from 'graphql'
import jsonSchema from './__generated__/graphql.schema.json'

import * as schema from './__generated__/graphql'
export { schema }

export { gql } from '@apollo/client/core'

const clientSymbol = Symbol('apollo client Symbol')

export function createApollo() {
  const typesMap = {
    DateTimeUtc: {
      serialize: (parsed: Date) => parsed.toISOString(),
      parseValue: (raw: string | null): Date | null => {
        return raw ? new Date(raw) : null
      },
    },
  }
  const link = from([
    withScalars({ schema: buildClientSchema((jsonSchema as unknown) as IntrospectionQuery), typesMap }),
    // Backend Server
    new HttpLink({ uri: 'http://localhost:8080/graphql' }),
  ])
  const client = new ApolloClient({
    link,
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
