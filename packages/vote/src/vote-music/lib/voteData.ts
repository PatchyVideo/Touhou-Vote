import { draftRevision } from '@/vote-card/lib/voteDraftBridge'
import { computed, ref, watch } from 'vue'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import type { MusicSubmitQuery } from '@/graphql/__generated__/graphql'

export const MUSICVOTENUM = 12

// Honmei data, as New Music if no data
// READONLY
export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || new Music())

// Vote data, including blank ticket seat (as New Music)
export const musics = ref<Music[]>(new Array(MUSICVOTENUM).fill(null).map(() => new Music()))

let stopPersistence = watch(musics, setVoteDataMusics, { deep: true })
function setVoteDataMusics(): void {
  localStorage.setItem('musics', JSON.stringify(musics.value))
  draftRevision.value++
}

export function updateVoteMusics(newVoteData: MusicSubmitQuery[]): void {
  const musicsDataLocal: Music[] = JSON.parse(localStorage.getItem('musics') || '[]')
  if (JSON.stringify(musicsDataLocal) != '[]') {
    musics.value = musicsDataLocal
  } else if (newVoteData.length) {
    musics.value = new Array(MUSICVOTENUM).fill(null).map(() => new Music())
    for (let i = 0; i < newVoteData.length; i++) {
      const musicData = musicList.value.find((item) => item.id === newVoteData[i].id) || musics.value[i]
      musicData.honmei = newVoteData[i].first || false
      musicData.reason = newVoteData[i].reason || ''
      musics.value[i] = musicData
    }
  }
}

export function resetMusicDraftMemory(): void {
  stopPersistence()
  musics.value = new Array(MUSICVOTENUM).fill(null).map(() => new Music())
  stopPersistence = watch(musics, setVoteDataMusics, { deep: true })
}
