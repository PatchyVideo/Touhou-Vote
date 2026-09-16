// 投票对象数据源:从后端拉取角色/曲目候选列表及其资源字段(imageUrl 等),
// 直接映射为 Character/Music。0019 起资源 URL 由后端随 voteable 下发,
// 前端不再按 name 匹配 shared/data 静态表。
import { computed, ref } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { Music } from '@/vote-music/lib/music'
import {
  fetchVoteObjects,
  voteObjectsUrl,
  type VoteObjectFilterMeta,
  type VoteObjectGroup,
  type VoteObjectItem,
} from '@touhou-vote/shared/api/voteObjects'
import { voteYear } from '@/common/lib/voteYear'
import { API_PREFIX } from '@/common/lib/apiPrefix'

// ── 配置 ──────────────────────────────────────────────────────────────────
const CHARACTER_URL = voteObjectsUrl(`${API_PREFIX}/vote-objects`, 'characters', voteYear)
const MUSIC_URL = voteObjectsUrl(`${API_PREFIX}/vote-objects`, 'music', voteYear)

// 历史静态表里 244 个角色的 color 全部是同一个值 → 改用常量，不再建列。
const DEFAULT_CHARACTER_COLOR = '#FC4328'

// 前端 sessionStorage 缓存 TTL（D8）：后端资源可被管理台修改，
// 缓存过久会出现“改了不生效”。5 分钟内复用缓存，超时重新拉取。
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_VERSION = 'v2'

const CACHE_KEY_CHAR = `voteObjectsCharacters:${voteYear}:${CACHE_VERSION}`
const CACHE_KEY_MUSIC = `voteObjectsMusic:${voteYear}:${CACHE_VERSION}`

// ── 响应式状态 ───────────────────────────────────────────────────────────
export const characterGroupsRaw = ref<VoteObjectGroup<VoteObjectItem>[]>([])
export const musicGroupsRaw = ref<VoteObjectGroup<VoteObjectItem>[]>([])
export const filterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })
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

const characterFilterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })
const musicFilterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })

// ── 工具 ──────────────────────────────────────────────────────────────────
export function getWorkName(wid: number): string {
  return filterMeta.value.works.find((w) => w.workId === wid)?.name ?? ''
}

function toKinds<T extends string>(workTypes: string[]): T[] {
  const kinds = workTypes.filter(Boolean) as T[]
  return kinds.length ? kinds : (['others'] as T[])
}

function toDate(firstAppearance: string | null): number {
  const n = firstAppearance ? Number(firstAppearance) : 0
  return Number.isFinite(n) ? n : 0
}

// ── enrich:后端字段 → Character / Music（无静态匹配）─────────────────────
function enrichCharacter(item: VoteObjectItem): Character {
  const workNames = item.workIds.map(getWorkName).filter(Boolean)
  return new Character(
    String(item.candidateId),
    item.name,
    item.nameJp || '',
    item.aliases ?? [],
    '',
    item.imageUrl ?? '', // 空 → 组件回退 defaultCharacterImage.png
    DEFAULT_CHARACTER_COLOR,
    '',
    toDate(item.firstAppearance),
    false,
    toKinds(item.workTypes),
    workNames,
    item.workIds,
  )
}

function enrichMusic(item: VoteObjectItem): Music {
  const albumName = item.workIds.length ? getWorkName(item.workIds[0]) : ''
  return new Music(
    String(item.candidateId),
    item.name,
    item.nameJp || '',
    albumName,
    toDate(item.firstAppearance),
    item.imageUrl ?? '', // 空 → 组件回退 defaultMusicImage.jpg
    item.musicUrl ?? '',
    '',
    false,
    toKinds(item.workTypes),
    item.include ?? [],
  )
}

// ── 扁平列表 ──────────────────────────────────────────────────────────────
export const characterListFromBackend = computed<Character[]>(() =>
  characterGroupsRaw.value.flatMap((g) => g.items.map(enrichCharacter)),
)

export const musicListFromBackend = computed<Music[]>(() =>
  musicGroupsRaw.value.flatMap((g) => g.items.map(enrichMusic)),
)

// ── 分组名列表(供筛选下拉)───────────────────────────────────────────────
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
let characterRefresh: Promise<void> | null = null
let musicRefresh: Promise<void> | null = null

function markReady(): void {
  if (!readyResolved) {
    readyResolved = true
    resolveReady()
  }
}

function isFilterMeta(value: unknown): value is VoteObjectFilterMeta {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<VoteObjectFilterMeta>
  return Array.isArray(candidate.kinds) && Array.isArray(candidate.works)
}

interface TierCache<T> {
  groups: VoteObjectGroup<T>[]
  meta: VoteObjectFilterMeta
  cachedAt: number
}

// 读缓存时不看 TTL：过期数据也先渲染，再后台刷新（见 load*）。这样命中缓存
// 的页面加载永远是 0 等待；TTL 只决定「何时后台 revalidate」。
function readCacheEntry<T>(key: string): TierCache<T> | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TierCache<T>>
    if (
      Array.isArray(parsed.groups) &&
      isFilterMeta(parsed.meta) &&
      typeof parsed.cachedAt === 'number'
    ) {
      return {
        groups: parsed.groups,
        meta: parsed.meta,
        cachedAt: parsed.cachedAt,
      }
    }
  } catch (err) {
    console.warn('[voteObjects] 会话缓存无法解析，将重新请求:', err)
  }
  sessionStorage.removeItem(key)
  return null
}

function isStale(entry: { cachedAt: number }): boolean {
  return Date.now() - entry.cachedAt >= CACHE_TTL_MS
}

function writeCache<T>(key: string, entry: TierCache<T>): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch (err) {
    console.warn('[voteObjects] 会话缓存写入失败(配额?):', err)
  }
}

function updateCombinedFilterMeta(): void {
  filterMeta.value = {
    kinds: dedupeKinds([...characterFilterMeta.value.kinds, ...musicFilterMeta.value.kinds]),
    works: dedupeWorks([...characterFilterMeta.value.works, ...musicFilterMeta.value.works]),
  }
}

function commitCharacterVoteObjects(
  groups: VoteObjectGroup<VoteObjectItem>[],
  meta: VoteObjectFilterMeta,
): void {
  characterGroupsRaw.value = groups
  characterFilterMeta.value = meta
  updateCombinedFilterMeta()
}

function commitMusicVoteObjects(
  groups: VoteObjectGroup<VoteObjectItem>[],
  meta: VoteObjectFilterMeta,
): void {
  musicGroupsRaw.value = groups
  musicFilterMeta.value = meta
  updateCombinedFilterMeta()
}

function refreshCharacter(): Promise<void> {
  if (characterRefresh) return characterRefresh
  characterRefresh = (async () => {
    characterVoteObjectsLoading.value = true
    characterVoteObjectsError.value = null
    try {
      const data = await fetchVoteObjects<VoteObjectItem>(CHARACTER_URL)
      commitCharacterVoteObjects(data.groups, data.filterMeta)
      writeCache(CACHE_KEY_CHAR, {
        groups: data.groups,
        meta: data.filterMeta,
        cachedAt: Date.now(),
      })
    } catch (err) {
      // 已有缓存时不打断页面（后台刷新失败只记日志）；无数据才暴露错误
      if (!characterGroupsRaw.value.length) {
        characterVoteObjectsError.value = err instanceof Error ? err.message : String(err)
      }
      console.error('[voteObjects] 拉取角色投票对象失败:', err)
    } finally {
      characterVoteObjectsLoading.value = false
      characterRefresh = null
    }
  })()
  return characterRefresh
}

function refreshMusic(): Promise<void> {
  if (musicRefresh) return musicRefresh
  musicRefresh = (async () => {
    musicVoteObjectsLoading.value = true
    musicVoteObjectsError.value = null
    try {
      const data = await fetchVoteObjects<VoteObjectItem>(MUSIC_URL)
      commitMusicVoteObjects(data.groups, data.filterMeta)
      writeCache(CACHE_KEY_MUSIC, {
        groups: data.groups,
        meta: data.filterMeta,
        cachedAt: Date.now(),
      })
    } catch (err) {
      if (!musicGroupsRaw.value.length) {
        musicVoteObjectsError.value = err instanceof Error ? err.message : String(err)
      }
      console.error('[voteObjects] 拉取曲目投票对象失败:', err)
    } finally {
      musicVoteObjectsLoading.value = false
      musicRefresh = null
    }
  })()
  return musicRefresh
}

/**
 * 加载角色投票对象。
 * - `force=true`：等网络；
 * - 命中缓存：**立即返回**（先渲染），过期则后台 revalidate；
 * - 无缓存：等网络（首次加载，无法避免）。
 */
export function loadCharacterVoteObjects(force = false): Promise<void> {
  if (force) return refreshCharacter()
  const cached = readCacheEntry<VoteObjectItem>(CACHE_KEY_CHAR)
  if (cached) {
    commitCharacterVoteObjects(cached.groups, cached.meta)
    if (isStale(cached)) void refreshCharacter()
    return Promise.resolve()
  }
  return refreshCharacter()
}

/** 加载曲目投票对象，语义同 loadCharacterVoteObjects。 */
export function loadMusicVoteObjects(force = false): Promise<void> {
  if (force) return refreshMusic()
  const cached = readCacheEntry<VoteObjectItem>(CACHE_KEY_MUSIC)
  if (cached) {
    commitMusicVoteObjects(cached.groups, cached.meta)
    if (isStale(cached)) void refreshMusic()
    return Promise.resolve()
  }
  return refreshMusic()
}

/** 需要两类的场景(导出海报等)。 */
export function loadVoteObjects(force = false): Promise<void> {
  return Promise.all([
    loadCharacterVoteObjects(force),
    loadMusicVoteObjects(force),
  ]).then(() => {
    markReady()
  })
}

function dedupeKinds(
  kinds: { type: string; label: string }[],
): { type: string; label: string }[] {
  const seen = new Set<string>()
  return kinds.filter((k) => (seen.has(k.type) ? false : (seen.add(k.type), true)))
}

function dedupeWorks(
  works: { workId: number; name: string; type: string }[],
): { workId: number; name: string; type: string }[] {
  const seen = new Set<number>()
  return works.filter((w) => (seen.has(w.workId) ? false : (seen.add(w.workId), true)))
}

export function clearVoteObjectsCache(): void {
  // v2 键 + 历史遗留键一并清理
  for (const key of [
    CACHE_KEY_CHAR,
    CACHE_KEY_MUSIC,
    `voteObjectsCharacters:${voteYear}`,
    `voteObjectsMusic:${voteYear}`,
    `voteObjectsFilterMeta:${voteYear}`,
    `voteObjectsCharacterFilterMeta:${voteYear}`,
    `voteObjectsMusicFilterMeta:${voteYear}`,
  ]) {
    sessionStorage.removeItem(key)
  }
}
