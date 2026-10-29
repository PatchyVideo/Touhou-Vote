import assert from 'node:assert/strict'
import test from 'node:test'
import { createMusicSearcher, type SearchableMusicLike } from '../musicSearch'

const song = (name: string, album: string, altnames: string[] = []): SearchableMusicLike => ({
  name,
  album,
  altnames,
})

test('按别名命中曲目', () => {
  const list = [
    song('Bad Apple!!', '东方幻想乡', ['烂苹果']),
    song('U.N.オーエンは彼女なのか？', '东方红魔乡', ['UN Owen', '二小姐主题曲']),
  ]
  const searcher = createMusicSearcher(list)

  assert.deepEqual([...new Set(searcher.search('烂苹果'))], [list[0]])
  assert.deepEqual([...new Set(searcher.search('二小姐主题曲'))], [list[1]])
})

test('按名称命中（大小写不敏感）', () => {
  const list = [song('Bad Apple!!', '东方幻想乡')]
  const searcher = createMusicSearcher(list)

  assert.deepEqual([...new Set(searcher.search('bad apple'))], [list[0]])
})

test('按专辑名命中', () => {
  const list = [song('Bad Apple!!', '东方幻想乡')]
  const searcher = createMusicSearcher(list)

  assert.deepEqual([...new Set(searcher.search('幻想乡'))], [list[0]])
})

test('无别名时索引不报错且不影响名称/专辑搜索', () => {
  const list = [
    song('A Sacred Lot', '东方灵异传'),
    song('Bad Apple!!', '东方幻想乡', ['烂苹果']),
  ]
  const searcher = createMusicSearcher(list)

  assert.deepEqual([...new Set(searcher.search('sacred'))], [list[0]])
  assert.deepEqual([...new Set(searcher.search('烂苹果'))], [list[1]])
})
