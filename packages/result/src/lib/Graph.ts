import { deadline, startTime, timeFormat } from '@touhou-vote/shared/data/time'
import type { VotingTrendItem } from '@/composables/graphql/__generated__/graphql'
const hourOfMs = 60 * 60 * 1000
export const GraphTimeRange = (() => {
  const range: string[] = []
  for (let timer = startTime + hourOfMs; timer <= deadline; timer = timer + hourOfMs) {
    range.push(timeFormat(new Date(timer)))
  }
  return range
})()

export interface GraphDataLine {
  name: string
  data: number[]
}
export function getAddedTrendData(name: string, trend: VotingTrendItem[]): GraphDataLine {
  const trendData: GraphDataLine = {
    name: name,
    data: [],
  }
  for (let i = 0; i < GraphTimeRange.length; i++) trendData.data.push(0)
  for (let i = 0; i < trend.length; i++) {
    trendData.data[trend[i].hrs] = trend[i].cnt
  }
  return trendData
}
export function getTrendData(name: string, trend: VotingTrendItem[]): GraphDataLine {
  const trendData: GraphDataLine = getAddedTrendData(name, trend)
  for (let i = 1; i < trendData.data.length; i++) {
    trendData.data[i] = trendData.data[i - 1] + trendData.data[i]
  }
  return trendData
}

export interface GraphDataPie {
  name: string
  value: number
}
export interface GraphDataSunburst {
  id: string
  name: string
  value: number
}
export interface GraphDataRadar {
  name: string
  value: number[]
}
export interface GraphDataMap {
  name: string
  value: number
}
