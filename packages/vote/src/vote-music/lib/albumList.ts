import { computed, ref } from 'vue'
import { albumList as staticAlbumList } from '@touhou-vote/shared/data/music'
import { musicGroupNames } from '@/common/lib/voteObjectsDataSource'

interface SelectList {
  name: string
  value: 'game' | 'book' | 'CD' | 'others' | ''
}

export const kinds: SelectList[] = [
  { name: '游戏OST', value: 'game' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: 'others' },
]

export const filterForKind = ref<SelectList[]>([...kinds])
export const filterForKindTem = ref<SelectList[]>([...kinds])

export function getFilterForKindTem(): void {
  filterForKindTem.value = JSON.parse(JSON.stringify(filterForKind.value))
}
export function updateFilterForKindTem(kind: SelectList): void {
  const index = filterForKindTem.value.findIndex((item) => item.name === kind.name)
  index === -1 ? filterForKindTem.value.push(kind) : filterForKindTem.value.splice(index, 1)
}
export function updateFilterForKind(): void {
  filterForKind.value = JSON.parse(JSON.stringify(filterForKindTem.value))
}
export function resetFilterForKindTem(): void {
  filterForKindTem.value = JSON.parse(JSON.stringify(kinds))
}

function albumNameToSelectList(albumName: string): SelectList {
  const staticAlbum = staticAlbumList.find((a) => a.name === albumName)
  return { name: albumName, value: staticAlbum?.kind ?? 'others' }
}

export const albumsListAfterFilter = computed<SelectList[]>(() => {
  const activeKinds = filterForKind.value.map((k) => k.value)
  return musicGroupNames.value
    .map(albumNameToSelectList)
    .filter((a) => activeKinds.includes(a.value))
})

export const albumSelected = ref<SelectList>({ name: '', value: '' })

export const albumsListAfterFilterTem = computed<SelectList[]>(() => {
  const activeKinds = filterForKindTem.value.map((k) => k.value)
  return musicGroupNames.value
    .map(albumNameToSelectList)
    .filter((a) => activeKinds.includes(a.value))
})

export const albumSelectedTem = ref<SelectList>({ name: '', value: '' })
export function updateAlbumSelected(): void {
  albumSelected.value = albumSelectedTem.value
}
export function getAlbumSelectedTem(): void {
  albumSelectedTem.value = albumSelected.value
}
export function resetAlbumSelectedTem(): void {
  albumSelectedTem.value = { name: '', value: '' }
}
