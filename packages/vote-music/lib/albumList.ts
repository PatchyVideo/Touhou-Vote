import { computed, ref } from 'vue'

interface Album {
  name: string
  kind: 'game' | 'book' | 'CD' | 'others' | ''
}

interface SelectList {
  name: string
  value: 'game' | 'book' | 'CD' | 'others' | ''
}

const albums: Album[] = [
  { name: '东方灵异传', kind: 'game' },
  { name: '东方封魔录', kind: 'game' },
  { name: '东方梦时空', kind: 'game' },
  { name: '东方幻想乡', kind: 'game' },
  { name: '东方怪绮谈', kind: 'game' },
  { name: '东方红魔乡', kind: 'game' },
  { name: '东方妖妖梦', kind: 'game' },
  { name: '幻想曲拔萃', kind: 'game' },
  { name: '东方永夜抄', kind: 'game' },
  { name: '东方花映塚', kind: 'game' },
  { name: '东方文花帖', kind: 'game' },
  { name: '东方风神录', kind: 'game' },
  { name: '全人类的天乐录', kind: 'game' },
  { name: '东方地灵殿', kind: 'game' },
  { name: '东方星莲船', kind: 'game' },
  { name: '核热造神非想天则', kind: 'game' },
  { name: '东方文花帖DS', kind: 'game' },
  { name: '妖精大战争', kind: 'game' },
  { name: '东方神灵庙', kind: 'game' },
  { name: '暗黑能乐集心绮楼', kind: 'game' },
  { name: '东方辉针城', kind: 'game' },
  { name: '弹幕天邪鬼', kind: 'game' },
  { name: '深秘乐曲集', kind: 'game' },
  { name: '深秘乐曲集·补', kind: 'game' },
  { name: '东方绀珠传', kind: 'game' },
  { name: '完全凭依唱片名录', kind: 'game' },
  { name: '东方天空璋', kind: 'game' },
  { name: '秘封噩梦日记', kind: 'game' },
  { name: '东方鬼形兽', kind: 'game' },
  { name: '贪欲之兽的音乐', kind: 'CD' },
  { name: '东方虹龙洞', kind: 'game' },
  { name: '蓬莱人形', kind: 'CD' },
  { name: '莲台野夜行', kind: 'CD' },
  { name: '梦违科学世纪', kind: 'CD' },
  { name: '卯酉东海道', kind: 'CD' },
  { name: '幺乐团的历史', kind: 'CD' },
  { name: '大空魔术', kind: 'CD' },
  { name: '未知之花 魅知之旅', kind: 'CD' },
  { name: '鸟船遗迹', kind: 'CD' },
  { name: '伊奘诺物质', kind: 'CD' },
  { name: '燕石博物志', kind: 'CD' },
  { name: '旧约酒馆', kind: 'CD' },
  { name: '虹色的北斗七星', kind: 'CD' },
  { name: '东方求闻史纪', kind: 'book' },
  { name: '东方三月精', kind: 'book' },
  { name: '东方儚月抄', kind: 'book' },
  { name: '东方铃奈庵', kind: 'book' },
  { name: '东方文花帖（书籍）', kind: 'book' },
  { name: 'The Grimoire of Marisa', kind: 'book' },
  { name: '秋霜玉', kind: 'game' },
  { name: '稀翁玉', kind: 'game' },
  { name: 'Torte Le Magic', kind: 'game' },
  { name: '黄昏酒场', kind: 'game' },
  { name: '神魔讨绮传', kind: 'game' },
  { name: '东方幻想麻将', kind: 'game' },
  { name: 'Cradle - 东方幻乐祀典', kind: 'CD' },
  { name: '8BIT MUSIC POWER FINAL', kind: 'CD' },
  { name: 'INDIE Live Expo', kind: 'others' },
  { name: '东方音焰火', kind: 'CD' },
  { name: '其他', kind: 'others' },
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
