import { CachedSearcher, SearchLogicContain } from 'pinin'
import { pinin } from '../../common/lib/pinin'

export type SearchableMusicLike = {
  name: string
  album: string
  altnames: string[]
}

/**
 * 构建曲目本地搜索索引：name + album + altnames（别名）。
 * 与角色侧 characterSearch.createCharacterSearcher 对称，别名同样可命中。
 */
export function createMusicSearcher<T extends SearchableMusicLike>(list: T[]): CachedSearcher<T> {
  const s = new CachedSearcher<T>(SearchLogicContain, pinin)

  for (const music of list) {
    s.put(music.name.toLowerCase(), music)
    s.put(music.album.toLowerCase(), music)
    for (const altname of music.altnames) {
      s.put(altname.toLowerCase(), music)
    }
  }

  return s
}
