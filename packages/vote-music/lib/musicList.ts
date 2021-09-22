import { Music } from '@/vote-music/lib/music'
import { computed } from 'vue'
import { musicHonmei, musics, music0 } from '@/vote-music/lib/voteData'

const musicList: Music[] = [
  {
    id: 'ZCDS-0001-01',
    name: '蓬莱传说',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0001-02',
    name: '二色莲花蝶　～ Red and White',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0001-03',
    name: '樱花之恋塚　～ Japanese Flower',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0001-04',
    name: '明治十七年的上海爱丽丝',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0001-05',
    name: '东方怪奇谈',
    album: '蓬莱人形　～ Dolls in Pseudo Paradise.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0002-01',
    name: '走在夜晚的莲台野',
    album: '莲台野夜行　～ Ghostly Field Club.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0002-02',
    name: '少女秘封俱乐部',
    album: '莲台野夜行　～ Ghostly Field Club.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0002-03',
    name: '东方妖妖梦　～ Ancient Temple',
    album: '莲台野夜行　～ Ghostly Field Club.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0002-04',
    name: '古老的冥界寺',
    album: '莲台野夜行　～ Ghostly Field Club.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
  {
    id: 'ZCDS-0002-05',
    name: '幻视之夜　～ Ghostly Eyes',
    album: '莲台野夜行　～ Ghostly Field Club.',
    image: 'https://thwiki.cc/favicon.ico',
    reason: '',
    honmei: false,
  },
]

export const musicListLeft = computed<Music[]>(() => {
  const musicsLeft: Music[] = []
  musicList.map((music) => {
    let musicInMusics = false
    for (let i = 0; i < musics.value.length; i++) {
      if (musics.value[i].id === music.id) musicInMusics = true
    }
    if (music.id != musicHonmei.value.id && !musicInMusics) {
      musicsLeft.push(music)
    }
  })
  return musicsLeft
})
export const musicHonmeiListLeft = computed<Music[]>(() => {
  const musicsHonmeiLeft: Music[] = []
  musicsReverse.value.map((music) => {
    if (music.id != musicHonmei.value.id) {
      musicsHonmeiLeft.push(music)
    }
  })
  return musicsHonmeiLeft
})

export const musicsReverse = computed<Music[]>(() => {
  const musicsCopy: Music[] = []
  musics.value.map((music) => {
    if (music.id != music0.id) musicsCopy.push(music)
  })
  return musicsCopy.reverse()
})
export const musicsReverseWithoutHonmei = computed<Music[]>(() => {
  const musicsCopy: Music[] = []
  musicsReverse.value.map((music) => {
    if (!music.honmei) musicsCopy.push(music)
  })
  return musicsCopy
})
