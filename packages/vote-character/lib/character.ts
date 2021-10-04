export class Character {
  id: string
  name: string
  title: string
  image: string
  color: string
  reason: string
  honmei: boolean
  constructor(
    id = '',
    name = 'ERROR',
    title = '原初的错误',
    image = 'https://thwiki.cc/favicon.ico',
    color = '#000000',
    reason = '相遇，只是再度重逢',
    honmei = false
  ) {
    this.id = id
    this.name = name
    this.title = title
    this.image = image
    this.color = color
    this.reason = reason
    this.honmei = honmei
  }
}
export const character0 = new Character()
