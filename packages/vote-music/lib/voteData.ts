import { ref, computed } from 'vue'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import { MusicSubmitQuery } from '@/graphql/__generated__/graphql'

export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || new Music())

export const musics = ref<Music[]>(new Array(12).fill(null).map(() => new Music()))
export function updateVotemusics(musicVoteData: MusicSubmitQuery[]): void {
  if (!musicVoteData.length) return
  for (let i = 0; i < musicVoteData.length; i++) {
    let musicData = musicList.find((item) => item.name === musicVoteData[i].name) || musics.value[i]
    musicData.honmei = musicVoteData[i].first || false
    musicData.reason = musicVoteData[i].reason || ''
    musics.value[i] = musicData
  }
}
