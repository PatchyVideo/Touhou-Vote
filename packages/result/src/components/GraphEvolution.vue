<template>
  <div class="relative">
    <div ref="chartDom" class="w-full aspect-ratio-1/1 md:aspect-ratio-16/10"></div>
    <div v-if="!xAxis.length || !hasVotes" class="absolute inset-0 flex items-center justify-center bg-white text-gray-500">
      {{ xAxis.length ? '暂无投票数据' : '暂无趋势时间信息' }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { GraphDataLine } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import type {
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import type { LineSeriesOption } from 'echarts/charts'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  xAxis: string[]
  data: GraphDataLine[]
}>()

const hasVotes = computed(() => props.data.some((series) => series.data.some((count) => count !== 0)))

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LegendComponentOption
  | LineSeriesOption
>
const option = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    grid: {
      left: '10',
      containLabel: true,
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none',
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: props.data.map((item) => {
      return {
        name: item.name,
        type: 'line',
        data: item.data,
      }
    }),
  }
})

let GraphEvolution: echarts.ECharts
const chartDom = ref<HTMLElement>()!
onMounted(() => {
  if (chartDom.value) {
    GraphEvolution = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphEvolution.resize())
    option.value && GraphEvolution.setOption(option.value)
    watchEffect(() => {
      GraphEvolution.setOption(option.value, { replaceMerge: ['series'] })
    })
  }
})
</script>
<style lang="postcss" scoped></style>
