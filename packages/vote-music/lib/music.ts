export class Music {
  id: string
  name: string
  album: string
  image: string
  reason: string
  honmei: boolean
  constructor(
    id = '',
    name = 'UNDEFINED',
    album = '虚幻的音阶',
    image = 'https://thwiki.cc/favicon.ico',
    reason = '梦的彼岸，能听到大家的欢笑声吗？',
    honmei = false
  ) {
    this.id = id
    this.name = name
    this.album = album
    this.image = image
    this.reason = reason
    this.honmei = honmei
  }
}
export const music0 = new Music()
