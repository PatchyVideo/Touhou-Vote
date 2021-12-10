import { ref, computed } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { characterList } from '@/vote-character/lib/characterList'
import { CharacterSubmitQuery } from '@/graphql/__generated__/graphql'

export const characterHonmei = computed<Character>(
  () => characters.value.find((character) => character.honmei) || new Character()
)
export const characters = ref<Character[]>(new Array(8).fill(null).map(() => new Character()))

export function updateVotecharacters(characterVoteData: CharacterSubmitQuery[]): void {
  for (let i = 0; i < characterVoteData.length; i++) {
    characters.value[i] = characterList.find((item) => item.name === characterVoteData[i].name) || characters.value[i]
    characters.value[i].honmei = characterVoteData[i].first || false
    characters.value[i].reason = characterVoteData[i].reason || ''
  }
}
