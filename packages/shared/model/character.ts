export class Character {
  id: string
  name: string
  origname: string
  altnames: string[]
  title: string
  image: string
  color: string
  reason: string
  honmei: boolean
  date: number
  kind: ('old' | 'new' | 'book' | 'CD' | 'others' | '')[]
  work: string[]
  workIds: number[]
  constructor(
    id = '00000000',
    name = 'ERROR',
    origname = 'ERROR',
    altnames: string[] = [],
    title = '原初的错误',
    image = 'https://static.thwiki.cc/favicon.png',
    color = '#000000',
    reason = '相遇，只是再度重逢',
    date = 19961103,
    honmei = false,
    kind: ('old' | 'new' | 'book' | 'CD' | 'others' | '')[] = ['others'],
    work = ['其他'],
    workIds: number[] = [],
  ) {
    this.id = id
    this.name = name
    this.origname = origname
    this.altnames = altnames
    this.title = title
    this.image = image
    this.color = color
    this.reason = reason
    this.honmei = honmei
    this.date = date
    this.kind = kind
    this.work = work
    this.workIds = workIds
  }
}
