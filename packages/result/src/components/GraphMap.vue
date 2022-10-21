<template><div ref="chartDom" class="w-full aspect-1/1"></div></template>
<script lang="ts" setup>
import { GraphDataMap } from '@/lib/Graph'
import * as echarts from 'echarts/core'
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  GeoComponent,
  GeoComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { MapChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { ChinaMap } from '@/composables/china'

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  LegendComponent,
  MapChart,
  CanvasRenderer,
  UniversalTransition,
])

const props = defineProps<{
  dataTotal: GraphDataMap[]
  dataMale: GraphDataMap[]
  dataFemale: GraphDataMap[]
}>()

type EChartsOption = echarts.ComposeOption<
  | ToolboxComponentOption
  | VisualMapComponentOption
  | GeoComponentOption
  | TooltipComponentOption
  | LegendComponentOption
>
const option = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      selectedMode: 'single',
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    visualMap: {
      left: 'right',
      min: 0,
      max: 3000,
      calculable: true,
    },
    series: [
      {
        name: '总票数',
        type: 'map',
        map: 'China',
        showLegendSymbol: true,
        data: props.dataTotal,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        name: '总男性票数',
        type: 'map',
        map: 'China',
        showLegendSymbol: true,
        data: props.dataMale,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        name: '总女性票数',
        type: 'map',
        map: 'China',
        showLegendSymbol: true,
        data: props.dataFemale,
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
})
let GraphMap: echarts.ECharts

const chartDom = ref<HTMLElement>()!
onMounted(async () => {
  if (chartDom.value) {
    GraphMap = echarts.init(chartDom.value)
    window.addEventListener('resize', () => GraphMap.resize())
    echarts.registerMap('China', ChinaMap as any)
    option.value && GraphMap.setOption(option.value)
  }
  watchEffect(() => {
    if (props.dataTotal || props.dataMale || props.dataFemale) {
      option.value && GraphMap.setOption(option.value)
    }
  })
})
</script>
<style lang="postcss" scoped></style>
