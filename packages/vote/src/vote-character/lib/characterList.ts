import { computed, ref } from 'vue'
import type { Character } from './character'
import { character0 } from './character'
import { characterHonmei, characters } from './voteData'
import { filterForKind, workSelected } from './workList'
import { characterList } from '@touhou-vote/shared/data/character'
import { orderOptions as sharedOrderOptions, filterCharactersByMeta, searchAndSort } from '@/common/lib/characterSearch'

export { characterList }

export const characterListLeft = computed<Character[]>(() => {
  let charaList = characterList.filter((character) => {
    let characterInCharacters = false
    for (let i = 0; i < characters.value.length; i++) {
      if (characters.value[i].id === character.id) characterInCharacters = true
    }
    return character.id != characterHonmei.value.id && !characterInCharacters
  })

  const kinds = filterForKind.value.map((k) => k.value)
  charaList = filterCharactersByMeta(charaList, kinds, workSelected.value.name || undefined)

  return charaList
})

export const charactersVoted = computed<Character[]>(() =>
  characters.value.filter((chara) => chara.id != character0.id)
)
export const charactersVotedWithoutHonmei = computed<Character[]>(() => {
  return charactersVoted.value.filter((chara) => !chara.honmei)
})

export const orderOptions = sharedOrderOptions
export const order = ref(orderOptions[0])
export const keyword = ref('')
export const characterListLeftWithFilter = computed<Character[]>(() => {
  return searchAndSort<Character>(characterListLeft.value, keyword.value, order.value.name)
})
