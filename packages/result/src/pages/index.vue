<template>
  <div class="w-100vw h-100vh" ref="graphContainer"></div>
</template>

<script lang="ts" setup>
import type { D3ZoomEvent } from 'd3'
import { axisBottom, axisLeft, format, scaleLinear, scaleLog, select, zoom, zoomIdentity } from 'd3'
import { charas, sum, sumFirst } from 'touhou-vote-result-codegen/gen/charaCountByYear.json'

const charasRendered = Object.fromEntries(
  Object.entries(charas)
    .map(([name, votesByYear]) => {
      const checked: ([number, number] | null)[] = votesByYear.map(([total, first]) =>
        total > 50 && first > 10 ? ([total, first] as [number, number]) : null
      )
      if (checked.filter(Boolean).length < 2) return null!
      return [name, checked] as const
    })
    .filter(Boolean)
)

const graphContainer = shallowRef<HTMLDivElement>(null!)

const yearIndexMap = ['第9届', '第8届', '第7届', '第6届', '第5届', '第4届', '第3届']
// const charaCount = [229, 227, 218, 215, 203, 191, 163]

onMounted(() => {
  const width = graphContainer.value.clientWidth
  const height = graphContainer.value.clientHeight
  const margin = { top: 10, right: 20, bottom: 20, left: 40 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const svg = select(graphContainer.value).append('svg').attr('width', width).attr('height', height)

  const graph = svg
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const formatPercent = format('.2%')

  const x = scaleLinear().domain([0.03, 0.29]).range([0, chartWidth])
  const xAxis = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${chartHeight + margin.top})`)
    .call(axisBottom(x).tickFormat(formatPercent))

  const y = scaleLog()
    .base(1.4)
    .domain([Math.pow(1.4, -20), Math.pow(1.4, -8)])
    .range([chartHeight, 0])
  const yAxis = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .call(axisLeft(y).tickFormat(formatPercent))

  const lines = graph
    .append('g')
    .selectAll('.lines')
    .data(
      Object.keys(charasRendered).map((name) => ({
        name,
        data: charasRendered[name]
          .map((j, i) => (j && j[0] && j[1] ? ([j[1] / j[0], j[0] / sum[i], i] as [number, number, number]) : null!))
          .filter(Boolean),
      }))
    )
    .enter()
    .append('g')

  interface LinePathData {
    name: string
    start: [number, number, number]
    end: [number, number, number]
    color: string
  }

  const graphLines = lines
    .selectAll('.lines')
    .append('g')
    .data((d) => {
      const vecs = d.data
      if (vecs.length < 2) return []
      const pairVecs: {
        start: [number, number, number]
        end: [number, number, number]
      }[] = []
      for (let i = 0; i < vecs.length - 1; i++) {
        pairVecs.push({
          start: vecs[i],
          end: vecs[i + 1],
        })
      }

      const dx = vecs[0][0] - vecs[1][0]
      const dy = vecs[0][1] - vecs[1][1]
      let angle = Math.atan2(dy, dx) - Math.PI / 4
      if (angle < 0) angle += Math.PI * 2
      //if the angle is closer to 0 or 2PI, its weight is closer to 1
      // if the angle is closer to PI, its weight is closer to 0
      const weight = Math.abs(angle - Math.PI) / Math.PI
      console.log(d.name, dx, dy, angle, weight)

      const newLines = pairVecs.map((v, i, a) => ({
        name: d.name,
        start: v.start,
        end: v.end,
        color: `hsl(${290 - weight * 40},80%,${(i / a.length) * 60 + 30}%)`,
      }))
      return newLines as LinePathData[]
    })
    .enter()
    .append('path')
    .attr('d', (d) => `M${x(d.start[0])},${y(d.start[1])}L${x(d.end[0])},${y(d.end[1])}`)
    .attr('fill', 'none')
    .attr('stroke', (d) => d.color)
    .attr('stroke-width', 1)
    .attr('stroke-linecap', 'round')

  const graphDots = lines
    .selectAll('.lines')
    .append('g')
    .data((d) => d.data.map((v) => [...v, d.name] as [number, number, number, string]))
    .enter()
    .append('g')
    .attr('opacity', 0)
    .attr('transform', (d) => `translate(${x(d[0])},${y(d[1])})`)
  const graphDotPoints = graphDots.append('circle').attr('r', 2).attr('fill', 'white').attr('stroke', 'black')
  const graphDotText = graphDots
    .append('text')
    .attr('transform', (d) => `translate(-23,-1) scale(0.5)`)
    .text((d) => yearIndexMap[d[2]])

  interface LabelData {
    name: string
    lastTotal: number
    lastFirst: number
    lastSum: number
    lastSumFirst: number
  }

  const graphLabels = graph
    .append('g')
    .selectAll('.labels')
    .data(
      Object.keys(charasRendered)
        .map((name) => {
          const latestIndex = charasRendered[name].findIndex((v) => v && v[0] && v[1])
          if (latestIndex === -1) return null!
          const latestPair = charasRendered[name][latestIndex]!
          return {
            name,
            lastTotal: latestPair[0],
            lastFirst: latestPair[1],
            lastSum: sum[latestIndex],
            lastSumFirst: sumFirst[latestIndex],
          }
        })
        .filter(Boolean)
    )
    .enter()
    .append('g')
    .append('text')
    .attr(
      'transform',
      (d: LabelData) => `translate(${x(d.lastFirst / d.lastTotal) + 1}, ${y(d.lastTotal / d.lastSum) - 1}) scale(0.5)`
    )
    .attr('style', 'cursor:default')
    .text((d) => d.name)
    .on('mouseover', function () {
      const name = (select(this).datum() as LabelData).name
      graphLines
        .filter((d) => d.name !== name)
        .transition()
        .duration(200)
        .attr('opacity', 0.15)
      graphLabels
        .filter((d) => d.name !== name)
        .transition()
        .duration(200)
        .attr('opacity', 0.15)
      graphDots
        .filter((d) => d[3] === name)
        .transition()
        .duration(200)
        .attr('opacity', 1)
    })
    .on('mouseout', function () {
      const name = (select(this).datum() as LabelData).name
      graphLines.transition().duration(200).attr('opacity', 1)
      graphLabels.transition().duration(200).attr('opacity', 1)
      graphDots
        .filter((d) => d[3] === name)
        .transition()
        .duration(200)
        .attr('opacity', 0)
    })

  const zooming = zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 20]).on('zoom', onzoom)

  svg.call(zooming).call(zooming.transform, zoomIdentity)

  function onzoom(e: D3ZoomEvent<SVGSVGElement, unknown>) {
    const newX = e.transform.rescaleX(x)
    const newY = e.transform.rescaleY(y)

    xAxis.call(axisBottom(newX).tickFormat(formatPercent))
    yAxis.call(axisLeft(newY).tickFormat(formatPercent))

    graphLines
      .attr('d', (d_) => {
        const d = d_ as LinePathData
        return `M${newX(d.start[0])},${newY(d.start[1])}L${newX(d.end[0])},${newY(d.end[1])}`
      })
      .attr('stroke-width', 1 * e.transform.k)

    graphLabels.attr(
      'transform',
      (d) =>
        `translate(${newX(d.lastFirst / d.lastTotal) + 1}, ${newY(d.lastTotal / d.lastSum) - 1}) scale(${
          0.5 * e.transform.k
        })`
    )

    graphDots.attr('transform', (d) => `translate(${newX(d[0])},${newY(d[1])})`)
    graphDotPoints.attr('r', 2 * e.transform.k)
    graphDotText.attr('transform', () => `translate(${-23 * e.transform.k},-1) scale(${0.5 * e.transform.k})`)
  }
})
</script>
