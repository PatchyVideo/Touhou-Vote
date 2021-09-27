import { ref, computed } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'
import { character0 } from '@/vote-character/lib/voteData'

export const Couple0: Couple = {
  seme: character0,
  uke: character0,
  honmei: false,
}
export const coupleHonmei = computed<Couple>(() => couples.value.find((couple) => couple.honmei) || Couple0)
export const couples = ref<Couple[]>([Couple0, Couple0, Couple0])
