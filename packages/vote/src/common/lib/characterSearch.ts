import { CachedSearcher, SearchLogicContain } from 'pinin'
import { pinin } from './pinin'

export type SearchableCharacterLike = {
  name: string
  altnames: string[]
  work: string[]
}

export function createCharacterSearcher<T extends SearchableCharacterLike>(list: T[]): CachedSearcher<T> {
  const s = new CachedSearcher<T>(SearchLogicContain, pinin)

  for (const c of list) {
    s.put(c.name.toLowerCase(), c)
    for (const altname of c.altnames) {
      s.put(altname.toLowerCase(), c)
    }
    for (const work of c.work) {
      s.put(work.toLowerCase(), c)
    }
  }

  return s
}

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

export function searchAndSort<T extends SearchableCharacterLike & { date: number }>(
  list: T[],
  keyword: string,
  orderName: string
): T[] {
  // 逻辑修改内容: 判断是否有关键词，没有则直接排序并返回，避免索引构建带来的性能开销
  if (!keyword || !keyword.trim()) {
    return sortCharactersByOrder([...list], orderName)
  }

  // 只有在确实需要搜索时才构建 Searcher
  const searcher = createCharacterSearcher(list)
  const res = [...new Set(searcher.search(keyword.toLowerCase()))]
  
  return sortCharactersByOrder(res, orderName)
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
