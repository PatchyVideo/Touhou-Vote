import { ref, computed } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'
import { characterList } from '@/vote-character/lib/characterList'
import { CpSubmitQuery } from '@/graphql/__generated__/graphql'
import { Character } from '@/vote-character/lib/character'

export const couples = ref<Couple[]>(
  Array(4)
    .fill(null)
    .map(() => new Couple())
)
export const coupleHonmei = computed<Couple>(() => couples.value.find((couple) => couple.honmei) || new Couple())

export function updateVotecouple(coupleVoteData: CpSubmitQuery[]): void {
  if (!coupleVoteData.length) return
  for (let i = 0; i < coupleVoteData.length; i++) {
    couples.value[i].characters[0] =
      characterList.find((item) => item.name === coupleVoteData[i].nameA) || new Character()
    couples.value[i].characters[1] =
      characterList.find((item) => item.name === coupleVoteData[i].nameB) || new Character()
    if (coupleVoteData[i].nameC)
      couples.value[i].characters[2] =
        characterList.find((item) => item.name === coupleVoteData[i].nameC) || new Character()
    if (coupleVoteData[i].active)
      couples.value[i].seme = couples.value[i].characters.findIndex((item) => item.name === coupleVoteData[i].active)
    if (coupleVoteData[i].first) couples.value[i].honmei = true
    couples.value[i].valid = true
  }
}
