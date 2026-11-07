import { computed, ref, watch } from 'vue'
import { characterFilterMeta } from '@/common/lib/voteObjectsDataSource'

interface SelectList {
  name: string
  value: string
}

export const kinds = computed<SelectList[]>(() =>
  characterFilterMeta.value.kinds.map((kind) => ({ name: kind.label, value: kind.type }))
)

export const filterForKind = ref<SelectList[]>([])
export const filterForKindTem = ref<SelectList[]>([])

watch(
  kinds,
  (newKinds) => {
    filterForKind.value = [...newKinds]
    filterForKindTem.value = [...newKinds]
  },
  { immediate: true }
)

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

export const worksListAfterFilter = computed<SelectList[]>(() => {
  const activeKinds = filterForKind.value.map((k) => k.value)
  return characterFilterMeta.value.works
    .filter((work) => activeKinds.includes(work.type))
    .map((work) => ({ name: work.name, value: work.type }))
})

export const workSelected = ref<SelectList>({ name: '', value: '' })

export const worksListAfterFilterTem = computed<SelectList[]>(() => {
  const activeKinds = filterForKindTem.value.map((k) => k.value)
  return characterFilterMeta.value.works
    .filter((work) => activeKinds.includes(work.type))
    .map((work) => ({ name: work.name, value: work.type }))
})

export const workSelectedTem = ref<SelectList>({ name: '', value: '' })
export function updateWorkSelected(): void {
  workSelected.value = workSelectedTem.value
}
export function getWorkSelectedTem(): void {
  workSelectedTem.value = workSelected.value
}
export function resetWorkSelectedTem(): void {
  workSelectedTem.value = { name: '', value: '' }
}
