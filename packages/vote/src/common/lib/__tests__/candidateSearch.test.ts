import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchCandidateSearch } from '../../../../../shared/api/candidateSearch'

test('candidate search sends an explicit year and normalizes the query', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, '/v12-be/api/v1/autocomplete/candidates/search')
    assert.equal(init.method, 'POST')
    assert.equal(init.credentials, 'include')
    assert.deepEqual(JSON.parse(String(init.body)), { category: 'character', query: 'mls', vote_year: 12 })
    return new Response(JSON.stringify({ category: 'character', query: 'mls', vote_year: 12, candidate_ids: [7, 18] }))
  })
  const result = await fetchCandidateSearch('/v12-be/api/v1/autocomplete/candidates/search', 'character', ' MLS ', 12)
  assert.deepEqual(result.candidate_ids, [7, 18])
})

test('candidate search rejects HTTP errors and mismatched or malformed responses', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch')
  const valid = { category: 'music', query: 'apple', vote_year: 12, candidate_ids: [8] }
  for (const response of [
    new Response('', { status: 503 }),
    new Response(JSON.stringify({ ...valid, vote_year: 2026 })),
    new Response(JSON.stringify({ ...valid, query: 'different' })),
    new Response(JSON.stringify({ ...valid, candidate_ids: ['8'] })),
  ]) {
    fetch.mock.mockImplementation(async () => response)
    await assert.rejects(fetchCandidateSearch('/search', 'music', 'apple', 12))
  }
})
