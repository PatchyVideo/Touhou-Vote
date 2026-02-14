/**
 * 投票数据导出工具
 * 
 * 支持从 localStorage 或 GraphQL 获取数据，通过 voteDataSource.ts 统一管理
 * 
 * 使用方式：
 * 1. 设置数据源模式：setDataSourceMode('local' | 'graphql' | 'auto')
 * 2. 调用 exportVoteData() 导出数据
 */

import { characters, characterHonmei, characters as allCharacters } from '@/vote-character/lib/voteData'
import { charactersVoted } from '@/vote-character/lib/characterList'
import { characterList } from '@/vote-character/lib/characterList'
import { Character } from '@/vote-character/lib/character'
import { couples } from '@/vote-couple/lib/voteData'
import { Couple } from '@/vote-couple/lib/couple'
import { musics } from '@/vote-music/lib/voteData'
import { musicsVoted } from '@/vote-music/lib/musicList'
import { Music } from '@touhou-vote/shared/data/music'
import { voteToken } from '@/home/lib/user'
import { fetchVoteData, type DataSourceMode } from './voteDataSource'
import type { CharacterSubmitQuery, CpSubmitQuery, MusicSubmitQuery } from '@/graphql/__generated__/graphql'
import { character0 } from '@/vote-character/lib/character'
import { music0 } from '@/vote-music/lib/music'

/**
 * 获取角色投票数据用于导出（从 localStorage）
 * 
 * 只返回 id + reason + honmei
 * 注意：非本命角色不需要 reason（可选），只有本命角色需要填写
 * 其他信息（name, color, date, work, image）从 characterList 中读取
 */
export function getExportCharacterData() {
  // 获取已投票的角色（排除空票）
  const votedCharacters = charactersVoted.value.filter(char => char.id !== '0')
  
  // 只返回 id + reason + honmei
  // 非本命角色 reason 可以为空
  return votedCharacters.map(char => ({
    id: char.id,
    isHonmei: char.honmei,
    reason: char.honmei ? (char.reason || '') : ''
  }))
}

/**
 * 从指定数据源获取角色投票数据用于导出
 * 
 * @param dataSourceMode 数据源模式：'local' | 'graphql' | 'auto'
 * @returns 返回 { data: 角色投票数据数组, error: 错误信息, usedMode: 使用的模式 }
 */
export async function getExportCharacterDataFromDataSource(dataSourceMode?: DataSourceMode) {
  const result = await fetchVoteData<CharacterSubmitQuery>('character', dataSourceMode)

  if (result.usedMode === 'local') {
    const localData = getExportCharacterData()
    return {
      data: localData,
      error: result.error,
      usedMode: 'local',
    }
  }
  
  if (!result.data || result.data.length === 0) {
    // 如果没有数据，回退到本地存储
    const localData = getExportCharacterData()
    console.log('[getExportCharacterDataFromDataSource] 回退到本地数据:', localData)
    return {
      data: localData,
      error: result.error,
      usedMode: result.usedMode
    }
  }

  const mappedData = result.data.map((char) => ({
    id: char.id,
    isHonmei: char.first || false,
    reason: char.first ? (char.reason || '') : '',
  }))
  
  console.log('[getExportCharacterDataFromDataSource] GraphQL 数据映射结果:', mappedData)
  
  // 检查是否有本命角色
  const hasHonmei = mappedData.some(char => char.isHonmei)
  
  if (!hasHonmei && dataSourceMode !== 'local') {
    // 如果 GraphQL 返回的数据中没有本命角色，且不是强制使用 local 模式
    // 说明后端数据可能不完整，回退到本地数据
    const localData = getExportCharacterData()
    const localHasHonmei = localData.some(char => char.isHonmei)
    
    if (localHasHonmei) {
      console.log('[getExportCharacterDataFromDataSource] GraphQL 数据中没有本命角色，回退到本地数据')
      console.log('[getExportCharacterDataFromDataSource] 本地数据:', localData)
      return {
        data: localData,
        error: result.error || '后端数据不完整，已使用本地数据',
        usedMode: 'local'
      }
    }
  }
  
  return {
    data: mappedData,
    error: result.error,
    usedMode: result.usedMode
  }
}

/**
 * 获取CP投票数据用于导出（从 localStorage）
 * 
 * 只返回 idA, idB, idC, active, honmei, reason
 * 其他信息（name, color, date, work, image）从 characterList 中读取
 */
export function getExportCoupleData() {
  // 获取已投票的CP（排除无效CP）
  const votedCouples = couples.value.filter(couple => couple.valid)
  
  // 返回完整的CP数据（包含角色信息和seme索引）
  // 注意：active字段类型需要与GraphQL的Maybe<string>保持一致
  return votedCouples.map(couple => ({
    idA: couple.characters[0]?.id || '0',
    idB: couple.characters[1]?.id || '0',
    idC: couple.characters[2]?.id || '0',
    active: couple.seme >= 0 ? (couple.characters[couple.seme]?.id || null) : null,
    isHonmei: couple.honmei,
    reason: couple.reason || ''
  }))
}

/**
 * 从指定数据源获取CP投票数据用于导出
 * 
 * @param dataSourceMode 数据源模式：'local' | 'graphql' | 'auto'
 * @returns 返回 { data: CP投票数据数组, error: 错误信息, usedMode: 使用的模式 }
 */
export async function getExportCoupleDataFromDataSource(dataSourceMode?: DataSourceMode) {
  const result = await fetchVoteData<CpSubmitQuery>('couple', dataSourceMode)

  if (result.usedMode === 'local') {
    const localData = getExportCoupleData()
    return {
      data: localData,
      error: result.error,
      usedMode: 'local',
    }
  }
  
  if (!result.data || result.data.length === 0) {
    // 如果没有数据，回退到本地存储
    const localData = getExportCoupleData()
    console.log('[getExportCoupleDataFromDataSource] 回退到本地数据:', localData)
    return {
      data: localData,
      error: result.error,
      usedMode: result.usedMode
    }
  }

  const mappedData = result.data.map((cp) => ({
    idA: cp.idA,
    idB: cp.idB,
    idC: cp.idC || '0',
    active: cp.active,
    isHonmei: cp.first || false,
    reason: cp.reason || '',
  }))
  
  console.log('[getExportCoupleDataFromDataSource] GraphQL 数据映射结果:', mappedData)
  
  // 检查是否有本命CP
  const hasHonmei = mappedData.some(cp => cp.isHonmei)
  
  if (!hasHonmei && dataSourceMode !== 'local') {
    // 如果 GraphQL 返回的数据中没有本命CP，且不是强制使用 local 模式
    // 说明后端数据可能不完整，回退到本地数据
    const localData = getExportCoupleData()
    const localHasHonmei = localData.some(cp => cp.isHonmei)
    
    if (localHasHonmei) {
      console.log('[getExportCoupleDataFromDataSource] GraphQL 数据中没有本命CP，回退到本地数据')
      console.log('[getExportCoupleDataFromDataSource] 本地数据:', localData)
      return {
        data: localData,
        error: result.error || '后端数据不完整，已使用本地数据',
        usedMode: 'local'
      }
    }
  }
  
  return {
    data: mappedData,
    error: result.error,
    usedMode: result.usedMode
  }
}

/**
 * 获取音乐投票数据用于导出（从 localStorage）
 * 
 * 只返回 id + reason + honmei
 * 注意：非本命音乐不需要 reason（可选），只有本命音乐需要填写
 * 其他信息（name, origname, album, image）从 musicList 中读取
 */
export function getExportMusicData() {
  // 获取已投票的音乐（排除空票）
  const votedMusics = musics.value.filter(music => music.id !== '00000000')
  
  // 只返回 id + reason + honmei
  // 非本命音乐 reason 可以为空
  return votedMusics.map(music => ({
    id: music.id,
    isHonmei: music.honmei,
    reason: music.honmei ? (music.reason || '') : ''
  }))
}

/**
 * 从指定数据源获取音乐投票数据用于导出
 * 
 * @param dataSourceMode 数据源模式：'local' | 'graphql' | 'auto'
 * @returns 返回 { data: 音乐投票数据数组, error: 错误信息, usedMode: 使用的模式 }
 */
export async function getExportMusicDataFromDataSource(dataSourceMode?: DataSourceMode) {
  const result = await fetchVoteData<MusicSubmitQuery>('music', dataSourceMode)

  if (result.usedMode === 'local') {
    const localData = getExportMusicData()
    return {
      data: localData,
      error: result.error,
      usedMode: 'local',
    }
  }
  
  if (!result.data || result.data.length === 0) {
    // 如果没有数据，回退到本地存储
    const localData = getExportMusicData()
    console.log('[getExportMusicDataFromDataSource] 回退到本地数据:', localData)
    return {
      data: localData,
      error: result.error,
      usedMode: result.usedMode
    }
  }

  const mappedData = result.data.map((music) => ({
    id: music.id,
    isHonmei: music.first || false,
    reason: music.first ? (music.reason || '') : '',
  }))
  
  console.log('[getExportMusicDataFromDataSource] GraphQL 数据映射结果:', mappedData)
  
  // 检查是否有本命音乐
  const hasHonmei = mappedData.some(music => music.isHonmei)
  
  if (!hasHonmei && dataSourceMode !== 'local') {
    // 如果 GraphQL 返回的数据中没有本命音乐，且不是强制使用 local 模式
    // 说明后端数据可能不完整，回退到本地数据
    const localData = getExportMusicData()
    const localHasHonmei = localData.some(music => music.isHonmei)
    
    if (localHasHonmei) {
      console.log('[getExportMusicDataFromDataSource] GraphQL 数据中没有本命音乐，回退到本地数据')
      console.log('[getExportMusicDataFromDataSource] 本地数据:', localData)
      return {
        data: localData,
        error: result.error || '后端数据不完整，已使用本地数据',
        usedMode: 'local'
      }
    }
  }
  
  return {
    data: mappedData,
    error: result.error,
    usedMode: result.usedMode
  }
}
