import { ref, computed } from 'vue'

interface Album {
  name: string
  kind: 'game' | 'book' | 'CD' | 'others' | ''
}

interface SelectList {
  name: string
  value: 'game' | 'book' | 'CD' | 'others' | ''
}

const albums: Album[] = [
  {
    name: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    kind: 'CD',
  },
  {
    name: '莲台野夜行　～ Ghostly Field Club.',
    kind: 'CD',
  },
  {
    name: '东方风神录　～ Mountain of Faith.',
    kind: 'game',
  },
  {
    name: '东方铃奈庵 ～ Forbidden Scrollery.',
    kind: 'book',
  },
]

export const kinds: SelectList[] = [
  { name: '游戏OST', value: 'game' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: 'others' },
]

export const filterForKind = ref<SelectList[]>([
  { name: '游戏OST', value: 'game' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: 'others' },
])
export const filterForKindTem = ref<SelectList[]>([
  { name: '游戏OST', value: 'game' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: 'others' },
])
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
  filterForKindTem.value = [
    { name: '游戏OST', value: 'game' },
    { name: 'CD', value: 'CD' },
    { name: '出版物', value: 'book' },
    { name: '其他', value: 'others' },
  ]
}

export const albumsListAfterFilter = computed<SelectList[]>(() =>
  albums
    .filter((album) => {
      let flag = false
      for (const kind of filterForKind.value) {
        if (album.kind === kind.value) flag = true
      }
      return flag
    })
    .map((album) => {
      return {
        name: album.name,
        value: album.kind,
      }
    })
)
export const albumSelected = ref<SelectList>({ name: '', value: '' })
export const albumsListAfterFilterTem = computed<SelectList[]>(() =>
  albums
    .filter((album) => {
      let flag = false
      for (const kind of filterForKindTem.value) {
        if (album.kind === kind.value) flag = true
      }
      return flag
    })
    .map((album) => {
      return {
        name: album.name,
        value: album.kind,
      }
    })
)
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
