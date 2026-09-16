/**
 * 投票对象资源统一加载层（vote / result 共用）。
 *
 * 0019 起后端 `GET /api/v1/vote-objects/{characters|music}` 直接下发
 * imageUrl / aliases / musicUrl / include 等字段，前端不再按 name 到
 * shared/data 静态表里匹配资源 URL。
 *
 * 本模块只做「请求 + 解析 + 建索引」，不含任何框架依赖：
 * - vote 页：传 `${API_PREFIX}/vote-objects`（vite 代理 /v12-be）
 * - result 页：传 `/res-be/api/v1/vote-objects`（nginx /res-be → 后端根路径）
 */

export interface VoteObjectItem {
  candidateId: number
  name: string
  nameJp: string
  type: string
  firstAppearance: string | null
  workIds: number[]
  workTypes: string[]
  /** 资源类字段（后端 0019） */
  imageUrl: string | null
  aliases: string[]
  /** 仅 music */
  musicUrl?: string | null
  include?: string[]
}

export interface VoteObjectFilterMeta {
  kinds: { type: string; label: string }[]
  works: { workId: number; name: string; type: string }[]
}

export interface VoteObjectGroup<T> {
  group: string
  items: T[]
}

export interface VoteObjectsResponse<T = VoteObjectItem> {
  voteYear: number
  groups: VoteObjectGroup<T>[]
  filterMeta: VoteObjectFilterMeta
  aliasMap: Record<string, number>
}

export type VoteObjectCategory = 'characters' | 'music'

export function voteObjectsUrl(
  base: string,
  category: VoteObjectCategory,
  voteYear: number,
): string {
  return `${base.replace(/\/$/, '')}/${category}?vote_year=${voteYear}`
}

export async function fetchVoteObjects<T = VoteObjectItem>(
  url: string,
  init?: RequestInit,
): Promise<VoteObjectsResponse<T>> {
  const res = await fetch(url, { credentials: 'include', ...(init || {}) })
  if (!res.ok) throw new Error(`vote-objects HTTP ${res.status}`)
  const data = (await res.json()) as VoteObjectsResponse<T>
  if (!Array.isArray(data.groups) || !data.filterMeta) {
    throw new Error('vote-objects 响应结构不完整')
  }
  return data
}

export function flattenItems<T>(resp: VoteObjectsResponse<T>): T[] {
  return resp.groups.flatMap((g) => g.items)
}

export function indexByName<T extends { name: string }>(
  items: T[],
): Map<string, T> {
  const map = new Map<string, T>()
  for (const item of items) map.set(item.name, item)
  return map
}
