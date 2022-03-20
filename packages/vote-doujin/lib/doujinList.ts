import { computed } from 'vue'
import type { Doujin } from '@/vote-doujin/lib/doujin'
import { Doujin0 } from '@/vote-doujin/lib/doujin'
import { doujins } from '@/vote-doujin/lib/voteData'

export const doujinValid = computed<Doujin[]>(() =>
  doujins.value.filter((doujin) => doujin.dojinType != Doujin0.dojinType)
)
