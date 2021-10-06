import { ref, computed } from 'vue'
import { Couple } from '@/vote-couple/lib/couple'

export const couples = ref<Couple[]>(
  Array(4)
    .fill(null)
    .map(() => new Couple())
)
export const coupleHonmei = computed<Couple>(() => couples.value.find((couple) => couple.honmei) || new Couple())
