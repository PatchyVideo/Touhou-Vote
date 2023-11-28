import { computed, ref } from 'vue'
import { CachedSearcher, SearchLogicContain } from 'pinin'
import { music0 } from '@/vote-music/lib/music'
import { musicHonmei, musics } from '@/vote-music/lib/voteData'
import { albumSelected, filterForKind } from '@/vote-music/lib/albumList'
import { pinin } from '@/common/lib/pinin'
import type { Music } from '@touhou-vote/shared/data/music'
import { musicList } from '@touhou-vote/shared/data/music'

export { musicList }

export const musicListLeft = computed<Music[]>(() => {
  let list = musicList.filter((music) => {
    let musicInMusics = false
    for (let i = 0; i < musics.value.length; i++) {
      if (musics.value[i].id === music.id) musicInMusics = true
    }
    return music.id != musicHonmei.value.id && !musicInMusics
  })

  if (filterForKind.value.length) {
    list = list.filter((music) => filterForKind.value.find((k1) => music.kind.find((k2) => k2 === k1.value)))
  }

  if (albumSelected.value.name !== '') {
    list = list.filter(
      (music) => music.album === albumSelected.value.name || music.include.includes(albumSelected.value.name)
    )
  }
  return list
})

export const musicsVoted = computed<Music[]>(() => musics.value.filter((mus) => mus.id != music0.id))
export const musicsVotedWithoutHonmei = computed<Music[]>(() => musicsVoted.value.filter((mus) => !mus.honmei))

export const orderOptions = [
  {
    name: '发布正序',
    value: 'newest',
  },
  {
    name: '发布倒序',
    value: 'oldest',
  },
]

export const order = ref(orderOptions[0])
export const keyword = ref('')

const searcher = computed(() => {
  const s = new CachedSearcher<Music>(SearchLogicContain, pinin)

  for (const music of musicListLeft.value) {
    s.put(music.name.toLowerCase(), music)
    s.put(music.album.toLowerCase(), music)
  }

  return s
})
export const musicListLeftWithFilter = computed<Music[]>(() => {
  const res = keyword.value ? [...new Set(searcher.value.search(keyword.value.toLowerCase()))] : musicListLeft.value

  if (order.value.name === orderOptions[0].name) {
    res.sort((a, b) => a.date - b.date)
  } else {
    res.sort((a, b) => b.date - a.date)
  }

  return res
})
