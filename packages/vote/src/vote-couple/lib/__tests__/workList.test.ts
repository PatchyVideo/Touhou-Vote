import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick } from 'vue'

function voteObjects(workId: number, name: string, type: string, label: string) {
  return {
    voteYear: 12,
    groups: [
      {
        group: name,
        items: [
          {
            candidateId: workId,
            name: '测试候选',
            nameJp: '',
            type,
            firstAppearance: null,
            workIds: [workId],
            workTypes: [type],
            imageUrl: null,
            aliases: [],
          },
        ],
      },
    ],
    filterMeta: { kinds: [{ type, label }], works: [{ workId, name, type }] },
    aliasMap: {},
  }
}

test('CP filters use backend character metadata and retain draft/apply/reset behavior', async (t) => {
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: { removeItem: () => undefined },
  })
  t.after(() => {
    if (previousStorage) Object.defineProperty(globalThis, 'sessionStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'sessionStorage')
  })
  t.mock.method(
    globalThis,
    'fetch',
    async (url: string) =>
      new Response(
        JSON.stringify(
          url.includes('/characters?')
            ? voteObjects(91001, '后端新增作品', 'new', '后端新作分类')
            : voteObjects(91002, '仅音乐作品', 'CD', '后端音乐分类')
        )
      )
  )
  const source = await import('../../../common/lib/voteObjectsDataSource')
  const filters = await import('../workList')
  await source.loadVoteObjects()
  await nextTick()

  assert.deepEqual(filters.worksListAfterFilter.value, [{ name: '后端新增作品', value: 'new' }])
  assert.deepEqual(filters.kinds.value, [{ name: '后端新作分类', value: 'new' }])
  assert.deepEqual(filters.filterForKind.value, [{ name: '后端新作分类', value: 'new' }])

  filters.updateFilterForKindTem({ name: '后端新作分类', value: 'new' })
  assert.deepEqual(filters.worksListAfterFilterTem.value, [])
  assert.deepEqual(filters.worksListAfterFilter.value, [{ name: '后端新增作品', value: 'new' }])
  filters.getFilterForKindTem()
  assert.deepEqual(filters.worksListAfterFilterTem.value, [{ name: '后端新增作品', value: 'new' }])

  filters.updateFilterForKindTem({ name: '后端新作分类', value: 'new' })
  filters.updateFilterForKind()
  assert.deepEqual(filters.worksListAfterFilter.value, [])
  filters.resetFilterForKindTem()
  filters.updateFilterForKind()
  assert.deepEqual(filters.worksListAfterFilter.value, [{ name: '后端新增作品', value: 'new' }])
})
