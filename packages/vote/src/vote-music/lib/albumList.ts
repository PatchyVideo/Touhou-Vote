import { computed, ref, watch } from 'vue'
import { filterMeta } from '@/common/lib/voteObjectsDataSource'

interface SelectList {
  name: string
  value: string
}

// 音乐页用不同 label
const MUSIC_KIND_LABELS: Record<string, string> = {
  old: '游戏旧作',
  new: '游戏OST',
  CD: 'CD',
  book: '出版物',
  others: '其他',
}

export const kinds = computed<SelectList[]>(() =>
  filterMeta.value.kinds.map((k) => ({
    name: MUSIC_KIND_LABELS[k.type] ?? k.label,
    value: k.type,
  }))
)

export const filterForKind = ref<SelectList[]>([])
export const filterForKindTem = ref<SelectList[]>([])

watch(kinds, (newKinds) => {
  filterForKind.value = [...newKinds]
  filterForKindTem.value = [...newKinds]
}, { immediate: true })

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
  filterForKindTem.value = JSON.parse(JSON.stringify(kinds.value))
}

export const albumsListAfterFilter = computed<SelectList[]>(() => {
  const activeKinds = filterForKind.value.map((k) => k.value)
  return filterMeta.value.works
    .filter((w) => activeKinds.includes(w.type))
    .map((w) => ({ name: w.name, value: w.type }))
})

export const albumSelected = ref<SelectList>({ name: '', value: '' })

export const albumsListAfterFilterTem = computed<SelectList[]>(() => {
  const activeKinds = filterForKindTem.value.map((k) => k.value)
  return filterMeta.value.works
    .filter((w) => activeKinds.includes(w.type))
    .map((w) => ({ name: w.name, value: w.type }))
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
