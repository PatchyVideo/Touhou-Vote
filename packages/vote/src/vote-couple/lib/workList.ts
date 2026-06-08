import { computed, ref } from 'vue'
import { workList as staticWorkList } from '@touhou-vote/shared/data/work'
import { characterGroupNames } from '@/common/lib/voteObjectsDataSource'

interface SelectList {
  name: string
  value: 'old' | 'new' | 'CD' | 'book' | 'others' | ''
}

export const kinds: SelectList[] = [
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
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

function workNameToSelectList(workName: string): SelectList {
  const staticWork = staticWorkList.find((w) => w.name === workName)
  return { name: workName, value: staticWork?.kind ?? 'others' }
}

export const worksListAfterFilter = computed<SelectList[]>(() => {
  const activeKinds = filterForKind.value.map((k) => k.value)
  return characterGroupNames.value
    .map(workNameToSelectList)
    .filter((w) => activeKinds.includes(w.value))
})

export const workSelected = ref<SelectList>({ name: '', value: '' })

export const worksListAfterFilterTem = computed<SelectList[]>(() => {
  const activeKinds = filterForKindTem.value.map((k) => k.value)
  return characterGroupNames.value
    .map(workNameToSelectList)
    .filter((w) => activeKinds.includes(w.value))
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
