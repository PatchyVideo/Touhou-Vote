import { computed, ref } from 'vue'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import type { MusicSubmitQuery } from '@/graphql/__generated__/graphql'

// Honmei data, as New Music if no data
// READONLY
export const MUSICVOTENUM = 12

// Vote data, including blank ticket seat (as New Music)
export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || new Music())

export const musics = ref<Music[]>(new Array(MUSICVOTENUM).fill(null).map(() => new Music()))
export function updateVoteMusics(newVoteData: MusicSubmitQuery[]): void {
  if (!newVoteData.length) return
  musics.value = new Array(MUSICVOTENUM).fill(null).map(() => new Music())
  for (let i = 0; i < newVoteData.length; i++) {
    const musicData = musicList.find((item) => item.id === newVoteData[i].id) || musics.value[i]
    musicData.honmei = newVoteData[i].first || false
    musicData.reason = newVoteData[i].reason || ''
    musics.value[i] = musicData
  }
}
