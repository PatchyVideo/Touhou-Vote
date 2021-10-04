import { ref, computed } from 'vue'
import { Character } from '@/vote-character/lib/character'

export const characterHonmei = computed<Character>(
  () => characters.value.find((character) => character.honmei) || new Character()
)
export const characters = ref<Character[]>(new Array(8).fill(null).map(() => new Character()))
