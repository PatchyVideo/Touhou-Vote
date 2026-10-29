// 投票对象数据源:从后端拉取角色/曲目候选列表及其资源字段(imageUrl 等),
// 直接映射为 Character/Music。0019 起资源 URL 由后端随 voteable 下发,
// 前端不再按 name 匹配 shared/data 静态表。
import { computed, ref } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { Music } from '@/vote-music/lib/music'
import {
  type VoteObjectFilterMeta,
  type VoteObjectGroup,
  type VoteObjectItem,
  fetchVoteObjects,
  voteObjectsUrl,
} from '@touhou-vote/shared/api/voteObjects'
import { voteYear } from '@/common/lib/voteYear'
import { API_PREFIX } from '@/common/lib/apiPrefix'

// ── 配置 ──────────────────────────────────────────────────────────────────
const CHARACTER_URL = voteObjectsUrl(`${API_PREFIX}/vote-objects`, 'characters', voteYear)
const MUSIC_URL = voteObjectsUrl(`${API_PREFIX}/vote-objects`, 'music', voteYear)

// 历史静态表里 244 个角色的 color 全部是同一个值 → 改用常量，不再建列。
const DEFAULT_CHARACTER_COLOR = '#FC4328'

// ── 响应式状态 ───────────────────────────────────────────────────────────
export const characterGroupsRaw = ref<VoteObjectGroup<VoteObjectItem>[]>([])
export const musicGroupsRaw = ref<VoteObjectGroup<VoteObjectItem>[]>([])
export const filterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })
// 记录成功加载，而非以列表长度判断：空列表也是有效响应。
export const characterVoteObjectsLoaded = ref(false)
export const musicVoteObjectsLoaded = ref(false)
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

export const characterFilterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })
export const musicFilterMeta = ref<VoteObjectFilterMeta>({ kinds: [], works: [] })

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
    item.aliases ?? [],
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isOptionalString(value: unknown): boolean {
  return value == null || typeof value === 'string'
}

function isVoteObjectItem(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    typeof value.candidateId === 'number' &&
    Number.isFinite(value.candidateId) &&
    typeof value.name === 'string' &&
    isOptionalString(value.nameJp) &&
    isOptionalString(value.firstAppearance) &&
    isOptionalString(value.imageUrl) &&
    isOptionalString(value.musicUrl) &&
    Array.isArray(value.workIds) &&
    value.workIds.every((id) => typeof id === 'number' && Number.isFinite(id)) &&
    isStringArray(value.workTypes) &&
    (value.aliases == null || isStringArray(value.aliases)) &&
    (value.include == null || isStringArray(value.include))
  )
}

function validateVoteObjects(groups: unknown, meta: unknown): void {
  const validGroups =
    Array.isArray(groups) &&
    groups.every(
      (group) =>
        isRecord(group) &&
        typeof group.group === 'string' &&
        Array.isArray(group.items) &&
        group.items.every(isVoteObjectItem)
    )
  const validMeta =
    isRecord(meta) &&
    Array.isArray(meta.kinds) &&
    meta.kinds.every((kind) => isRecord(kind) && typeof kind.type === 'string' && typeof kind.label === 'string') &&
    Array.isArray(meta.works) &&
    meta.works.every(
      (work) =>
        isRecord(work) &&
        typeof work.workId === 'number' &&
        Number.isFinite(work.workId) &&
        typeof work.name === 'string' &&
        typeof work.type === 'string'
    )
  if (!validGroups || !validMeta) throw new Error('vote-objects 响应结构不完整')
}

function combineFilterMeta(characterMeta: VoteObjectFilterMeta, musicMeta: VoteObjectFilterMeta): VoteObjectFilterMeta {
  return {
    kinds: dedupeKinds([...characterMeta.kinds, ...musicMeta.kinds]),
    works: dedupeWorks([...characterMeta.works, ...musicMeta.works]),
  }
}

function commitCharacterVoteObjects(
  groups: VoteObjectGroup<VoteObjectItem>[],
  meta: VoteObjectFilterMeta,
): void {
  // 校验和合并均先完成，避免准备失败后只更新了一部分内存资料。
  validateVoteObjects(groups, meta)
  const combinedMeta = combineFilterMeta(meta, musicFilterMeta.value)
  characterGroupsRaw.value = groups
  characterFilterMeta.value = meta
  filterMeta.value = combinedMeta
}

function commitMusicVoteObjects(
  groups: VoteObjectGroup<VoteObjectItem>[],
  meta: VoteObjectFilterMeta,
): void {
  validateVoteObjects(groups, meta)
  const combinedMeta = combineFilterMeta(characterFilterMeta.value, meta)
  musicGroupsRaw.value = groups
  musicFilterMeta.value = meta
  filterMeta.value = combinedMeta
}

function refreshCharacter(): Promise<void> {
  if (characterRefresh) return characterRefresh
  characterRefresh = (async () => {
    characterVoteObjectsLoading.value = true
    characterVoteObjectsError.value = null
    try {
      const data = await fetchVoteObjects<VoteObjectItem>(CHARACTER_URL)
      commitCharacterVoteObjects(data.groups, data.filterMeta)
      characterVoteObjectsLoaded.value = true
    } catch (err) {
      // 已成功加载时保留内存资料；首次加载失败才暴露页面错误。
      if (!characterVoteObjectsLoaded.value) {
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
      musicVoteObjectsLoaded.value = true
    } catch (err) {
      if (!musicVoteObjectsLoaded.value) {
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
 * 同次网页运行复用成功加载的资料；刷新网页后首次使用时重新请求。
 * force 跳过内存复用，但仍等待同类进行中的请求。
 */
export function loadCharacterVoteObjects(force = false): Promise<void> {
  if (characterRefresh) return characterRefresh
  if (!force && characterVoteObjectsLoaded.value) return Promise.resolve()
  return refreshCharacter()
}

/** 加载曲目投票对象，语义同 loadCharacterVoteObjects。 */
export function loadMusicVoteObjects(force = false): Promise<void> {
  if (musicRefresh) return musicRefresh
  if (!force && musicVoteObjectsLoaded.value) return Promise.resolve()
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

/** 仅清理当前年度的遗留存储键，不影响内存资料或投票草稿。 */
export function clearVoteObjectsCache(): void {
  try {
    for (const key of [
      `voteObjectsCharacters:${voteYear}:v2`,
      `voteObjectsMusic:${voteYear}:v2`,
      `voteObjectsCharacters:${voteYear}`,
      `voteObjectsMusic:${voteYear}`,
      `voteObjectsFilterMeta:${voteYear}`,
      `voteObjectsCharacterFilterMeta:${voteYear}`,
      `voteObjectsMusicFilterMeta:${voteYear}`,
    ]) {
      sessionStorage.removeItem(key)
    }
  } catch (err) {
    // 浏览器禁用存储时仍可使用内存资料和网络加载。
    console.warn('[voteObjects] 遗留会话缓存清理失败:', err)
  }
}

clearVoteObjectsCache()
