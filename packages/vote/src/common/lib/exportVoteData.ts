/**
 * 临时投票数据导出工具
 * 
 * 注意：这是临时实现，数据从本地 localStorage 和现有状态管理中读取
 * 待后端 API 完成后，应该替换为真实的 GraphQL 查询
 * 
 * 预期后端 API：
 * query GetMyVoteData($voteToken: String!) {
 *   getMyVoteData(voteToken: $voteToken) {
 *     characters { id name first reason }
 *     music { id name first reason }
 *     couples { idA idB idC active first reason }
 *     doujins { id name circle reason }
 *     questionnaire { ... }
 *   }
 * }
 */

import { characters, characterHonmei } from '@/vote-character/lib/voteData'
import { charactersVoted } from '@/vote-character/lib/characterList'
import { characterList } from '@/vote-character/lib/characterList'
import { Character } from '@/vote-character/lib/character'
import { voteToken } from '@/home/lib/user'

/**
 * 获取角色投票数据用于导出
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
 * 模拟异步获取投票数据（待替换为真实 API）
 */
export async function exportVoteData() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    voteToken: voteToken.value,
    exportTime: new Date().toISOString(),
    characters: getExportCharacterData(),
    // TODO: 添加其他投票类型
    // music: [],
    // couples: [],
    // doujins: [],
    // questionnaire: {}
  }
}