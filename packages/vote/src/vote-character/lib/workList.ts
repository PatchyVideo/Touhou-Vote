import { computed, ref } from 'vue'
import { workList } from '@touhou-vote/shared/data/work'

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

export const filterForKind = ref<SelectList[]>([
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: 'others' },
])
export const filterForKindTem = ref<SelectList[]>([
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
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
    { name: '旧作', value: 'old' },
    { name: '新作', value: 'new' },
    { name: 'CD', value: 'CD' },
    { name: '出版物', value: 'book' },
    { name: '其他', value: 'others' },
  ]
}

export const worksListAfterFilter = computed<SelectList[]>(() =>
  workList
    .filter((work) => {
      let flag = false
      for (const kind of filterForKind.value) {
        if (work.kind === kind.value) flag = true
      }
      return flag
    })
    .map((work) => {
      return {
        name: work.name,
        value: work.kind,
      }
    })
)
export const workSelected = ref<SelectList>({ name: '', value: '' })
export const worksListAfterFilterTem = computed<SelectList[]>(() =>
  workList
    .filter((work) => {
      let flag = false
      for (const kind of filterForKindTem.value) {
        if (work.kind === kind.value) flag = true
      }
      return flag
    })
    .map((work) => {
      return {
        name: work.name,
        value: work.kind,
      }
    })
)
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
