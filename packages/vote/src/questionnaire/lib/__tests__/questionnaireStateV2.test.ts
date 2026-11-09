import assert from 'node:assert/strict'
import test from 'node:test'

test('structure ignores old session cache, retries failures and preserves answer drafts', async () => {
  function storage() {
    const values = new Map<string, string>()
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
      removeItem: (key: string) => { values.delete(key) },
    }
  }
  Object.assign(globalThis, { localStorage: storage(), sessionStorage: storage() })
  const tree = { questionnaires: [{ id: 1, key: 'custom', title: '后台', introduction: '', category: 'main', required: true,
    order: 1, questionGroups: [{ id: 10, order: 1, hiddenByDefault: false, questions: [
      { id: 100, type: 'Input', content: '题干', introduction: '', options: [] },
    ] }] }] }
  sessionStorage.setItem('questionnaireStructureV2', JSON.stringify(tree))
  localStorage.setItem('questionnaireDataLocalV2', JSON.stringify({ 1: {
    questionnaireId: 1, groups: [{ groupId: 10, activeQuestionId: 100, selectedOptionIds: [], input: '草稿内容' }],
  } }))
  let requests = 0
  const original = globalThis.fetch
  globalThis.fetch = async () => {
    requests++
    return requests === 1 ? new Response('', { status: 503 }) : Response.json(tree)
  }
  try {
    const state = await import('../questionnaireStateV2')
    await state.loadQuestionnaireStructure()
    assert.equal(requests, 1)
    assert.match(state.structureError.value ?? '', /503/)
    await Promise.all([state.loadQuestionnaireStructure(), state.loadQuestionnaireStructure()])
    assert.equal(requests, 2)
    assert.equal(state.questionnaires.value[0].title, '后台')
    assert.equal(state.drafts.value[1].groups[0].input, '草稿内容')
    await state.loadQuestionnaireStructure()
    assert.equal(requests, 2)
    assert.match(localStorage.getItem('questionnaireDataLocalV2') ?? '', /草稿内容/)
  } finally { globalThis.fetch = original }
})
