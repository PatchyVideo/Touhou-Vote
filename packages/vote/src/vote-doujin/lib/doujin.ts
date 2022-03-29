export class Doujin {
  dojinType: '' | 'MUSIC' | 'VIDEO' | 'DRAWING' | 'SOFTWARE' | 'ARTICLE' | 'CRAFT' | 'OTHER'
  url: string
  title: string
  author: string
  reason: string
  imageUrl: string
  constructor(
    dojinType: '' | 'MUSIC' | 'VIDEO' | 'DRAWING' | 'SOFTWARE' | 'ARTICLE' | 'CRAFT' | 'OTHER' = '',
    url = 'https://touhou.vote/',
    title = '新版中文东方人气投票',
    author = '东方众们',
    reason = '只要大家齐心协力，就能向着崭新的明天展翅飞翔，前进吧！',
    imageUrl = 'https://upload.thwiki.cc/b/b3/Cover.png'
  ) {
    this.dojinType = dojinType
    this.url = url
    this.title = title
    this.author = author
    this.reason = reason
    this.imageUrl = imageUrl
  }
}
export const Doujin0 = new Doujin()

export const Doujin0NoImageUrl = 'https://upload.thwiki.cc/5/51/NoImage.png'

interface DoujinType {
  name: string
  value: '' | 'MUSIC' | 'VIDEO' | 'DRAWING' | 'SOFTWARE' | 'ARTICLE' | 'CRAFT' | 'OTHER'
  color: string
}
export const doujinTypes: DoujinType[] = [
  {
    name: '',
    value: '',
    color: '#000000',
  },
  {
    name: '音乐',
    value: 'MUSIC',
    color: '#4caf50',
  },
  {
    name: '视频',
    value: 'VIDEO',
    color: '#FF9800',
  },
  {
    name: '绘画&设计',
    value: 'DRAWING',
    color: '#D6C231',
  },
  {
    name: '游戏&软件',
    value: 'SOFTWARE',
    color: '#f77194',
  },
  {
    name: '文学创作',
    value: 'ARTICLE',
    color: '#0075c5',
  },
  {
    name: '手工制品',
    value: 'CRAFT',
    color: '#6339b5',
  },
  {
    name: '其他周边',
    value: 'OTHER',
    color: '#733542',
  },
]

export function getDoujinTypeData(value: DoujinType['value']): DoujinType {
  return doujinTypes.find((v) => v.value === value) || doujinTypes[0]
}
