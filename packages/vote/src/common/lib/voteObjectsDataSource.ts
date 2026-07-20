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

// ── 响应式状态 ───────────────────────────────────────────────────────────
export const characterGroupsRaw = ref<BackendGroup<BackendCharacterItem>[]>([])
export const musicGroupsRaw = ref<BackendGroup<BackendMusicItem>[]>([])
export const filterMeta = ref<FilterMeta>({ kinds: [], works: [] })
export const voteObjectsLoading = ref(false)
export const voteObjectsError = ref<string | null>(null)

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
let loadPromise: Promise<void> | null = null

function markReady(): void {
  if (!readyResolved) {
    readyResolved = true
    resolveReady()
  }
}

export function loadVoteObjects(force = false): Promise<void> {
  if (loadPromise && !force) return loadPromise

  loadPromise = (async () => {
    voteObjectsLoading.value = true
    voteObjectsError.value = null
    try {
      if (!force) {
        const cachedChar = sessionStorage.getItem(CACHE_KEY_CHAR)
        const cachedMusic = sessionStorage.getItem(CACHE_KEY_MUSIC)
        const cachedMeta = sessionStorage.getItem(CACHE_KEY_FILTER_META)
        if (cachedChar && cachedMusic && cachedMeta) {
          characterGroupsRaw.value = JSON.parse(cachedChar)
          musicGroupsRaw.value = JSON.parse(cachedMusic)
          filterMeta.value = JSON.parse(cachedMeta)
          return
        }
      }
      const [charRes, musicRes] = await Promise.all([
        fetch(CHARACTER_URL, { credentials: 'include' }),
        fetch(MUSIC_URL, { credentials: 'include' }),
      ])
      if (!charRes.ok) throw new Error(`characters HTTP ${charRes.status}`)
      if (!musicRes.ok) throw new Error(`music HTTP ${musicRes.status}`)
      const charData: VoteObjectsResponse<BackendCharacterItem> = await charRes.json()
      const musicData: VoteObjectsResponse<BackendMusicItem> = await musicRes.json()

      characterGroupsRaw.value = charData.groups
      musicGroupsRaw.value = musicData.groups
      // 合并两边 filterMeta（取并集）
      const meta: FilterMeta = {
        kinds: dedupeKinds([...charData.filterMeta.kinds, ...musicData.filterMeta.kinds]),
        works: dedupeWorks([...charData.filterMeta.works, ...musicData.filterMeta.works]),
      }
      filterMeta.value = meta

      sessionStorage.setItem(CACHE_KEY_CHAR, JSON.stringify(charData.groups))
      sessionStorage.setItem(CACHE_KEY_MUSIC, JSON.stringify(musicData.groups))
      sessionStorage.setItem(CACHE_KEY_FILTER_META, JSON.stringify(meta))
    } catch (err) {
      voteObjectsError.value = err instanceof Error ? err.message : String(err)
      console.error('[voteObjects] 拉取投票对象失败,投票页将显示空列表:', err)
    } finally {
      voteObjectsLoading.value = false
      markReady()
    }
  })()

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
}
