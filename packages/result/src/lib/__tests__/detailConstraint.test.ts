import assert from 'node:assert/strict'
import test from 'node:test'
import { compressToEncodedURIComponent } from 'lz-string'
import { encodeAdditionalConstraint, getAdditionalConstraintString, withTargetConstraint } from '../decodeAdditionalConstraint'

test('detail URLs preserve command mode conditions and legacy GUI conditions', () => {
  const query = 'q11011=1101101 OR q11011=1101102'
  assert.equal(getAdditionalConstraintString(encodeAdditionalConstraint(query)), query)
  const legacy = compressToEncodedURIComponent(JSON.stringify({
    characters: ['灵梦'], charactersFirst: null, musics: [], musicsFirst: null,
    questionnaire: [{ questionID: '11011', answerID: '1101102' }],
  }))
  assert.equal(getAdditionalConstraintString(legacy), 'chars:["灵梦"] AND q11011=1101102')
})

test('target condition keeps OR grouped and escapes names as DSL strings', () => {
  assert.equal(withTargetConstraint('q1=1 OR q2=2', 'character', ['灵梦']),
    '(q1=1 OR q2=2) AND chars:["灵梦"]')
  assert.equal(withTargetConstraint('', 'music', ['My "Maid"\\Song']),
    'musics:["My \\"Maid\\"\\\\Song"]')
  assert.equal(withTargetConstraint('q1=2', 'cp', ['灵梦', '灵梦']),
    '(q1=2) AND cp=("灵梦","灵梦")')
})
