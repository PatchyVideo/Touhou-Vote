import { computed, ref } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'
import { characterList } from '@/vote-character/lib/characterList'
import type { CpSubmitQuery } from '@/graphql/__generated__/graphql'
import { Character } from '@/vote-character/lib/character'

// Honmei data, as New Couple if no data
// READONLY
export const CPVOTENUM = 4

// Vote data, including blank ticket seat (as New Couple)
export const coupleHonmei = computed<Couple>(() => couples.value.find((couple) => couple.honmei) || new Couple())

export const couples = ref<Couple[]>(new Array(CPVOTENUM).fill(null).map(() => new Couple()))
export function updateVotecouple(coupleVoteData: CpSubmitQuery[]): void {
  if (!coupleVoteData.length) return
  couples.value = new Array(CPVOTENUM).fill(null).map(() => new Couple())
  for (let i = 0; i < coupleVoteData.length; i++) {
    const coupleData = new Couple()
    coupleData.characters[0] = characterList.find((item) => item.id === coupleVoteData[i].idA) || new Character()
    coupleData.characters[1] = characterList.find((item) => item.id === coupleVoteData[i].idB) || new Character()
    if (coupleVoteData[i].nameC)
      coupleData.characters[2] = characterList.find((item) => item.id === coupleVoteData[i].idC) || new Character()
    if (coupleVoteData[i].active)
      coupleData.seme = coupleData.characters.findIndex((item) => item.id === coupleVoteData[i].active)
    if (coupleVoteData[i].first) coupleData.honmei = true
    if (coupleVoteData[i].reason) coupleData.reason = coupleVoteData[i].reason || ''
    coupleData.valid = true
    couples.value[i] = coupleData
  }
}
