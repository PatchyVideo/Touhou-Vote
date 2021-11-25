export class Character {
  id: string
  name: string
  altnames: string[]
  title: string
  image: string
  color: string
  reason: string
  honmei: boolean
  date: number
  kind: ('old' | 'new' | 'book' | 'CD' | 'others' | '')[]
  work: string[]
  constructor(
    id = '',
    name = 'ERROR',
    altnames: string[] = [],
    title = '原初的错误',
    image = 'https://thwiki.cc/favicon.ico',
    color = '#000000',
    reason = '相遇，只是再度重逢',
    date = 19961103,
    honmei = false,
    kind: ('old' | 'new' | 'book' | 'CD' | 'others' | '')[] = ['others'],
    work = ['其他']
  ) {
    this.id = id
    this.name = name
    this.altnames = altnames
    this.title = title
    this.image = image
    this.color = color
    this.reason = reason
    this.honmei = honmei
    this.date = date
    this.kind = kind
    this.work = work
  }
}
export const character0 = new Character()
