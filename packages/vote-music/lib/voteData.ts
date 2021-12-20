import { ref, computed } from 'vue'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import { MusicSubmitQuery } from '@/graphql/__generated__/graphql'

export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || new Music())

export const musics = ref<Music[]>(new Array(12).fill(null).map(() => new Music()))
export function updateVotemusics(musicVoteData: MusicSubmitQuery[]): void {
  if (!musicVoteData.length) return
  for (let i = 0; i < musicVoteData.length; i++) {
    musics.value[i] = musicList.find((item) => item.name === musicVoteData[i].name) || musics.value[i]
    musics.value[i].honmei = musicVoteData[i].first || false
    musics.value[i].reason = musicVoteData[i].reason || ''
  }
}
