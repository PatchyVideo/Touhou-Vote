// 投票对象数据源:从后端拉取角色/音乐候选列表,按名称 enriching 静态 shared 数据(image/color/kind 等展示字段)。
// 取代 @touhou-vote/shared/data/character|music 作为投票页运行时列表来源(Block 3B)。
import { computed, ref } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { Music } from '@/vote-music/lib/music'
import { characterList as staticCharacterList } from '@touhou-vote/shared/data/character'
import { musicList as staticMusicList, albumList as staticAlbumList } from '@touhou-vote/shared/data/music'
import { voteYear } from '@/common/lib/voteYear'

interface BackendCharacterItem {
  id: number
  name: string
  name_jp: string
  origin: string
  first_appearance: string | null
}

interface BackendMusicItem {
  id: number
  name: string
  name_jp: string
  album: string
  first_appearance: string | null
}

interface BackendGroup<T> {
  group: string
  items: T[]
}

const CHARACTER_URL = `/v11-be/vote-objects/characters?vote_year=${voteYear}`
const MUSIC_URL = `/v11-be/vote-objects/music?vote_year=${voteYear}`
const CACHE_KEY_CHAR = `voteObjectsCharacters:${voteYear}`
const CACHE_KEY_MUSIC = `voteObjectsMusic:${voteYear}`

export const characterGroupsRaw = ref<BackendGroup<BackendCharacterItem>[]>([])
export const musicGroupsRaw = ref<BackendGroup<BackendMusicItem>[]>([])
export const voteObjectsLoading = ref(false)
export const voteObjectsError = ref<string | null>(null)

let resolveReady: () => void = () => {}
// 始终 resolve:成功/缓存/出错都不挂起
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

function enrichCharacter(item: BackendCharacterItem): Character {
  const s = staticCharacterList.find((c) => c.name === item.name)
  return new Character(
    String(item.id),
    item.name,
    s?.origname ?? item.name_jp,
    s?.altnames ?? [],
    s?.title ?? '',
    s?.image ?? 'https://static.thwiki.cc/favicon.png',
    s?.color ?? '#9b9b9b',
    '',
    false,
    s?.date ?? 0,
    s?.kind?.length ? s.kind : ['others'],
    item.origin ? [item.origin] : (s?.work ?? []),
  )
}

function enrichMusic(item: BackendMusicItem): Music {
  const s = staticMusicList.find((m) => m.name === item.name)
  const albumKind = staticAlbumList.find((a) => a.name === item.album)?.kind ?? 'others'
  return new Music(
    String(item.id),
    item.name,
    s?.origname ?? item.name_jp,
    item.album,
    s?.date ?? 0,
    s?.image ?? 'https://static.thwiki.cc/favicon.png',
    s?.music ?? '',
    '',
    false,
    s?.kind?.length ? s.kind : [albumKind],
    s?.include ?? [],
  )
}

// 扁平列表:供 characterList.ts / musicList.ts 替换静态来源
export const characterListFromBackend = computed<Character[]>(() =>
  characterGroupsRaw.value.flatMap((g) => g.items.map(enrichCharacter))
)

export const musicListFromBackend = computed<Music[]>(() =>
  musicGroupsRaw.value.flatMap((g) => g.items.map(enrichMusic))
)

// 分组名列表:供 workList.ts / albumList.ts 构建筛选下拉
export const characterGroupNames = computed<string[]>(() =>
  characterGroupsRaw.value.map((g) => g.group)
)
export const musicGroupNames = computed<string[]>(() =>
  musicGroupsRaw.value.map((g) => g.group)
)

export function loadVoteObjects(force = false): Promise<void> {
  if (loadPromise && !force) return loadPromise

  loadPromise = (async () => {
    voteObjectsLoading.value = true
    voteObjectsError.value = null
    try {
      if (!force) {
        const cachedChar = sessionStorage.getItem(CACHE_KEY_CHAR)
        const cachedMusic = sessionStorage.getItem(CACHE_KEY_MUSIC)
        if (cachedChar && cachedMusic) {
          characterGroupsRaw.value = JSON.parse(cachedChar)
          musicGroupsRaw.value = JSON.parse(cachedMusic)
          return
        }
      }
      const [charRes, musicRes] = await Promise.all([
        fetch(CHARACTER_URL, { credentials: 'include' }),
        fetch(MUSIC_URL, { credentials: 'include' }),
      ])
      if (!charRes.ok) throw new Error(`characters HTTP ${charRes.status}`)
      if (!musicRes.ok) throw new Error(`music HTTP ${musicRes.status}`)
      const charData: { vote_year: number; groups: BackendGroup<BackendCharacterItem>[] } = await charRes.json()
      const musicData: { vote_year: number; groups: BackendGroup<BackendMusicItem>[] } = await musicRes.json()
      characterGroupsRaw.value = charData.groups
      musicGroupsRaw.value = musicData.groups
      sessionStorage.setItem(CACHE_KEY_CHAR, JSON.stringify(charData.groups))
      sessionStorage.setItem(CACHE_KEY_MUSIC, JSON.stringify(musicData.groups))
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

export function clearVoteObjectsCache(): void {
  sessionStorage.removeItem(CACHE_KEY_CHAR)
  sessionStorage.removeItem(CACHE_KEY_MUSIC)
}
