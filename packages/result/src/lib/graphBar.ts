import type * as echarts from 'echarts/core'
import type { LegendComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components'
type EChartsOption = echarts.ComposeOption<ToolboxComponentOption | TooltipComponentOption | LegendComponentOption>

export function getGraphBarOption(
  types: string[],
  totalData: number[],
  maleData: number[] = [],
  femaleData: number[] = []
): EChartsOption {
  const series = [
    {
      type: 'bar',
      label: {
        show: true,
      },
      stack: 'total',
      data: totalData,
    },
  ]
  if (maleData.length && femaleData.length)
    series.push(
      {
        type: 'bar',
        label: {
          show: true,
        },
        stack: 'sex',
        data: maleData,
      },
      {
        type: 'bar',
        stack: 'sex',
        label: {
          show: true,
        },
        data: femaleData,
      }
    )
  return {
    legend: {},
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: types,
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      left: '10',
      containLabel: true,
    },
    series: series,
  }
}
