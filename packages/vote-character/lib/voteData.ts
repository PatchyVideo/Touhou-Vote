import { ref, computed } from 'vue'
import { Character } from '@/vote-character/lib/character'

export const character0: Character = {
  id: '',
  name: 'ERROR',
  title: '原初的错误',
  image: 'https://thwiki.cc/favicon.ico',
  color: '#000000',
  reason: '相遇，只是再度重逢',
  honmei: false,
}
export const characterHonmei = computed<Character>(
  () => characters.value.find((character) => character.honmei) || character0
)
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
