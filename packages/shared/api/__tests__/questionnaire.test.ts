import assert from 'node:assert/strict'
import test from 'node:test'
import { buildQuestionnaireIndex, fetchQuestionnaireStructure } from '../questionnaire'
import type { QuestionnaireStructureResponse } from '../../data/questionnaireV2'

export function structure(): QuestionnaireStructureResponse {
  return { questionnaires: [{
    id: 7, key: 'custom_survey', title: '后台标题', introduction: '', category: 'main', required: true, order: 1,
    questionGroups: [{ id: 30, order: 1, hiddenByDefault: false, questions: [{
      id: 100, code: '11011', type: 'Single', content: '后台题干', introduction: '',
      options: [{ id: 200, code: '1101101', content: '后台选项', relatedQuestionIds: [], mutexOptionIds: [], optionGroup: 0 }],
    }] }],
  }] }
}

test('backend codes locate real nodes and ownership without decoding IDs', () => {
  const index = buildQuestionnaireIndex(structure())
  assert.equal(index.questionByCode.get('11011')?.question.id, 100)
  assert.equal(index.questions[0].questionnaire.key, 'custom_survey')
  assert.equal(index.optionByCode.get('1101101')?.content, '后台选项')
  assert.equal(index.questionnaireByKey.get('custom_survey')?.title, '后台标题')
})

test('missing code never falls back to a database ID; duplicate code is rejected', () => {
  const tree = structure()
  const question = tree.questionnaires[0].questionGroups[0].questions[0]
  question.code = null
  assert.equal(buildQuestionnaireIndex(tree).questionByCode.size, 0)
  question.code = '11011'
  tree.questionnaires[0].questionGroups[0].questions.push({ ...question, id: 101 })
  assert.throws(() => buildQuestionnaireIndex(tree), /重复/)
})

test('HTTP and incomplete structure failures are rejected', async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () => new Response('', { status: 503 })
    await assert.rejects(fetchQuestionnaireStructure('/structure'), /503/)
    globalThis.fetch = async () => Response.json({ questionnaires: [{}] })
    await assert.rejects(fetchQuestionnaireStructure('/structure'), /结构/)
  } finally { globalThis.fetch = original }
})
