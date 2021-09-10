import { ref } from 'vue'
import { Character } from '@/vote-character/lib/character'
export const character0: Character = {
  id: '',
  name: 'ERROR',
  title: '原初的错误',
  image: 'https://thwiki.cc/favicon.ico',
  color: '#FFFFFF',
}
export const characterHonmei = ref<Character>(character0)
export const characters = ref<Character[]>([
  character0,
  character0,
  character0,
  character0,
  character0,
  character0,
  character0,
  character0,
])
