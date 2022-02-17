import { ref } from 'vue'
import { Doujin } from '@/vote-doujin/lib/doujin'
import { DojinSubmitQuery } from '@/graphql/__generated__/graphql'

export const doujins = ref<Doujin[]>(
  Array(5)
    .fill(null)
    .map(() => new Doujin())
)
export function setVoteDataDoujins(): void {
  localStorage.setItem('doujins', JSON.stringify(doujins.value))
}
export function updateVoteDataDoujins(doujinVoteData: DojinSubmitQuery[]): void {
  const doujinsData: Doujin[] = JSON.parse(localStorage.getItem('doujins') || '[]')
  if (JSON.stringify(doujinsData) != '[]') {
    doujins.value = doujinsData
  } else if (doujinVoteData.length) {
    for (let i = 0; i < doujinVoteData.length; i++) {
      let doujinData = new Doujin()
      doujinData.author = doujinVoteData[i].author
      doujinData.dojinType = doujinVoteData[i].dojinType
      doujinData.reason = doujinVoteData[i].reason
      doujinData.title = doujinVoteData[i].title
      doujinData.url = doujinVoteData[i].url
      doujins.value[i] = doujinData
    }
  }
}
