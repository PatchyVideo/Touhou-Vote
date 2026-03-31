/**
 * 统一数据访问层
 * 
 * 提供统一的接口来获取投票数据，支持从 localStorage 或 GraphQL 获取
 * 
 * 使用方式：
 * 1. 设置数据源模式：setDataSourceMode('local' | 'graphql' | 'auto')
 * 2. 获取数据：fetchVoteData('character') 或 fetchVoteData('music')
 */

import { ref } from 'vue'
import { createApollo } from '@/graphql'
import { gql } from '@apollo/client/core'
import type { Query, CharacterSubmitQuery } from '@/graphql/__generated__/graphql'
import { voteToken } from '@/home/lib/user'

/**
 * 数据源模式
 */
export type DataSourceMode = 'local' | 'graphql' | 'auto'

/**
 * 当前数据源模式（全局配置）
 */
const dataSourceMode = ref<DataSourceMode>('auto')
const apolloClient = createApollo()

/**
 * 设置数据源模式
 * @param mode 'local' - 强制使用本地存储
 *              'graphql' - 强制使用 GraphQL
 *              'auto' - 优先使用 GraphQL，失败时回退到本地存储
 */
export function setDataSourceMode(mode: DataSourceMode) {
  dataSourceMode.value = mode
}

/**
 * 获取当前数据源模式
 */
export function getDataSourceMode(): DataSourceMode {
  return dataSourceMode.value
}

/**
 * 投票数据类型
 */
export type VoteDataType = 'character' | 'music' | 'couple' | 'doujin' | 'questionnaire'

/**
 * 从本地存储获取投票数据
 */
function fetchFromLocalStorage<T>(key: string): T[] | null {
  try {
    const data = localStorage.getItem(key)
    if (!data) return null
    const parsed = JSON.parse(data)
    // 检查是否是空数组
    if (JSON.stringify(parsed) === '[]') return null
    return parsed as T[]
  } catch (error) {
    console.error(`读取本地存储失败 (${key}):`, error)
    return null
  }
}

/**
 * GraphQL 查询定义
 */
const GRAPHQL_QUERIES = {
  character: gql`
    query ($voteToken: String!) {
      getSubmitCharacterVote(voteToken: $voteToken) {
        characters {
          id
          first
          reason
        }
      }
    }
  `,
  music: gql`
    query ($voteToken: String!) {
      getSubmitMusicVote(voteToken: $voteToken) {
        music {
          id
          first
          reason
        }
      }
    }
  `,
  couple: gql`
    query ($voteToken: String!) {
      getSubmitCPVote(voteToken: $voteToken) {
        cps {
          idA
          idB
          idC
          active
          first
          reason
        }
      }
    }
  `,
  doujin: gql`
    query ($voteToken: String!) {
      getSubmitDojinVote(voteToken: $voteToken) {
        dojins {
          author
          dojinType
          imageUrl
          reason
          title
          url
        }
      }
    }
  `,
  questionnaire: gql`
    query ($voteToken: String!) {
      getSubmitPaperVote(voteToken: $voteToken) {
        papersJson
      }
    }
  `
} as const

/**
 * GraphQL 结果映射函数
 */
const extractGraphQLData = {
  character: (result: Query) => result.getSubmitCharacterVote?.characters || [],
  music: (result: Query) => result.getSubmitMusicVote?.music || [],
  couple: (result: Query) => result.getSubmitCPVote?.cps || [],
  doujin: (result: Query) => result.getSubmitDojinVote?.dojins || [],
  questionnaire: (result: Query) => {
    const json = result.getSubmitPaperVote?.papersJson
    if (!json) return []
    try {
      return JSON.parse(json)
    } catch {
      return []
    }
  }
}

/**
 * 从 GraphQL 获取投票数据
 * 
 * @returns 返回 { data: T[] | null, error: string | null }
 */
async function fetchFromGraphQL<T>(dataType: VoteDataType): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const query = GRAPHQL_QUERIES[dataType]
    if (!query) {
      console.error(`不支持的投票类型: ${dataType}`)
      return { data: null, error: '不支持的投票类型' }
    }

    const result = await apolloClient.query<Query>({
      query,
      variables: { voteToken: voteToken.value },
      fetchPolicy: 'network-only',
    })
    const data = extractGraphQLData[dataType](result.data)

    // 严格检查：数据必须非空
    if (!data || data.length === 0) {
      console.warn(`GraphQL 返回空数据 (${dataType})`)
      return { data: null, error: null }
    }
    
    // 严格检查：对于角色投票，必须有本命角色
    if (dataType === 'character') {
      const hasHonmei = (data as any[]).some((char: any) => char.first === true)
      if (!hasHonmei) {
        console.error(`GraphQL 返回的角色投票数据没有本命角色 (${dataType})，数据可能不完整或 token 无效`)
        return { 
          data: null, 
          error: '投票数据不完整（缺少本命角色），请重新登录或检查您的投票状态'
        }
      }
    }

    return { data: data as T[], error: null }
  } catch (error: any) {
    console.error(`从 GraphQL 获取数据失败 (${dataType}):`, error)
    
    // 尝试识别错误类型
    let errorMessage = '获取数据失败'
    
    // 检查是否是认证/token 相关错误
    const errorMsg = error.message || ''
    const graphQLErrors = error.graphQLErrors || []
    
    if (errorMsg.toLowerCase().includes('unauthorized') ||
        errorMsg.toLowerCase().includes('token') ||
        errorMsg.toLowerCase().includes('auth') ||
        graphQLErrors.some((e: any) => 
          e.message?.toLowerCase().includes('token') ||
          e.message?.toLowerCase().includes('unauthorized')
        )) {
      errorMessage = '无效的 voteToken，请检查您的登录状态'
    } else if (error.networkError) {
      errorMessage = '网络连接失败，请检查网络连接'
    } else if (errorMsg) {
      errorMessage = `服务器错误: ${errorMsg}`
    }
    
    return { data: null, error: errorMessage }
  }
}

/**
 * 统一获取投票数据
 * 
 * @param dataType 投票类型
 * @param forceMode 强制指定数据源模式（可选）
 * @returns 返回 { data: T[] | null, error: string | null, usedMode: string }
 *          - data: 投票数据，如果获取失败返回 null
 *          - error: 错误信息，如果没有错误返回 null
 *          - usedMode: 实际使用的数据源模式 ('local' | 'graphql' | 'null')
 */
export async function fetchVoteData<T>(
  dataType: VoteDataType,
  forceMode?: DataSourceMode
): Promise<{ data: T[] | null; error: string | null; usedMode: 'local' | 'graphql' | null }> {
  const mode = forceMode ?? dataSourceMode.value
  const localStorageKeyMap: Record<VoteDataType, string> = {
    character: 'characters',
    music: 'musics',
    couple: 'couples',
    doujin: 'doujins',
    questionnaire: 'questionnaireDataLocal',
  }
  const localStorageKey = localStorageKeyMap[dataType]

  // 模式：强制使用本地存储
  if (mode === 'local') {
    const localData = fetchFromLocalStorage<T>(localStorageKey)
    return { data: localData, error: null, usedMode: 'local' }
  }

  // 模式：强制使用 GraphQL
  if (mode === 'graphql') {
    const { data: graphqlData, error: graphqlError } = await fetchFromGraphQL<T>(dataType)
    
    if (graphqlData) {
      return { data: graphqlData, error: null, usedMode: 'graphql' }
    }
    
    // 如果 GraphQL 失败，尝试本地存储作为后备
    console.warn(`GraphQL 获取失败 (${graphqlError})，尝试本地存储 (${dataType})`)
    const localData = fetchFromLocalStorage<T>(localStorageKey)
    return { data: localData, error: graphqlError, usedMode: localData ? 'local' : null }
  }

  // 模式：自动（优先 GraphQL，失败则本地存储）
  if (mode === 'auto') {
    // 先尝试本地存储，如果有数据则直接返回（离线优先）
    const localData = fetchFromLocalStorage<T>(localStorageKey)
    if (localData) {
      return { data: localData, error: null, usedMode: 'local' }
    }
    
    // 尝试 GraphQL
    const { data: graphqlData, error: graphqlError } = await fetchFromGraphQL<T>(dataType)
    
    // 如果 GraphQL 成功，返回 GraphQL 数据
    if (graphqlData) {
      return { data: graphqlData, error: null, usedMode: 'graphql' }
    }
    
    // 否则返回本地存储数据
    return { data: localData, error: graphqlError, usedMode: localData ? 'local' : null }
  }

  return { data: null, error: '未知的数据源模式', usedMode: null }
}

/**
 * 重置数据源模式为默认值
 */
export function resetDataSourceMode() {
  dataSourceMode.value = 'auto'
}

// 导出类型
export type { CharacterSubmitQuery, MusicSubmitQuery, CpSubmitQuery, DojinSubmitQuery } from '@/graphql/__generated__/graphql'
