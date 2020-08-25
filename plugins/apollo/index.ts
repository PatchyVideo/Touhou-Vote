import 'cross-fetch/polyfill'
import { provide, inject, defineNuxtPlugin, onGlobalSetup } from '@nuxtjs/composition-api'
import { ApolloClient, InMemoryCache, NormalizedCacheObject, QueryOptions, MutationOptions, from, HttpLink, gql } from '@apollo/client/core'

import characters from './voteData/2020/Character'
import games from './voteData/2020/Games'

import * as schema from './__generated__/graphql'
export { schema }

export { gql } from '@apollo/client/core'

const clientSymbol = Symbol('apollo client Symbol')

export function createApollo() {
  const link = from([
    // Backend Server
    new HttpLink({ uri: 'http://localhost:8080/graphql' }),
  ])
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          frontendInfo(existing) {
            return existing
          },
        },
      },
      FEFrontendInfo: {
        fields: {
          voteData2020(existing) {
            return existing
          },
        },
      },
      FEVoteData2020: {
        fields: {
          characters(existing, { args, cache, toReference }) {
            if (existing) return existing
            let charArray: schema.FeCharacter[] = cache.readQuery<schema.QueryRoot>({
              query: gql`
                query {
                  frontendInfo {
                    voteData2020 {
                      characters {
                        name
                      }
                    }
                  }
                }
              `,
            })?.frontendInfo.voteData2020.characters!
            if (args?.name) {
              charArray = charArray.filter((char) => char.name === args.name)
            }
            return charArray.map((char) => toReference({ __typename: 'FECharacter', name: char.name }))
          },
          games(existing, { args, cache, toReference }) {
            if (existing) return existing
            let gameArray: schema.FeGame[] = cache.readQuery<schema.QueryRoot>({
              query: gql`
                query {
                  frontendInfo {
                    voteData2020 {
                      games {
                        name
                      }
                    }
                  }
                }
              `,
            })?.frontendInfo.voteData2020.games!
            if (args?.name) {
              gameArray = gameArray.filter((game) => game.name === args.name)
            }
            return gameArray.map((game) => toReference({ __typename: 'FEGame', name: game.name }))
          },
        },
      },
      FECharacter: {
        keyFields: ['name'],
        fields: {
          appeared(existing: string[], { toReference }) {
            return existing.map((gamename) => toReference({ __typename: 'FEGame', name: gamename }))
          },
        },
      },
      FEGame: {
        keyFields: ['name'],
        fields: {
          people(existing: string[], { toReference }) {
            return existing.map((charname) => toReference({ __typename: 'FECharacter', name: charname }))
          },
        },
      },
    },
  })
  cache.writeQuery({
    query: gql`
      query {
        frontendInfo {
          voteData2020 {
            characters {
              name
              group
              appeared
              keywords
              image
            }
            games {
              name
              type
              date
              keywords
              image
              people
            }
          }
        }
      }
    `,
    data: {
      frontendInfo: {
        __typename: 'FEFrontendInfo',
        voteData2020: {
          __typename: 'FEVoteData2020',
          characters: characters.map((char) => {
            const character = {
              ...char,
              __typename: 'FECharacter',
            }
            return character
          }),
          games: games.map((game) => {
            const gameq = {
              ...game,
              __typename: 'FEGame',
            }
            return gameq
          }),
        },
      },
    },
  })
  const client = new ApolloClient({
    link,
    cache,
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
  const query = async (options: QueryOptions) => {
    return await client.query<schema.QueryRoot>(options)
  }
  const mutate = async (options: MutationOptions<schema.MutationRoot>) => {
    return await client.mutate<schema.MutationRoot>(options)
  }
  return { client, query, mutate }
}

export default defineNuxtPlugin(() => {
  onGlobalSetup(() => {
    createApollo()
  })
})
