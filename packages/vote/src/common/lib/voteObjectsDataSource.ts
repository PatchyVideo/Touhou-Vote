// 投票对象数据源:从后端拉取角色/音乐候选列表,按名称 enriching 静态 shared 数据(image/color/kind 等展示字段)。
// 取代 @touhou-vote/shared/data/character|music 作为投票页运行时列表来源。
import { computed, ref } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { Music } from '@/vote-music/lib/music'
import { characterList as staticCharacterList } from '@touhou-vote/shared/data/character'
import { musicList as staticMusicList } from '@touhou-vote/shared/data/music'
import { voteYear } from '@/common/lib/voteYear'
import { API_PREFIX } from '@/common/lib/apiPrefix'

// ── 类型 ──────────────────────────────────────────────────────────────────
interface FilterMeta {
  kinds: { type: string; label: string }[]
  works: { workId: number; name: string; type: string }[]
}

interface BackendCharacterItem {
  id: number
  name: string
  name_jp: string
  workIds: number[]
  workTypes: string[]
  first_appearance: string | null
}

interface BackendMusicItem {
  id: number
  name: string
  name_jp: string
  workIds: number[]
  workTypes: string[]
  first_appearance: string | null
}

interface BackendGroup<T> {
  group: string
  items: T[]
}

interface VoteObjectsResponse<T> {
  voteYear: number
  groups: BackendGroup<T>[]
  filterMeta: FilterMeta
  aliasMap: Record<string, number>
}

const CHARACTER_URL = `${API_PREFIX}/vote-objects/characters?vote_year=${voteYear}`
const MUSIC_URL = `${API_PREFIX}/vote-objects/music?vote_year=${voteYear}`
const CACHE_KEY_CHAR = `voteObjectsCharacters:${voteYear}`
const CACHE_KEY_MUSIC = `voteObjectsMusic:${voteYear}`
const CACHE_KEY_FILTER_META = `voteObjectsFilterMeta:${voteYear}`
const CACHE_KEY_CHAR_FILTER_META = `voteObjectsCharacterFilterMeta:${voteYear}`
const CACHE_KEY_MUSIC_FILTER_META = `voteObjectsMusicFilterMeta:${voteYear}`

// ── 响应式状态 ───────────────────────────────────────────────────────────
export const characterGroupsRaw = ref<BackendGroup<BackendCharacterItem>[]>([])
export const musicGroupsRaw = ref<BackendGroup<BackendMusicItem>[]>([])
export const filterMeta = ref<FilterMeta>({ kinds: [], works: [] })
export const characterVoteObjectsLoading = ref(false)
export const musicVoteObjectsLoading = ref(false)
export const characterVoteObjectsError = ref<string | null>(null)
export const musicVoteObjectsError = ref<string | null>(null)
export const voteObjectsLoading = computed(
  () => characterVoteObjectsLoading.value || musicVoteObjectsLoading.value,
)
export const voteObjectsError = computed(
  () => characterVoteObjectsError.value ?? musicVoteObjectsError.value,
)

const characterFilterMeta = ref<FilterMeta>({ kinds: [], works: [] })
const musicFilterMeta = ref<FilterMeta>({ kinds: [], works: [] })

// ── 工具 ──────────────────────────────────────────────────────────────────
export function getWorkName(wid: number): string {
  return filterMeta.value.works.find((w) => w.workId === wid)?.name ?? ''
}

// ── enrich ────────────────────────────────────────────────────────────────
function enrichCharacter(item: BackendCharacterItem): Character {
  const s = staticCharacterList.find((c) => c.name === item.name)
  // 从 filterMeta 推导 kind 和 work 列表
  const workNames = item.workIds.map(getWorkName).filter(Boolean)
  const kinds = item.workTypes.length
    ? (item.workTypes.filter(Boolean) as ('old' | 'new' | 'book' | 'CD' | 'others')[])
    : (s?.kind?.length ? s.kind : ['others'])
  return new Character(
    String(item.id),
    item.name,
    s?.origname ?? item.name_jp,
    s?.altnames ?? [],
    s?.title ?? '',
    s?.image ?? 'https://static.thwiki.cc/favicon.png',
    s?.color ?? '#9b9b9b',
    '',
    s?.date ?? 0,
    false,
    kinds,
    workNames.length ? workNames : (s?.work ?? []),
    item.workIds,
  )
}

function enrichMusic(item: BackendMusicItem): Music {
  const s = staticMusicList.find((m) => m.name === item.name)
  const albumName = item.workIds.length ? getWorkName(item.workIds[0]) : ''
  const kinds = item.workTypes.length
    ? (item.workTypes.filter(Boolean) as ('game' | 'book' | 'CD' | 'others')[])
    : (s?.kind?.length ? s.kind : ['others'])
  return new Music(
    String(item.id),
    item.name,
    s?.origname ?? item.name_jp,
    albumName, // album → work name
    s?.date ?? 0,
    s?.image ?? 'https://static.thwiki.cc/favicon.png',
    s?.music ?? '',
    '',
    false,
    kinds,
    s?.include ?? [],
  )
}

// ── 扁平列表 ──────────────────────────────────────────────────────────────
export const characterListFromBackend = computed<Character[]>(() =>
  characterGroupsRaw.value.flatMap((g) => g.items.map(enrichCharacter)),
)

export const musicListFromBackend = computed<Music[]>(() =>
  musicGroupsRaw.value.flatMap((g) => g.items.map(enrichMusic)),
)

// ── 分组名列表（供筛选下拉）───────────────────────────────────────────────
export const characterGroupNames = computed<string[]>(() =>
  characterGroupsRaw.value.map((g) => g.group),
)
export const musicGroupNames = computed<string[]>(() =>
  musicGroupsRaw.value.map((g) => g.group),
)

// ── 加载 ──────────────────────────────────────────────────────────────────
let resolveReady: () => void = () => {}
export const voteObjectsReady: Promise<void> = new Promise((r) => {
  resolveReady = r
})
let readyResolved = false
let characterLoadPromise: Promise<void> | null = null
let musicLoadPromise: Promise<void> | null = null
let loadPromise: Promise<void> | null = null

function markReady(): void {
  if (!readyResolved) {
    readyResolved = true
    resolveReady()
  }
}

function isFilterMeta(value: unknown): value is FilterMeta {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<FilterMeta>
  return Array.isArray(candidate.kinds) && Array.isArray(candidate.works)
}

function readResourceCache<T>(
  groupsKey: string,
  metaKey: string,
  resourceName: string,
): {
  groups: BackendGroup<T>[]
  meta: FilterMeta
} | null {
  const cachedGroups = sessionStorage.getItem(groupsKey)
  if (!cachedGroups) return null

  // 兼容 ticket 02 已写入的合并 metadata；读取成功后会迁移为资源级缓存。
  const cachedMeta = sessionStorage.getItem(metaKey) ?? sessionStorage.getItem(CACHE_KEY_FILTER_META)
  if (!cachedMeta) return null

  try {
    const groups: unknown = JSON.parse(cachedGroups)
    const meta: unknown = JSON.parse(cachedMeta)
    if (Array.isArray(groups) && isFilterMeta(meta)) {
      sessionStorage.setItem(metaKey, JSON.stringify(meta))
      return { groups, meta }
    }
  } catch (err) {
    console.warn(`[voteObjects] ${resourceName}会话缓存无法解析，将重新请求投票对象:`, err)
  }

  sessionStorage.removeItem(groupsKey)
  sessionStorage.removeItem(metaKey)
  return null
}

function updateCombinedFilterMeta(): void {
  const meta: FilterMeta = {
    kinds: dedupeKinds([...characterFilterMeta.value.kinds, ...musicFilterMeta.value.kinds]),
    works: dedupeWorks([...characterFilterMeta.value.works, ...musicFilterMeta.value.works]),
  }
  filterMeta.value = meta
  sessionStorage.setItem(CACHE_KEY_FILTER_META, JSON.stringify(meta))
}

function commitCharacterVoteObjects(
  groups: BackendGroup<BackendCharacterItem>[],
  meta: FilterMeta,
): void {
  characterGroupsRaw.value = groups
  characterFilterMeta.value = meta
  updateCombinedFilterMeta()
}

function commitMusicVoteObjects(groups: BackendGroup<BackendMusicItem>[], meta: FilterMeta): void {
  musicGroupsRaw.value = groups
  musicFilterMeta.value = meta
  updateCombinedFilterMeta()
}

export function loadCharacterVoteObjects(force = false): Promise<void> {
  if (characterLoadPromise && !force) return characterLoadPromise

  characterLoadPromise = (async () => {
    characterVoteObjectsLoading.value = true
    characterVoteObjectsError.value = null
    try {
      if (!force) {
        const cached = readResourceCache<BackendCharacterItem>(
          CACHE_KEY_CHAR,
          CACHE_KEY_CHAR_FILTER_META,
          '角色投票对象',
        )
        if (cached) {
          commitCharacterVoteObjects(cached.groups, cached.meta)
          return
        }
      }

      const charRes = await fetch(CHARACTER_URL, { credentials: 'include' })
      if (!charRes.ok) throw new Error(`characters HTTP ${charRes.status}`)
      const charData: VoteObjectsResponse<BackendCharacterItem> = await charRes.json()
      if (!Array.isArray(charData.groups) || !isFilterMeta(charData.filterMeta)) {
        throw new Error('角色投票对象响应结构不完整')
      }

      commitCharacterVoteObjects(charData.groups, charData.filterMeta)
      sessionStorage.setItem(CACHE_KEY_CHAR, JSON.stringify(charData.groups))
      sessionStorage.setItem(CACHE_KEY_CHAR_FILTER_META, JSON.stringify(charData.filterMeta))
    } catch (err) {
      characterVoteObjectsError.value = err instanceof Error ? err.message : String(err)
      console.error('[voteObjects] 拉取角色投票对象失败，投票页将隐藏表单:', err)
    } finally {
      characterVoteObjectsLoading.value = false
    }
  })()

  return characterLoadPromise
}

export function loadMusicVoteObjects(force = false): Promise<void> {
  if (musicLoadPromise && !force) return musicLoadPromise

  musicLoadPromise = (async () => {
    musicVoteObjectsLoading.value = true
    musicVoteObjectsError.value = null
    try {
      if (!force) {
        const cached = readResourceCache<BackendMusicItem>(
          CACHE_KEY_MUSIC,
          CACHE_KEY_MUSIC_FILTER_META,
          '曲目投票对象',
        )
        if (cached) {
          commitMusicVoteObjects(cached.groups, cached.meta)
          return
        }
      }

      const musicRes = await fetch(MUSIC_URL, { credentials: 'include' })
      if (!musicRes.ok) throw new Error(`music HTTP ${musicRes.status}`)
      const musicData: VoteObjectsResponse<BackendMusicItem> = await musicRes.json()
      if (!Array.isArray(musicData.groups) || !isFilterMeta(musicData.filterMeta)) {
        throw new Error('曲目投票对象响应结构不完整')
      }

      commitMusicVoteObjects(musicData.groups, musicData.filterMeta)
      sessionStorage.setItem(CACHE_KEY_MUSIC, JSON.stringify(musicData.groups))
      sessionStorage.setItem(CACHE_KEY_MUSIC_FILTER_META, JSON.stringify(musicData.filterMeta))
    } catch (err) {
      musicVoteObjectsError.value = err instanceof Error ? err.message : String(err)
      console.error('[voteObjects] 拉取曲目投票对象失败，投票页将隐藏表单:', err)
    } finally {
      musicVoteObjectsLoading.value = false
    }
  })()

  return musicLoadPromise
}

export function loadVoteObjects(force = false): Promise<void> {
  if (loadPromise && !force) return loadPromise

  loadPromise = Promise.all([
    loadCharacterVoteObjects(force),
    loadMusicVoteObjects(force),
  ]).then(() => {
    markReady()
  })

  return loadPromise
}

function dedupeKinds(kinds: { type: string; label: string }[]): { type: string; label: string }[] {
  const seen = new Set<string>()
  return kinds.filter((k) => (seen.has(k.type) ? false : (seen.add(k.type), true)))
}

function dedupeWorks(works: { workId: number; name: string; type: string }[]): { workId: number; name: string; type: string }[] {
  const seen = new Set<number>()
  return works.filter((w) => (seen.has(w.workId) ? false : (seen.add(w.workId), true)))
}

export function clearVoteObjectsCache(): void {
  sessionStorage.removeItem(CACHE_KEY_CHAR)
  sessionStorage.removeItem(CACHE_KEY_MUSIC)
  sessionStorage.removeItem(CACHE_KEY_FILTER_META)
  sessionStorage.removeItem(CACHE_KEY_CHAR_FILTER_META)
  sessionStorage.removeItem(CACHE_KEY_MUSIC_FILTER_META)
}
