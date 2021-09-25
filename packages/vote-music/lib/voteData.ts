import { ref, computed } from 'vue'
import { Music } from '@/vote-music/lib/music'
export const music0: Music = {
  id: '',
  name: 'UNDEFINED',
  album: '虚幻的音阶',
  image: 'https://thwiki.cc/favicon.ico',
  reason: '梦的彼岸，能听到大家的欢笑声吗？',
  honmei: false,
}
export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || music0)
export const musics = ref<Music[]>([
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
  music0,
])
