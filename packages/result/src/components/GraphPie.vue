<template><div ref="chartDom" class="w-full aspect-4/5 md:aspect-ratio-16/10"></div></template>
<script lang="ts" setup>
import { GraphDataPie } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  data: GraphDataPie[]
  muchLegend?: boolean
}>()

echarts.use([ToolboxComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

type EChartsOption = echarts.ComposeOption<ToolboxComponentOption | TooltipComponentOption | LegendComponentOption>
const option = computed<EChartsOption>(() => {
  const returnData: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {},
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: props.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  const mediaData: EChartsOption = {
    media: [
      {
        query: {
          maxWidth: 500,
        },
        option: {
          series: [
            {
              radius: '50%',
              center: ['50%', '70%'],
            },
          ],
        },
      },
    ],
  }
  props.muchLegend && Object.assign(returnData, mediaData)
  return returnData
})
let GraphPie: echarts.ECharts
const chartDom = ref<HTMLElement>()!
onMounted(() => {
  if (chartDom.value) {
    GraphPie = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphPie.resize())
    option.value && GraphPie.setOption(option.value)
    watchEffect(() => {
      if (props.data.length) option.value && GraphPie.setOption(option.value)
    })
  }
})
</script>
<style lang="postcss" scoped></style>
