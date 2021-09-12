import { ref } from 'vue'
import { Music } from '@/vote-music/lib/music'
export const music0: Music = {
  id: '',
  name: 'UNDEFINED',
  album: '虚幻的音阶',
  image: 'https://thwiki.cc/favicon.ico',
}
export const musicHonmei = ref<Music>(music0)
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
])
