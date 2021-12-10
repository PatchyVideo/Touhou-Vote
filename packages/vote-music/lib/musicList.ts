import { Music, music0 } from '@/vote-music/lib/music'
import { computed, ref } from 'vue'
import { musicHonmei, musics } from '@/vote-music/lib/voteData'

export const musicList: Music[] = [
  {
    id: 'ZCDS-0001-01',
    name: '蓬莱传说',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    date: 20020811,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0001-02',
    name: '二色莲花蝶　～ Red and White',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    date: 20020811,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0001-03',
    name: '樱花之恋塚　～ Japanese Flower',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    date: 20020811,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0001-04',
    name: '明治十七年的上海爱丽丝',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    date: 20020811,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0001-05',
    name: '东方怪奇谈',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    date: 20020811,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0002-01',
    name: '走在夜晚的莲台野',
    album: '莲台野夜行　～ Ghostly Field Club.',
    date: 20031230,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0002-02',
    name: '少女秘封俱乐部',
    album: '莲台野夜行　～ Ghostly Field Club.',
    date: 20031230,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0002-03',
    name: '东方妖妖梦　～ Ancient Temple',
    album: '莲台野夜行　～ Ghostly Field Club.',
    date: 20031230,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0002-04',
    name: '古老的冥界寺',
    album: '莲台野夜行　～ Ghostly Field Club.',
    date: 20031230,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: 'ZCDS-0002-05',
    name: '幻视之夜　～ Ghostly Eyes',
    album: '莲台野夜行　～ Ghostly Field Club.',
    date: 20031230,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['CD'],
  },
  {
    id: '信仰は儚き人間の為に',
    name: '信仰是为了虚幻之人',
    album: '东方风神录　～ Mountain of Faith.',
    date: 20070817,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['game'],
  },
  {
    id: '判読眼のビブロフィリア',
    name: '识文解意的爱书人',
    album: '东方铃奈庵 ～ Forbidden Scrollery.',
    date: 20161210,
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
    kind: ['book'],
  },
]

export const musicListLeft = computed<Music[]>(() =>
  musicList.filter((music) => {
    let musicInMusics = false
    for (let i = 0; i < musics.value.length; i++) {
      if (musics.value[i].id === music.id) musicInMusics = true
    }
    return music.id != musicHonmei.value.id && !musicInMusics
  })
)
export const musicHonmeiListLeft = computed<Music[]>(() =>
  musicsReverse.value.filter((music) => music.id != musicHonmei.value.id)
)

export const musicsReverse = computed<Music[]>(() => musics.value.filter((music) => music.id != music0.id).reverse())
export const musicsReverseWithoutHonmei = computed<Music[]>(() => musicsReverse.value.filter((music) => !music.honmei))

export const orderOptions = [
  {
    name: '发布正序',
    value: 'newest',
  },
  {
    name: '发布倒序',
    value: 'oldest',
  },
]

export const order = ref(orderOptions[0])
import { filterForKind, albumSelected } from '@/vote-music/lib/albumList'
export const keyword = ref('')

export const musicListLeftWithFilter = computed<Music[]>(() => {
  let list: Music[] = JSON.parse(JSON.stringify(musicListLeft.value))
  list.sort((a, b) =>
    order.value.name === orderOptions[0].name ? Number(a.date) - Number(b.date) : Number(b.date) - Number(a.date)
  )
  if (filterForKind.value.length)
    list = list.filter((item) => {
      for (const album of filterForKind.value) {
        if (item.kind.find((item2) => item2 === album.value)) {
          return true
        }
      }
      return false
    })
  if (albumSelected.value.name != '') {
    list = list.filter((item) => {
      if (item.album === albumSelected.value.name) return true
      else return false
    })
  }
  if (keyword.value != '') {
    const regex = new RegExp(keyword.value)
    list = list.filter((item) => {
      if (regex.test(item.name)) return true
      if (regex.test(item.album)) return true
      else return false
    })
  }
  return list
})
