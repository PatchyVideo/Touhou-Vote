<template><div ref="chartDom" class="w-full aspect-1/1 md:aspect-ratio-16/10"></div></template>
<script lang="ts" setup>
import { GraphDataRadar } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  indicator: string[]
  data: GraphDataRadar[]
}>()

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
  UniversalTransition,
])

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | ToolboxComponentOption | TooltipComponentOption | LegendComponentOption
>
const option = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {},
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    radar: {
      indicator: props.indicator.map((item) => {
        return {
          name: item,
          max: maxData.value,
        }
      }),
    },
    series: [
      {
        type: 'radar',
        data: props.data,
      },
    ],
  }
})

let GraphEvolution: echarts.ECharts
const chartDom = ref<HTMLElement>()!
const maxData = computed<number>(() => {
  let max = 200
  props.data[0].value.map((item) => {
    if (item > max) max = item
  })
  return max * 1.25
})
onMounted(() => {
  if (chartDom.value) {
    GraphEvolution = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphEvolution.resize())
    option.value && GraphEvolution.setOption(option.value)
    watchEffect(() => {
      if (props.indicator.length) option.value && GraphEvolution.setOption(option.value)
    })
  }
})
</script>
<style lang="postcss" scoped></style>
