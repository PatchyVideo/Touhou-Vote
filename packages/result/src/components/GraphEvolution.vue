<template><div ref="chartDom" class="w-full aspect-1/1 md:aspect-ratio-16/10"></div></template>
<script lang="ts" setup>
import { GraphDataLine } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  xAxis: string[]
  data: GraphDataLine[]
}>()

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
      if (props.xAxis.length) option.value && GraphEvolution.setOption(option.value)
    })
  }
})
</script>
<style lang="postcss" scoped></style>
