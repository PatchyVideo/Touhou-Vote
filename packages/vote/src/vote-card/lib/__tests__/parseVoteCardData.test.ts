import assert from 'node:assert/strict'
import { selectDepartment } from '../selectDepartment'
import test from 'node:test'
import { parseVoteCardData, readLocalDraft } from '../parseVoteCardData'
const local = (id = '00000000', honmei = false) => ({ id, honmei, reason: '' })
const storage = (value: string | null) => ({ getItem: () => value })
test('missing and [] are absent; nonempty placeholders remain present and empty', () => {
  assert.equal(readLocalDraft('role', storage(null)).state, 'absent')
  assert.equal(readLocalDraft('role', storage('[]')).state, 'absent')
  const result = readLocalDraft('role', storage(JSON.stringify([local()])))
  assert.equal(result.state, 'present')
  assert.equal(parseVoteCardData('role', result.raw, 'local').entries.length, 0)
})
test('corrupt and structurally invalid local values fail rather than falling back', () => {
  for (const value of ['{', '{}', '[null]', '[{"id":5,"honmei":false}]', '[{"id":"x","honmei":"true"}]'])
    assert.throws(() => readLocalDraft('role', storage(value)))
})
test('initialized reader wins over persisted content without rewriting either', () => {
  const raw = [local('edited')]
  assert.deepEqual(readLocalDraft('role', storage(JSON.stringify([local('persisted')])), () => raw).raw, raw)
})
test('honmei is optional; one honmei sorts first and retains original slots', () => {
  assert.equal(parseVoteCardData('music', [local('a')], 'local').entries.length, 1)
  assert.deepEqual(
    parseVoteCardData('role', [local('a'), local('b', true), local('c')], 'local').entries.map(
      (entry) => entry.slotIndex
    ),
    [1, 0, 2]
  )
  assert.equal(parseVoteCardData('role', [{ id: 'a', first: false, reason: null }], 'cloud').entries.length, 1)
})
test('limits and multiple honmei reject local and cloud without truncation', () => {
  for (const [department, limit] of [
    ['role', 8],
    ['music', 12],
  ] as const) {
    assert.equal(
      parseVoteCardData(
        department,
        Array.from({ length: limit }, (_, i) => local(String(i + 1))),
        'local'
      ).entries.length,
      limit
    )
    assert.throws(() =>
      parseVoteCardData(
        department,
        Array.from({ length: limit + 1 }, (_, i) => local(String(i + 1))),
        'local'
      )
    )
    assert.throws(() =>
      parseVoteCardData(
        department,
        [
          { id: 'a', first: true },
          { id: 'b', first: true },
        ],
        'cloud'
      )
    )
  }
  assert.throws(() => parseVoteCardData('role', [local('a', true), local('00000000', true)], 'local'))
})
test('CP preserves duplicate members and original positions, skipping single members', () => {
  const raw = [
    { characters: [local('00000000'), local('a'), local('a')], seme: 2, honmei: false },
    { characters: [local('a'), local(), local()], seme: 0, honmei: false },
  ]
  const parsed = parseVoteCardData('cp', raw, 'local')
  assert.deepEqual(
    parsed.entries[0].members.map((member) => member.memberIndex),
    [1, 2]
  )
  assert.equal(parsed.entries[0].activeIndex, 2)
  assert.equal(parsed.skipped[0].slotIndex, 1)
  assert.equal(raw[1].characters.length, 3)
  const cloud = parseVoteCardData('cp', [{ idA: 'a', idB: 'a', idC: null, active: 'a', first: false }], 'cloud')
  assert.equal(cloud.entries[0].activeIndex, 0)
  assert.throws(() => parseVoteCardData('cp', Array(5).fill({ idA: 'a', idB: 'b', first: false }), 'cloud'))
})

test('explicit URL department waits for itself; fallback waits for earlier loading departments', async () => {
  const state = (status: 'ready' | 'loading' | 'empty' | 'error') => ({ status, entries: [], skipped: [] })
  assert.equal(
    selectDepartment('music', { role: state('ready'), music: state('loading'), cp: state('empty') }),
    'music'
  )
  assert.equal(
    selectDepartment(undefined, { role: state('loading'), music: state('ready'), cp: state('empty') }),
    undefined
  )
  assert.equal(selectDepartment('doujin', { role: state('empty'), music: state('ready'), cp: state('empty') }), 'music')
  assert.equal(
    selectDepartment(['role', 'music'], { role: state('empty'), music: state('ready'), cp: state('empty') }),
    'music'
  )
  assert.equal(selectDepartment('role', { role: state('empty'), music: state('ready'), cp: state('empty') }), 'music')
})
