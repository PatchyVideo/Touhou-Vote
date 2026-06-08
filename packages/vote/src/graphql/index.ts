/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, provide } from 'vue'
import type { NormalizedCacheObject } from '@apollo/client/core'
import { ApolloClient, HttpLink, InMemoryCache, disableFragmentWarnings, from } from '@apollo/client/core'
import { mergeDeep } from '@apollo/client/utilities'
import RawObjectID from 'bson-objectid'
import { DefaultApolloClient, useQuery as vUseQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'

import { API_PREFIX } from '@/common/lib/apiPrefix'
import scalarTypePolicies from './__generated__/typePolicies'
import generatedIntrospection from './__generated__/graphql.fragment'

import type * as schema from './__generated__/graphql'
export type { schema }
export type Query = schema.Query
export type Mutation = schema.Mutation
export type Subscription = schema.Subscription

export { gql } from '@apollo/client/core'

// eslint-disable-next-line import/export
export * from '@vue/apollo-composable'

disableFragmentWarnings()

export class ObjectID extends RawObjectID {
  toJSON() {
    return this.toHexString()
  }
}

export function createApollo(): ApolloClient<NormalizedCacheObject> {
  const link = from([
    // Backend Server
    new HttpLink({
      uri: `${API_PREFIX}/graphql`,
      credentials: 'include',
    }),
  ])
  const cache = new InMemoryCache({
    possibleTypes: generatedIntrospection.possibleTypes,
    typePolicies: mergeDeep(scalarTypePolicies, {}),
  })
  const client = new ApolloClient({
    link,
    cache,
  })
  return client
}

export function provideClient(client: ApolloClient<NormalizedCacheObject>): void {
  provide(DefaultApolloClient, client)
}

export function injectClient(): ApolloClient<NormalizedCacheObject> {
  const client = inject<ApolloClient<NormalizedCacheObject>>(DefaultApolloClient)
  return client || createApollo()
}

export function useApollo(): ApolloClient<NormalizedCacheObject> {
  const client = injectClient()
  return client
}

// eslint-disable-next-line import/export
export const useQuery = function useQuery(this: never, ...args: never) {
  const query = vUseQuery.apply(this, args)

  // force refetch new queries
  query.result.value = undefined
  query.loading.value = true
  query.restart()

  // log all errors
  query.onError((error) => {
    logErrorMessages(error)
  })

  return query
} as typeof vUseQuery
