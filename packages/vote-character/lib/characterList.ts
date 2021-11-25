import { Character, character0 } from '@/vote-character/lib/character'
import { computed, ref } from 'vue'
import { characterHonmei, characters } from '@/vote-character/lib/voteData'

export const characterList: Character[] = [
  {
    id: 'Hakurei Reimu',
    name: '博丽灵梦',
    altnames: ['红白', '十万巫女', '赤色杀人魔'],
    title: '乐园的巫女',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#FC4328',
    reason: '',
    honmei: false,
    date: 19961103,
    kind: ['old', 'new'],
    work: ['东方灵异传', '东方红魔乡'],
  },
  {
    id: 'Kirisame Marisa',
    name: '雾雨魔理沙',
    altnames: ['黑白', '莎', '金发小女孩'],
    title: '普通的魔法使',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#E3D26B',
    reason: '',
    honmei: false,
    date: 19961103,
    kind: ['old', 'new'],
    work: ['东方灵异传', '东方红魔乡'],
  },
  {
    id: 'Kochiya Sanae',
    name: '东风谷早苗',
    altnames: [],
    title: '祭祀风的人类',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#14DE64',
    reason: '',
    honmei: false,
    date: 20070817,
    kind: ['new'],
    work: ['东方风神录'],
  },
  {
    id: 'Izayoi Sakuya',
    name: '十六夜咲夜',
    altnames: ['dio'],
    title: '完美潇洒的从者',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#78909C',
    reason: '',
    honmei: false,
    date: 20020927,
    kind: ['new'],
    work: ['东方红魔乡'],
  },
  {
    id: 'Konpaku Youmu',
    name: '魂魄妖梦',
    altnames: ['精子娘'],
    title: '半人半灵的庭师',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#E1CE82',
    reason: '',
    honmei: false,
    date: 20030817,
    kind: ['new'],
    work: ['东方妖妖梦'],
  },
  {
    id: 'Reisen Udongein Inaba',
    name: '铃仙·优昙华院·因幡',
    altnames: ['受兔'],
    title: '狂气的月兔',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#D24B7E',
    reason: '',
    honmei: false,
    date: 20040815,
    kind: ['new'],
    work: ['东方永夜抄'],
  },
  {
    id: 'Syameimaru Aya',
    name: '射命丸文',
    altnames: [],
    title: '传统的幻想记者',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#531319',
    reason: '',
    honmei: false,
    date: 20050811,
    kind: ['new'],
    work: ['东方文花帖'],
  },
  {
    id: 'Cirno',
    name: '琪露诺',
    altnames: ['⑨', '9'],
    title: '湖上的冰精',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#9ED5F2',
    reason: '',
    honmei: false,
    date: 20020927,
    kind: ['new'],
    work: ['东方红魔乡'],
  },
  {
    id: 'Ibuki Suika',
    name: '伊吹萃香',
    altnames: ['西瓜'],
    title: '小小的百鬼夜行',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#DD926B',
    reason: '',
    honmei: false,
    date: 20041230,
    kind: ['new'],
    work: ['东方萃梦想'],
  },
  {
    id: 'Hinanawi Tenshi',
    name: '比那名居天子',
    altnames: [],
    title: '非想非非想天之女',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#1365A5',
    reason: '',
    honmei: false,
    date: 20080525,
    kind: ['new'],
    work: ['东方绯想天'],
  },
  {
    id: 'Hata no Kokoro',
    name: '秦心',
    altnames: [],
    title: '表情丰富的扑克脸',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#DFADE0',
    reason: '',
    honmei: false,
    date: 20130526,
    kind: ['new'],
    work: ['东方心绮楼'],
  },
]

export const characterListLeft = computed<Character[]>(() =>
  characterList.filter((character) => {
    let characterInCharacters = false
    for (let i = 0; i < characters.value.length; i++) {
      if (characters.value[i].id === character.id) characterInCharacters = true
    }
    return character.id != characterHonmei.value.id && !characterInCharacters
  })
)
export const characterHonmeiListLeft = computed<Character[]>(() => {
  return charactersReverse.value.filter((character) => character.id != characterHonmei.value.id)
})

export const charactersReverse = computed<Character[]>(() =>
  characters.value.filter((character) => character.id != character0.id).reverse()
)
export const charactersReverseWithoutHonmei = computed<Character[]>(() => {
  return charactersReverse.value.filter((character) => !character.honmei)
})

export const orderOptions = [
  {
    name: '出场正序',
    value: 'newest',
  },
  {
    name: '出场倒序',
    value: 'oldest',
  },
]
export const order = ref(orderOptions[0])
import { filterForKind, workSelected } from '@/vote-character/lib/workList'
export const keyword = ref('')

export const characterListLeftWithFilter = computed<Character[]>(() => {
  let list: Character[] = JSON.parse(JSON.stringify(characterListLeft.value))
  list.sort((a, b) =>
    order.value.name === orderOptions[0].name ? Number(a.date) - Number(b.date) : Number(b.date) - Number(a.date)
  )
  if (filterForKind.value.length)
    list = list.filter((item) => {
      for (const work of filterForKind.value) {
        if (item.kind.find((item2) => item2 === work.value)) {
          return true
        }
      }
      return false
    })
  if (workSelected.value.name != '') {
    list = list.filter((item) => {
      if (item.work.find((item2) => item2 === workSelected.value.name)) return true
      else return false
    })
  }
  if (keyword.value != '') {
    const regex = new RegExp(keyword.value)
    list = list.filter((item) => {
      if (regex.test(item.name)) return true
      if (regex.test(item.title)) return true
      else if (item.altnames.length) {
        for (const item2 of item.altnames) {
          if (regex.test(item2)) return true
        }
        return false
      }
    })
  }
  return list
})
