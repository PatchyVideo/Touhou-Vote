<template><div ref="chartDom" class="w-full aspect-1/1 md:aspect-16/10"></div></template>
<script lang="ts" setup>
import { GraphDataSunburst } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
/* Attention: Sunburst Chart lacks the "label-position: outside" option, so we give it up 💩 */
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  data: GraphDataSunburst[]
  dataOut: GraphDataSunburst[]
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
        radius: ['0%', '40%'],
        label: {
          position: 'outside',
        },
        labelLine: {
          length: 50,
        },
        data: props.data.sort((a, b) => Number(a.id) - Number(b.id)),
      },
      {
        type: 'pie',
        radius: ['40%', '50%'],
        label: {
          show: false,
        },
        itemStyle: { color: (params: any) => (params.dataIndex % 2 ? '#0891b2' : '#0369a1') },
        data: props.dataOut.sort((a, b) => Number(a.id) - Number(b.id)),
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
              center: ['50%', '70%'],
            },
            {
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
let GraphSunburst: echarts.ECharts
const chartDom = ref<HTMLElement>()!
onMounted(() => {
  if (chartDom.value) {
    GraphSunburst = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphSunburst.resize())
    option.value && GraphSunburst.setOption(option.value)
    watchEffect(() => {
      if (props.data.length) option.value && GraphSunburst.setOption(option.value)
    })
  }
})
</script>
<style lang="postcss" scoped></style>
