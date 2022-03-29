export class Music {
  id: string
  name: string
  album: string
  date: number
  image: string
  music: string
  reason: string
  honmei: boolean
  kind: ('game' | 'book' | 'CD' | 'others' | '')[]
  constructor(
    id = '',
    name = 'UNDEFINED',
    album = '虚幻的音阶',
    date = 19961103,
    image = 'https://thwiki.cc/favicon.ico',
    music = '',
    reason = '梦的彼岸，能听到大家的欢笑声吗？',
    honmei = false,
    kind: ('game' | 'book' | 'CD' | 'others' | '')[] = ['others']
  ) {
    this.id = id
    this.name = name
    this.album = album
    this.date = date
    this.image = image
    this.music = music
    this.reason = reason
    this.honmei = honmei
    this.kind = kind
  }
}
export const music0 = new Music()
