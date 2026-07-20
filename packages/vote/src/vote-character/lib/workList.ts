import { computed, ref, watch } from 'vue'
import { filterMeta } from '@/common/lib/voteObjectsDataSource'

interface SelectList {
  name: string
  value: string
}

// kinds 从 filterMeta 动态构建
export const kinds = computed<SelectList[]>(() =>
  filterMeta.value.kinds.map((k) => ({ name: k.label, value: k.type }))
)

export const filterForKind = ref<SelectList[]>([])
export const filterForKindTem = ref<SelectList[]>([])

// 当 kinds 变化时（加载完成），同步选中状态
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

// works 下拉从 filterMeta 构建
export const worksListAfterFilter = computed<SelectList[]>(() => {
  const activeKinds = filterForKind.value.map((k) => k.value)
  return filterMeta.value.works
    .filter((w) => activeKinds.includes(w.type))
    .map((w) => ({ name: w.name, value: w.type }))
})

export const workSelected = ref<SelectList>({ name: '', value: '' })

export const worksListAfterFilterTem = computed<SelectList[]>(() => {
  const activeKinds = filterForKindTem.value.map((k) => k.value)
  return filterMeta.value.works
    .filter((w) => activeKinds.includes(w.type))
    .map((w) => ({ name: w.name, value: w.type }))
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
