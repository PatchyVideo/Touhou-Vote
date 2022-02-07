import { computed } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'
import { couples } from '@/vote-couple/lib/voteData'

export const couplesValid = computed<Couple[]>(() => couples.value.filter((couple) => couple.valid))

export const coupleHonmei = computed<Couple>(() => couplesValid.value.find((couple) => couple.honmei) || new Couple())

export const couplesValidWithoutHonmei = computed<Couple[]>(() => couplesValid.value.filter((couple) => !couple.honmei))
