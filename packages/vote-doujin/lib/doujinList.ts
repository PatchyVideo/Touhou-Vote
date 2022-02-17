import { computed } from 'vue'
import { Doujin, Doujin0 } from '@/vote-doujin/lib/doujin'
import { doujins } from '@/vote-doujin/lib/voteData'

export const doujinValid = computed<Doujin[]>(() =>
  doujins.value.filter((doujin) => doujin.dojinType != Doujin0.dojinType)
)
