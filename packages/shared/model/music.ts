export interface Album {
  name: string
  kind: 'game' | 'book' | 'CD' | 'others' | ''
}

export class Music {
  id: string
  name: string
  origname: string
  album: string
  date: number
  image: string
  music: string
  reason: string
  honmei: boolean
  kind: ('game' | 'book' | 'CD' | 'others' | '')[]
  include: string[]
  constructor(
    id = '00000000',
    name = 'UNDEFINED',
    origname = 'UNDEFINED',
    album = '虚幻的音阶',
    date = 19961103,
    image = 'https://static.thwiki.cc/favicon.png',
    music = '',
    reason = '梦的彼岸，能听到大家的欢笑声吗？',
    honmei = false,
    kind: ('game' | 'book' | 'CD' | 'others' | '')[] = ['others'],
    include = []
  ) {
    this.id = id
    this.name = name
    this.origname = origname
    this.album = album
    this.date = date
    this.image = image
    this.music = music
    this.reason = reason
    this.honmei = honmei
    this.kind = kind
    this.include = include
  }
}
