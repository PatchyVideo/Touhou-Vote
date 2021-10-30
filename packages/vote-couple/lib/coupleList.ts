import { ref, computed } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { Couple } from '@/vote-couple/lib/couple'
import { couples } from '@/vote-couple/lib/voteData'

export const characterList: Character[] = [
  {
    id: 'Hakurei Reimu',
    name: '博丽灵梦',
    title: '乐园的巫女',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#FC4328',
    reason: '',
    honmei: false,
  },
  {
    id: 'Kirisame Marisa',
    name: '雾雨魔理沙',
    title: '普通的魔法使',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#E3D26B',
    reason: '',
    honmei: false,
  },
  {
    id: 'Kochiya Sanae',
    name: '东风谷早苗',
    title: '祭祀风的人类',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#14DE64',
    reason: '',
    honmei: false,
  },
  {
    id: 'Izayoi Sakuya',
    name: '十六夜咲夜',
    title: '完美潇洒的从者',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#78909C',
    reason: '',
    honmei: false,
  },
  {
    id: 'Konpaku Youmu',
    name: '魂魄妖梦',
    title: '半人半灵的庭师',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#E1CE82',
    reason: '',
    honmei: false,
  },
  {
    id: 'Reisen Udongein Inaba',
    name: '铃仙·优昙华院·因幡',
    title: '狂气的月兔',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#D24B7E',
    reason: '',
    honmei: false,
  },
  {
    id: 'Syameimaru Aya',
    name: '射命丸文',
    title: '传统的幻想记者',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#531319',
    reason: '',
    honmei: false,
  },
  {
    id: 'Cirno',
    name: '琪露诺',
    title: '湖上的冰精',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#9ED5F2',
    reason: '',
    honmei: false,
  },
  {
    id: 'Ibuki Suika',
    name: '伊吹萃香',
    title: '小小的百鬼夜行',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#DD926B',
    reason: '',
    honmei: false,
  },
  {
    id: 'Hinanawi Tenshi',
    name: '比那名居天子',
    title: '非想非非想天之女',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#1365A5',
    reason: '',
    honmei: false,
  },
  {
    id: 'Hata no Kokoro',
    name: '秦心',
    title: '表情丰富的扑克脸',
    image: 'https://thwiki.cc/favicon.ico',
    color: '#DFADE0',
    reason: '',
    honmei: false,
  },
]

export const couplesValid = computed<Couple[]>(() => couples.value.filter((couple) => couple.valid))

export const coupleHonmei = computed<Couple>(() => couplesValid.value.find((couple) => couple.honmei) || new Couple())

export const couplesValidWithoutHonmei = computed<Couple[]>(() => couplesValid.value.filter((couple) => !couple.honmei))