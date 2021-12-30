import { ref, computed } from 'vue'

interface Work {
  name: string
  kind: 'old' | 'new' | 'CD' | 'book' | ''
}

interface SelectList {
  name: string
  value: 'old' | 'new' | 'CD' | 'book' | ''
}

const works: Work[] = [
  { name: '东方灵异传', kind: 'old' },
  { name: '东方封魔录', kind: 'old' },
  { name: '东方梦时空', kind: 'old' },
  { name: '东方幻想乡', kind: 'old' },
  { name: '东方怪绮谈', kind: 'old' },
  { name: '东方红魔乡', kind: 'new' },
  { name: '东方妖妖梦', kind: 'new' },
  { name: '东方萃梦想', kind: 'new' },
  { name: '东方永夜抄', kind: 'new' },
  { name: '东方花映塚', kind: 'new' },
  { name: '东方风神录', kind: 'new' },
  { name: '东方绯想天', kind: 'new' },
  { name: '东方地灵殿', kind: 'new' },
  { name: '东方星莲船', kind: 'new' },
  { name: '东方非想天则', kind: 'new' },
  { name: '东方文花帖DS', kind: 'new' },
  { name: '东方神灵庙', kind: 'new' },
  { name: '东方心绮楼', kind: 'new' },
  { name: '东方辉针城', kind: 'new' },
  { name: '东方深秘录', kind: 'new' },
  { name: '东方绀珠传', kind: 'new' },
  { name: '东方凭依华', kind: 'new' },
  { name: '东方天空璋', kind: 'new' },
  { name: '东方鬼形兽', kind: 'new' },
  { name: '东方刚欲异闻', kind: 'new' },
  { name: '东方虹龙洞', kind: 'new' },
  { name: '莲台野夜行', kind: 'CD' },
  { name: '旧约酒馆', kind: 'CD' },
  { name: '东方求闻史纪', kind: 'book' },
  { name: '东方三月精', kind: 'book' },
  { name: '东方儚月抄', kind: 'book' },
  { name: '东方香霖堂', kind: 'book' },
  { name: '东方茨歌仙', kind: 'book' },
  { name: '东方铃奈庵', kind: 'book' },
  { name: '东方智灵奇传', kind: 'book' },
  { name: '东方醉蝶华', kind: 'book' },
  { name: '其他', kind: '' },  
]

export const kinds: SelectList[] = [
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: '' },
]

export const filterForKind = ref<SelectList[]>([
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: '' },
])
export const filterForKindTem = ref<SelectList[]>([
  { name: '旧作', value: 'old' },
  { name: '新作', value: 'new' },
  { name: 'CD', value: 'CD' },
  { name: '出版物', value: 'book' },
  { name: '其他', value: '' },
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
    { name: '其他', value: '' },
  ]
}

export const worksListAfterFilter = computed<SelectList[]>(() =>
  works
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
  works
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
