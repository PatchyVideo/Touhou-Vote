export const orderOptions = [
  {
    name: '出场正序',
    value: 'newest',
  },
  {
    name: '出场倒序',
    value: 'oldest',
  },
]

export function sortCharactersByOrder<T extends { date: number }>(list: T[], orderName: string): T[] {
  if (orderName === orderOptions[0].name) {
    list.sort((a, b) => a.date - b.date)
  } else {
    list.sort((a, b) => b.date - a.date)
  }
  return list
}

export function filterCharactersByMeta<T extends { kind: string[]; work: string[] }>(
  list: T[],
  kinds?: string[],
  workName?: string
): T[] {
  let result = list
  if (kinds && kinds.length) {
    result = result.filter((chara) => chara.kind.some((k) => kinds.includes(k)))
  }
  if (workName) {
    result = result.filter((chara) => chara.work.some((w) => w === workName))
  }
  return result
}
