export class Nominate {
  valid: boolean
  type: null | 'music' | 'video' | 'drawings' | 'softwares' | 'articles' | 'crafts' | 'other' // 音乐、视频、绘画&设计、游戏&软件、文学创作、手工制品、其他周边
  url: string
  author: string
  reason: string
  constructor(valid = false, type = null, url = '', author = '', reason = '') {
    this.valid = valid
    this.type = type
    this.url = url
    this.author = author
    this.reason = reason
  }
}
export const Nominate0 = new Nominate()
