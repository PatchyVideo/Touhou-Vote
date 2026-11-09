import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ensureQuestionnaireStructure, buildQuestionnaireResultItems, findQuestionWithQuestionID,
} from '../Questionnaire'

test('result loads backend definitions once, retries failures and fills unanswered options', async () => {
  const original = globalThis.fetch
  let calls = 0
  const option = (id: number, code: string | null, content: string) => ({
    id, code, content, relatedQuestionIds: [], mutexOptionIds: [], optionGroup: 0,
  })
  const question = { id: 100, code: '11011', type: 'Single', content: '后台题干', introduction: '',
    options: [option(200, '1101101', '选项甲'), option(201, '1101102', '选项乙')] }
  const tree = { questionnaires: [{ id: 7, key: 'custom', title: '后台问卷', introduction: '',
    category: 'main', required: true, order: 1,
    questionGroups: [{ id: 30, order: 1, hiddenByDefault: false, questions: [
      question, { ...question, id: 101, code: '11021', options: [] },
      { ...question, id: 102, code: null, options: [] },
    ] }],
  }] }
  globalThis.fetch = async () => {
    calls++
    return calls === 1 ? new Response('', { status: 503 }) : Response.json(tree)
  }
  try {
    await assert.rejects(ensureQuestionnaireStructure(), /503/)
    const [index, same] = await Promise.all([ensureQuestionnaireStructure(), ensureQuestionnaireStructure()])
    assert.equal(index, same)
    await ensureQuestionnaireStructure()
    assert.equal(calls, 2)
    assert.equal(findQuestionWithQuestionID('q11011')?.question, '后台题干')
    assert.equal(findQuestionWithQuestionID('100'), null)
    const items = buildQuestionnaireResultItems(index, [{ questionId: 'q11011',
      answersCat: [{ aid: '1101101', totalVotes: 3, maleVotes: 1, femaleVotes: 2 }],
      totalAnswers: 3, totalMale: 1, totalFemale: 2,
    }])
    assert.equal(items[0].answersCat[0].content, '选项甲')
    assert.equal(items[0].answersCat[0].totalVotes, 3)
    assert.equal(items[0].answersCat[1].totalVotes, 0)
    assert.equal(items[1].totalAnswers, 0)
    assert.equal(items[2].code, null)
  } finally { globalThis.fetch = original }
})
