import { computed, ref, watch } from 'vue'
import { Character } from './character'
import { characterList } from './characterList'
import type { CharacterSubmitQuery } from '@/graphql/__generated__/graphql'

export const CHARACTERVOTENUM = 8

// Honmei data, as New Character if no data
// READONLY
export const characterHonmei = computed<Character>(
  () => characters.value.find((character) => character.honmei) || new Character()
)
// Vote data, including blank ticket seat (as New Character)
export const characters = ref<Character[]>(new Array(CHARACTERVOTENUM).fill(null).map(() => new Character()))

watch(characters.value, setVoteDataCharacters, { deep: true })
function setVoteDataCharacters(): void {
  localStorage.setItem('voteCharacter', JSON.stringify(characters.value))
}

export function updateVoteCharacters(newVoteData: CharacterSubmitQuery[]): void {
  const charactersDataLocal: Character[] = JSON.parse(localStorage.getItem('voteCharacter') || '[]')
  if (JSON.stringify(charactersDataLocal) != '[]') {
    characters.value = charactersDataLocal
  } else if (newVoteData.length) {
    characters.value = new Array(CHARACTERVOTENUM).fill(null).map(() => new Character())
    for (let i = 0; i < newVoteData.length; i++) {
      const characterData = characterList.find((item) => item.id === newVoteData[i].id) || characters.value[i]
      characterData.honmei = newVoteData[i].first || false
      characterData.reason = newVoteData[i].reason || ''
      characters.value[i] = characterData
    }
  }
}
