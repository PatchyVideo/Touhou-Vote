import { Character } from '@/vote-character/lib/character'
import { computed } from 'vue'
import { characterHonmei, characters } from '@/vote-character/lib/voteData'

const characterList: Character[] = [
  {
    id: 'Hakurei Reimu',
    name: '博丽灵梦',
    title: '乐园的巫女',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Kirisame Marisa',
    name: '雾雨魔理沙',
    title: '普通的魔法使',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Kochiya Sanae',
    name: '东风谷早苗',
    title: '祭祀风的人类',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Izayoi Sakuya',
    name: '十六夜咲夜',
    title: '完美潇洒的从者',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Konpaku Youmu',
    name: '魂魄妖梦',
    title: '半人半灵的庭师',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Reisen Udongein Inaba',
    name: '铃仙·优昙华院·因幡',
    title: '狂气的月兔',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Syameimaru Aya',
    name: '射命丸文',
    title: '传统的幻想记者',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Cirno',
    name: '琪露诺',
    title: '湖上的冰精',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Ibuki Suika',
    name: '伊吹萃香',
    title: '小小的百鬼夜行',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Hinanawi Tenshi',
    name: '比那名居天子',
    title: '非想非非想天之女',
    image: 'https://thwiki.cc/favicon.ico',
  },
  {
    id: 'Hata no Kokoro',
    name: '秦心',
    title: '表情丰富的扑克脸',
    image: 'https://thwiki.cc/favicon.ico',
  },
]

export const characterListLeft = computed<Character[]>(() => {
  const charactersLeft: Character[] = []
  characterList.map((character) => {
    let characterInCharacters = false
    for (let i = 0; i < characters.value.length; i++) {
      if (characters.value[i].id === character.id) characterInCharacters = true
    }
    if (character.id != characterHonmei.value.id && !characterInCharacters) {
      charactersLeft.push(character)
    }
  })
  return charactersLeft
})
