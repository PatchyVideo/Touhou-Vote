import assert from 'node:assert/strict'
import test from 'node:test'
import { graphTimeRange, getAddedTrendData, getTrendData, useResultTimeline } from '../Graph'

const timeline = {
  __typename: 'ResultTimeline' as const,
  voteStart: new Date('2026-01-01T00:00:00Z'),
  voteEnd: new Date('2026-01-05T00:00:00Z'),
  statisticsEnd: new Date('2026-01-01T02:30:00Z'),
  generatedAt: new Date('2026-01-01T02:31:00Z'),
}

test('axis uses snapshot cutoff, includes partial hour, and starts at bucket zero', () => {
  assert.deepEqual(graphTimeRange(timeline), [
    '2026/01/01 08:00', '2026/01/01 09:00', '2026/01/01 10:00',
  ])
  assert.equal(graphTimeRange({ ...timeline, statisticsEnd: new Date('2026-01-01T02:00:00Z') }).length, 2)
})

test('sparse changes retain negative buckets and cumulative totals across empty hours', () => {
  const trend = [
    { __typename: 'VotingTrendItem' as const, hrs: 0, cnt: 3 },
    { __typename: 'VotingTrendItem' as const, hrs: 2, cnt: -1 },
  ]
  assert.deepEqual(getAddedTrendData('变化', trend, 4).data, [3, 0, -1, 0])
  assert.deepEqual(getTrendData('累计', trend, 4).data, [3, 3, 2, 2])
})

test('missing legacy metadata stays empty and updating metadata changes the page range', () => {
  const page = useResultTimeline()
  assert.deepEqual(page.GraphTimeRange.value, [])
  page.setResultTimeline(timeline)
  assert.equal(page.getTrendData('空曲线', []).data.length, 3)
  page.setResultTimeline(null)
  assert.deepEqual(page.getTrendData('旧快照', []).data, [])
  assert.equal(page.dateRangeText.value, '暂无趋势时间信息。')
})
