import assert from 'node:assert/strict'
import test from 'node:test'
import { effectScope, nextTick, ref } from 'vue'
import { useCandidateSearch } from '../useCandidateSearch'

const settle = () => new Promise<void>((resolve) => setImmediate(resolve))

test('only the current search updates IDs, and clearing ignores pending replies', async (t) => {
  const pending: {
    body: { category: string; query: string; vote_year: number }
    resolve: (response: Response) => void
  }[] = []
  t.mock.method(
    globalThis,
    'fetch',
    (_url: string, init: RequestInit) =>
      new Promise<Response>((resolve) => {
        pending.push({ body: JSON.parse(String(init.body)), resolve })
      })
  )
  const keyword = ref('')
  const scope = effectScope()
  const search = scope.run(() => useCandidateSearch('character', keyword))!
  t.after(() => scope.stop())
  assert.equal(pending.length, 0)
  keyword.value = 'mls'
  await nextTick()
  keyword.value = 'lm'
  await nextTick()
  assert.equal(search.loading.value, true)
  assert.equal(search.matchedIds.value.size, 0)
  const reply = (index: number, ids: number[]) =>
    pending[index].resolve(
      new Response(
        JSON.stringify({
          ...pending[index].body,
          candidate_ids: ids,
        })
      )
    )
  reply(1, [18, 7])
  await settle()
  assert.deepEqual([...search.matchedIds.value], ['18', '7'])
  reply(0, [99])
  await settle()
  assert.deepEqual([...search.matchedIds.value], ['18', '7'])
  keyword.value = 'night'
  await nextTick()
  assert.equal(search.matchedIds.value.size, 0)
  keyword.value = ''
  await nextTick()
  reply(2, [99])
  await settle()
  assert.equal(search.loading.value, false)
  assert.equal(search.error.value, null)
  assert.equal(search.matchedIds.value.size, 0)
})

test('failed search exposes an error and clearing restores the idle state', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }))
  const keyword = ref('apple')
  const scope = effectScope()
  const search = scope.run(() => useCandidateSearch('music', keyword))!
  t.after(() => scope.stop())
  await settle()
  assert.equal(search.loading.value, false)
  assert.equal(search.error.value, '搜索失败，请修改关键词重试')
  assert.equal(search.matchedIds.value.size, 0)
  keyword.value = ' '
  await nextTick()
  assert.equal(search.error.value, null)
  assert.equal(search.loading.value, false)
})
