import { ref, computed } from 'vue'
import { Music } from '@/vote-music/lib/music'

export const musicHonmei = computed<Music>(() => musics.value.find((music) => music.honmei) || new Music())

export const musics = ref<Music[]>(new Array(12).fill(null).map(() => new Music()))
