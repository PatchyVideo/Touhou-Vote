/* eslint-disable @typescript-eslint/no-explicit-any */
import { provide, inject } from 'vue'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  from,
  HttpLink,
  disableFragmentWarnings,
  FieldFunctionOptions,
} from '@apollo/client/core'
import type { SafeReadonly } from '@apollo/client/cache/core/types/common'
import { offsetLimitPagination } from '@apollo/client/utilities'
import ObjectID from 'bson-objectid'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { withScalars } from 'apollo-link-scalars'
import { buildClientSchema, IntrospectionQuery } from 'graphql'
import jsonSchema from './__generated__/graphql.schema.json'
import generatedIntrospection from './__generated__/graphql.fragment'

import type * as schema from './__generated__/graphql'
export type { schema }
export type Query = schema.Query
export type Mutation = schema.Mutation
export type Subscription = schema.Subscription

export { gql } from '@apollo/client/core'

import { useQuery as vUseQuery } from '@vue/apollo-composable'
export * from '@vue/apollo-composable'

disableFragmentWarnings()

export function createApollo(): ApolloClient<NormalizedCacheObject> {
  const typesMap = {
    DateTimeUtc: {
      serialize: (parsed: Date) => parsed.toISOString(),
      parseValue: (raw: string | null): Date | null => (raw ? new Date(raw) : null),
    },
    UtcDateTime: {
      serialize: (parsed: Date) => parsed.toISOString(),
      parseValue: (raw: string | null): Date | null => (raw ? new Date(raw) : null),
    },
    ObjectId: {
      serialize: (parsed: ObjectID) => parsed.toHexString(),
      parseValue: (raw: string) => new ObjectID(raw),
    },
  }
  const link = from([
    // Backend Server
    withScalars({
      schema: buildClientSchema(jsonSchema as unknown as IntrospectionQuery),
      typesMap,
    }),
    new HttpLink({
      uri: 'https://touhou.ai/graphql',
      credentials: 'include',
    }),
  ])
  const childOffsetLimitPara = (tagName: string) => ({
    read(existing: SafeReadonly<any> | undefined, { args }: FieldFunctionOptions): any {
      if (!args) throw new Error('')
      return (
        existing && {
          ...existing,
          [tagName]: existing[tagName].slice(args.para.offset, args.para.offset + args.para.limit),
        }
      )
    },
    merge(
      existing: SafeReadonly<any> | undefined,
      incoming: SafeReadonly<any>,
      { args, mergeObjects }: FieldFunctionOptions
    ): any {
      return {
        ...mergeObjects(existing, incoming),
        [tagName]: (() => {
          const merged = existing ? existing[tagName].slice(0) : []
          if (args) {
            // Assume an offset of 0 if args.offset omitted.
            const { offset = 0 } = args.para
            for (let i = 0; i < incoming[tagName].length; ++i) {
              merged[offset + i] = incoming[tagName][i]
            }
          }
          return merged
        })(),
      }
    },
  })
  const selfOffsetLimitPara = () => ({
    read(existing: SafeReadonly<any> | undefined, { args }: FieldFunctionOptions): any {
      if (!args) throw new Error('')
      return existing && existing.slice(args.para.offset, args.para.offset + args.para.limit)
    },
    merge(existing: SafeReadonly<any> | undefined, incoming: SafeReadonly<any>, { args }: FieldFunctionOptions): any {
      const merged = existing ? existing.slice(0) : []
      if (args) {
        // Assume an offset of 0 if args.offset omitted.
        const { offset = 0 } = args.para
        for (let i = 0; i < incoming.length; ++i) {
          merged[offset + i] = incoming[i]
        }
      }
      return merged
    },
  })
  const cache = new InMemoryCache({
    possibleTypes: generatedIntrospection.possibleTypes,
    typePolicies: {
      Query: {
        fields: {},
      },
    },
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

export const useQuery = function useQuery(this: never, ...args: never) {
  const query = vUseQuery.apply(this, args)

  // `fetchMore` doesn't automatically change loading state, but changing it makes more sense
  const fetchMore = query.fetchMore
  query.fetchMore = function (this: never, ...args: never) {
    query.loading.value = true
    const fm = fetchMore.apply(this, args)
    if (fm) {
      fm.then(() => (query.loading.value = false))
    } else {
      query.loading.value = false
    }
    return fm
  } as typeof query.fetchMore

  // force refetch new queries
  query.result.value = undefined
  query.loading.value = true
  query.restart()

  return query
} as typeof vUseQuery
