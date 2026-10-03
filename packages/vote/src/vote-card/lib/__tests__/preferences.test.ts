import { test } from 'node:test'
import assert from 'node:assert/strict'
import { customUsername, defaultUsername, truncateUsername } from '../cardUsername'
import { parsePreferences, readPreferences, writePreferences } from '../voteCardPreferences'
test('user-visible limit keeps emoji and combining characters intact', () => {
  assert.equal(truncateUsername('👩‍👩‍👧‍👦'.repeat(21)), '👩‍👩‍👧‍👦'.repeat(20))
  assert.equal(truncateUsername('e\u0301'.repeat(21)), 'e\u0301'.repeat(20))
  assert.equal(customUsername('   '), undefined)
  assert.equal(customUsername(' 灵梦 '), ' 灵梦 ')
  assert.equal(defaultUsername({ username: ' ', phone: '12345678', email: 'test@example.com' }), '5678')
})
test('bad fields default individually and unknown versions reset', () => {
  assert.deepEqual(parsePreferences('{"version":1,"showReason":true,"showQr":"false"}'), {
    version: 1,
    customUsername: undefined,
    showReason: true,
    showQr: true,
  })
  assert.deepEqual(parsePreferences('{"version":2,"showReason":true}'), parsePreferences(null))
})
test('field writes merge latest storage and failed storage retains isolated account memory', () => {
  const data = new Map<string, string>()
  const storage = {
    getItem: (key: string) => data.get(key) || null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
  }
  writePreferences('a', { showReason: true }, storage)
  assert.equal(writePreferences('a', { showQr: false }, storage).value.showReason, true)
  const broken = {
    getItem: () => {
      throw new Error('denied')
    },
    setItem: () => {
      throw new Error('denied')
    },
  }
  writePreferences('a', { customUsername: '后备' }, broken)
  assert.equal(readPreferences('a', broken).value.customUsername, '后备')
  assert.equal(readPreferences('b', broken).value.customUsername, undefined)
})
test('quota-only failure retains successive edits and route reentry', () => {
  const storage = {
    getItem: () => '{"version":1,"showReason":false,"showQr":true}',
    setItem: () => {
      throw new Error('quota')
    },
  }
  writePreferences('quota', { showQr: false }, storage)
  assert.equal(writePreferences('quota', { customUsername: '名称' }, storage).value.showQr, false)
  assert.equal(readPreferences('quota', storage).value.customUsername, '名称')
})
