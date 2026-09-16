/**
 * 结果页资源索引：从后端 vote-objects REST 拉取一次，建立
 * name → imageUrl 映射与全量名称列表（取代原 shared/data 静态表）。
 *
 * 走现有 nginx/vite 的 /res-be 前缀（→ 后端根路径），
 * 与 GraphQL `/res-be/graphql` 同源，无需新增代理。
 */
import { voteYear } from '@/lib/voteYear'
import {
  fetchVoteObjects,
  flattenItems,
  voteObjectsUrl,
  type VoteObjectItem,
} from '@touhou-vote/shared/api/voteObjects'

const BASE = '/res-be/api/v1/vote-objects'

interface ResourceIndex {
  characterImage: Map<string, string>
  musicImage: Map<string, string>
  characterNames: string[]
  musicNames: string[]
}

let index: ResourceIndex | null = null
let inflight: Promise<ResourceIndex> | null = null

function buildIndex(
  characters: VoteObjectItem[],
  music: VoteObjectItem[],
): ResourceIndex {
  const imageMap = (items: VoteObjectItem[]) => {
    const m = new Map<string, string>()
    for (const it of items) if (it.imageUrl) m.set(it.name, it.imageUrl)
    return m
  }
  return {
    characterImage: imageMap(characters),
    musicImage: imageMap(music),
    characterNames: characters.map((i) => i.name),
    musicNames: music.map((i) => i.name),
  }
}

async function load(): Promise<ResourceIndex> {
  const [charResp, musicResp] = await Promise.all([
    fetchVoteObjects<VoteObjectItem>(voteObjectsUrl(BASE, 'characters', voteYear)),
    fetchVoteObjects<VoteObjectItem>(voteObjectsUrl(BASE, 'music', voteYear)),
  ])
  return buildIndex(flattenItems(charResp), flattenItems(musicResp))
}

/** 幂等加载：全站只请求一次。 */
export function ensureVoteObjectResources(): Promise<ResourceIndex> {
  if (index) return Promise.resolve(index)
  if (!inflight) {
    inflight = load()
      .then((ix) => {
        index = ix
        return ix
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

/** 以下 getter 需在 ensureVoteObjectResources() resolve 之后调用。 */
export function getCharacterImage(name: string): string | null {
  return index?.characterImage.get(name) ?? null
}

export function getMusicImage(name: string): string | null {
  return index?.musicImage.get(name) ?? null
}

export function getCharacterNames(): string[] {
  return index?.characterNames ?? []
}

export function getMusicNames(): string[] {
  return index?.musicNames ?? []
}
