import { computed, ref } from 'vue'
import type { VotingTrendItem, ResultTimeline } from '@/composables/graphql/__generated__/graphql'

const hourOfMs = 60 * 60 * 1000

export function graphTimeRange(timeline: ResultTimeline | null | undefined): string[] {
  if (!timeline) return []
  const start = new Date(timeline.voteStart).getTime()
  const end = new Date(timeline.statisticsEnd).getTime()
  const hours = Math.max(0, Math.ceil((end - start) / hourOfMs))
  return Array.from({ length: hours }, (_, hour) => formatTime(new Date(start + hour * hourOfMs)))
}

function formatTime(value: Date | string): string {
  return new Date(value).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

/** One range for every series on the page; missing legacy metadata stays empty. */
export function useResultTimeline() {
  const timeline = ref<ResultTimeline | null>(null)
  const GraphTimeRange = computed(() => graphTimeRange(timeline.value))
  const dateRangeText = computed(() => timeline.value
    ? `投票时间：${formatTime(timeline.value.voteStart)} 至 ${formatTime(timeline.value.voteEnd)}。统计截至 ${formatTime(timeline.value.statisticsEnd)}，结果生成于 ${formatTime(timeline.value.generatedAt)}。`
    : '暂无趋势时间信息。')
  return {
    GraphTimeRange,
    dateRangeText,
    setResultTimeline(value: ResultTimeline | null | undefined) {
      timeline.value = value ?? null
    },
    getAddedTrendData: (name: string, trend: VotingTrendItem[]) =>
      getAddedTrendData(name, trend, GraphTimeRange.value.length),
    getTrendData: (name: string, trend: VotingTrendItem[]) =>
      getTrendData(name, trend, GraphTimeRange.value.length),
  }
}

export interface GraphDataLine {
  name: string
  data: number[]
}
export function getAddedTrendData(name: string, trend: VotingTrendItem[], hours: number): GraphDataLine {
  const trendData: GraphDataLine = {
    name: name,
    data: [],
  }
  for (let i = 0; i < hours; i++) trendData.data.push(0)
  for (let i = 0; i < trend.length; i++) {
    const hour = trend[i].hrs
    if (hour >= 0 && hour < hours) trendData.data[hour] = trend[i].cnt
  }
  return trendData
}
export function getTrendData(name: string, trend: VotingTrendItem[], hours: number): GraphDataLine {
  const trendData: GraphDataLine = getAddedTrendData(name, trend, hours)
  for (let i = 1; i < trendData.data.length; i++) {
    trendData.data[i] = trendData.data[i - 1] + trendData.data[i]
  }
  return trendData
}

export interface GraphDataPie {
  name: string
  value: number
  /** Questionnaire completion uses its cohort as the denominator. */
  rate?: number
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
