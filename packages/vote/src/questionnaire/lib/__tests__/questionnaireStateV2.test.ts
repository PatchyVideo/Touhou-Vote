import assert from 'node:assert/strict'
import test from 'node:test'
import * as state from '../questionnaireStateV2'

function storage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
  }
}

test('structure ignores old session cache, retries failures and preserves answer drafts', async () => {
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

test('refresh restores edited questionnaires and successful submission only clears the sent versions', async () => {
  Object.assign(globalThis, { localStorage: storage(), sessionStorage: storage() })
  state.clearQuestionnaireV2LocalData()
  const tree = { questionnaires: [1, 2, 3].map(id => ({
    id, key: String(id), title: String(id), introduction: '', category: 'main', required: true, order: id,
    questionGroups: [{ id: id * 10, order: 1, hiddenByDefault: false, questions: [
      { id: id * 100, type: 'Input', content: '题干', introduction: '', options: [] },
    ] }],
  })) }
  // 模拟没有编辑版本的旧缓存，包含后端曾保存的答案和一份未提交的草稿。
  localStorage.setItem('questionnaireDataLocalV2', JSON.stringify({ 3: {
    questionnaireId: 3, groups: [{ groupId: 30, activeQuestionId: 300, selectedOptionIds: [], input: '旧缓存草稿' }],
  } }))
  const saved = ['', '后端已保存', '']
  const original = globalThis.fetch
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/structure')) return Response.json(tree)
    return Response.json({ data: { getPaperV2: saved.map((input, i) => ({
      questionnaire_id: i + 1, group_id: (i + 1) * 10, active_question_id: (i + 1) * 100,
      selected_option_ids: [], input_text: input,
    })) } })
  }
  const answers = () => [1, 2, 3].map(id => state.getRuntime(id)?.visibleGroups[0].activeQuestion?.input)
  const refresh = async () => {
    state.drafts.value = {}
    await state.restorePaperV2('test-vote-token')
  }
  try {
    await state.loadQuestionnaireStructure(true)
    await refresh()
    assert.deepEqual(answers(), ['', '后端已保存', '旧缓存草稿'])
    assert.equal(state.drafts.value[2].editRevision, null)

    state.setInput(1, 10, '刚填的答案')
    state.setInput(2, 20, '')
    const firstRevision = state.drafts.value[1].editRevision
    assert.equal(typeof firstRevision, 'string')
    state.setInput(1, 10, '刚填的答案')
    assert.equal(state.drafts.value[1].editRevision, firstRevision)
    await refresh()
    assert.deepEqual(answers(), ['刚填的答案', '', '旧缓存草稿'])

    const submission = state.preparePaperSubmission()
    assert.ok(submission)
    state.setInput(1, 10, '等待提交期间的修改')
    for (const answer of submission.answers) saved[answer.questionnaireId - 1] = answer.input
    state.markPaperSubmitted(submission)
    await refresh()
    assert.deepEqual(answers(), ['等待提交期间的修改', '', '旧缓存草稿'])
    assert.equal(typeof state.drafts.value[1].editRevision, 'string')
    assert.equal(state.drafts.value[2].editRevision, null)
    assert.equal(state.drafts.value[3].editRevision, null)

    saved[2] = '后端更新'
    await refresh()
    assert.deepEqual(answers(), ['等待提交期间的修改', '', '后端更新'])
  } finally {
    globalThis.fetch = original
  }
})
