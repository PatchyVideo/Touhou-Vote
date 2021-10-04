import { ref, computed } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'
import { character0 } from '@/vote-character/lib/voteData'

export const couples = ref<Couple[]>([couple0, couple0, couple0, couple0])
export const couplesValid = computed<Couple[]>(() => couples.value.filter((couple) => couple.valid))
