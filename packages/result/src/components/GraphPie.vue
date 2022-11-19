<template>
  <div>
    <div
      class="text-center py-1 mb-1 cursor-pointer border-y border-accent-200 transition transition-colors hover:text-accent-600"
      @click="changeGraph()"
    >
      点击这里切换图表类型
    </div>
    <div ref="chartDom" class="w-full aspect-ratio-4/5 md:aspect-ratio-16/10"></div>
  </div>
</template>
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
import { PieChart, BarChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getGraphBarOption } from '@/lib/graphBar'

const props = defineProps<{
  data: GraphDataPie[]
  muchLegend?: boolean
}>()

echarts.use([ToolboxComponent, TooltipComponent, LegendComponent, PieChart, BarChart, CanvasRenderer, LabelLayout])

type EChartsOption = echarts.ComposeOption<ToolboxComponentOption | TooltipComponentOption | LegendComponentOption>
const option = computed<EChartsOption>(() => {
  const returnData: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}({d}%)',
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
        data: props.data.sort((a, b) => b.value - a.value),
        label: {
          formatter: '{b}: {c}({d}%)',
        },
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

const showGraph = ref(true)
function changeGraph() {
  showGraph.value = !showGraph.value
  const graphOption = showGraph.value
    ? option.value
    : getGraphBarOption(
        props.data.sort((a, b) => b.value - a.value).map((item) => item.name),
        props.data.sort((a, b) => b.value - a.value).map((item) => item.value)
      )
  GraphPie.setOption(graphOption, true)
}
</script>
<style lang="postcss" scoped></style>
