import { deadline, startTime } from '@touhou-vote/shared/data/time'
import type { VotingTrendItem } from '@/composables/graphql/__generated__/graphql'
const hourOfMs = 60 * 60 * 1000
export const GraphTimeRange = (() => {
  const range: string[] = []
  for (let timer = startTime + hourOfMs; timer <= deadline; timer = timer + hourOfMs) {
    const timePoint = new Date(timer)
    range.push(timePoint.getMonth() + 1 + '-' + timePoint.getDate() + ' ' + timePoint.getHours() + ': 00')
  }
  return range
})()
export interface GraphDataLine {
  name: string
  data: number[]
}
export function getTrendData(name: string, trend: VotingTrendItem[]): GraphDataLine {
  const trendData: GraphDataLine = {
    name: name,
    data: [],
  }
  for (let i = 0; i < GraphTimeRange.length; i++) trendData.data.push(0)
  for (let i = 0; i < trend.length; i++) {
    trendData.data[trend[i].hrs] = trend[i].cnt
  }
  for (let i = 1; i < trendData.data.length; i++) {
    trendData.data[i] = trendData.data[i - 1] + trendData.data[i]
  }
  return trendData
}
