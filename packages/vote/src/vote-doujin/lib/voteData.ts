import { ref, watch } from 'vue'
import { Doujin, Doujin0 } from '@/vote-doujin/lib/doujin'
import type { DojinSubmitQuery } from '@/graphql/__generated__/graphql'

export const doujins = ref<Doujin[]>(new Array(5).fill(null).map(() => new Doujin()))

watch(doujins.value, setVoteDataDoujins, { deep: true })
function setVoteDataDoujins(): void {
  localStorage.setItem('doujins', JSON.stringify(doujins.value))
}

export function updateVoteDataDoujins(doujinVoteData: DojinSubmitQuery[]): void {
  const doujinsDatalocal: Doujin[] = JSON.parse(localStorage.getItem('doujins') || '[]')
  if (JSON.stringify(doujinsDatalocal) != '[]') {
    doujins.value = doujinsDatalocal
  } else if (doujinVoteData.length) {
    for (let i = 0; i < doujinVoteData.length; i++) {
      const doujinData = new Doujin()
      doujinData.author = doujinVoteData[i].author
      doujinData.dojinType = doujinVoteData[i].dojinType
      doujinData.imageUrl = doujinVoteData[i].imageUrl || Doujin0.imageUrl
      doujinData.reason = doujinVoteData[i].reason
      doujinData.title = doujinVoteData[i].title
      doujinData.url = doujinVoteData[i].url
      doujins.value[i] = doujinData
    }
  }
}
