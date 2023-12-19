<template>
  <div>
    <div
      class="text-center py-1 mb-1 cursor-pointer border-y border-accent-200 transition transition-colors hover:text-accent-600"
      @click="changeGraph()"
    >
      点击这里切换图表类型
    </div>
    <div ref="chartDom" class="w-full aspect-ratio-1/1 md:aspect-ratio-16/10"></div>
  </div>
</template>
<script lang="ts" setup>
import type { GraphDataRadar } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import type {
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import { LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { BarChart, RadarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { sum } from 'd3'
import { getGraphBarOption } from '@/lib/graphBar'

const props = defineProps<{
  indicator: string[]
  data: GraphDataRadar[]
  voteTotal: number
  voteMale: number
  voteFamale: number
}>()

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  BarChart,
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
      formatter: function (params: any): HTMLElement {
        return getFormatter(params.data.name, params.data.value)
      },
    },
    legend: {
      selected: {
        男性票数: false,
        女性票数: false,
      },
    },
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
        data: dataWithRelativeScale.value,
      },
    ],
  }
})

let GraphRadar: echarts.ECharts
const chartDom = ref<HTMLElement>()!
const dataWithRelativeScale = computed<GraphDataRadar[]>(() => {
  let relatedData: GraphDataRadar[] = [
    {
      name: '男性相对比例',
      value: [],
    },
    {
      name: '女性相对比例',
      value: [],
    },
  ]
  props.data[1].value.map((item) => {
    relatedData[0].value.push((item * props.voteTotal) / props.voteMale)
  })
  props.data[2].value.map((item) => {
    relatedData[1].value.push((item * props.voteTotal) / props.voteFamale)
  })
  return props.data.concat(relatedData)
})
const maxData = computed<number>(() => {
  let max = 5
  props.data[0].value.map((item) => {
    if (item > max) max = item
  })
  return max * 1.25
})
onMounted(() => {
  if (chartDom.value) {
    GraphRadar = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphRadar.resize())
    option.value && GraphRadar.setOption(option.value)
    watchEffect(() => {
      if (props.indicator.length) option.value && GraphRadar.setOption(option.value)
    })
  }
})
function getFormatter(name: string, value: number[]): HTMLElement {
  let div = document.createElement('div')
  let tooltipHTML = '<span>' + name + ':</span>'
  for (let i = 0; i < value.length; i++) {
    tooltipHTML +=
      name === '男性相对比例' || name === '女性相对比例'
        ? '<div>' + props.indicator[i] + ': ' + ((value[i] * 100) / sum(value)).toFixed(2) + '% </div>'
        : '<div>' +
          props.indicator[i] +
          ': ' +
          value[i] +
          ' (' +
          ((value[i] * 100) / sum(value)).toFixed(2) +
          '%) </div>'
  }
  div.innerHTML = tooltipHTML
  return div
}

const showGraph = ref(true)
function changeGraph() {
  showGraph.value = !showGraph.value

  const graphOption = showGraph.value
    ? option.value
    : getGraphBarOption(props.indicator, props.data[0].value, props.data[1].value, props.data[2].value)
  GraphRadar.setOption(graphOption, true)
}
</script>
<style lang="postcss" scoped></style>
