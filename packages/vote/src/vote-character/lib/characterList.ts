import { computed, ref } from 'vue'
import type { Character } from './character'
import { character0 } from './character'
import { characterHonmei, characters } from './voteData'
import { filterForKind, workSelected } from './workList'
import { characterGroupsRaw, characterListFromBackend } from '@/common/lib/voteObjectsDataSource'
import {
  filterCharactersByMeta,
  orderOptions as sharedOrderOptions,
  sortCharactersByOrder,
} from '@/common/lib/characterSearch'
import { useCandidateSearch } from '@/common/lib/useCandidateSearch'

export const characterList = characterListFromBackend

export const characterListLeft = computed<Character[]>(() => {
  let charaList = characterList.value.filter((character) => {
    let characterInCharacters = false
    for (let i = 0; i < characters.value.length; i++) {
      if (characters.value[i].id === character.id) characterInCharacters = true
    }
    return character.id != characterHonmei.value.id && !characterInCharacters
  })

  const kinds = filterForKind.value.map((k) => k.value)
  charaList = filterCharactersByMeta(charaList, kinds, workSelected.value.name || undefined)

  if (!charaList.length) {
    console.warn('[DEBUG characterListLeft] EMPTY!', {
      totalChars: characterList.value.length,
      groupsRawLen: characterGroupsRaw.value.length,
      votedIds: characters.value.map((c) => c.id),
      honmeiId: characterHonmei.value.id,
      filterForKindN: filterForKind.value.length,
      kinds,
      workSelected: workSelected.value.name,
    })
  }

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
const candidateSearch = useCandidateSearch('character', keyword)
export const characterSearchLoading = candidateSearch.loading
export const characterSearchError = candidateSearch.error
export const characterListLeftWithFilter = computed<Character[]>(() => {
  const list = keyword.value.trim()
    ? characterListLeft.value.filter((item) => candidateSearch.matchedIds.value.has(item.id))
    : characterListLeft.value
  return sortCharactersByOrder([...list], order.value.name)
})
