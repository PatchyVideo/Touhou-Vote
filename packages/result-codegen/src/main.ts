import { mkdir, writeFile } from 'fs/promises'
import { promisify } from 'util'
import rimraf_ from 'rimraf'
import type { ImportedDB } from './db'
import { importDB } from './db'

import charas from '../data/chara.json'

const rimraf = promisify(rimraf_)

const r = (dir: string) => new URL(dir, import.meta.url)

console.log('> Clean up')
await rimraf(r('../gen').pathname)
await mkdir(r('../gen'))

console.log('> Import db')
// const dbv9 = await importDB('v9_vote_chara.sql')
// const dbv8 = await importDB('v8.sql')
// const dbv7 = await importDB('v7.sql')
// const dbv6 = await importDB('v6.sql')
// const dbv5 = await importDB('v5.sql')
// const dbv4 = await importDB('v4.sql')
// const dbv3 = await importDB('v3.sql')
const [dbv9, dbv8, dbv7, dbv6, dbv5, dbv4, dbv3] = await Promise.all([
  importDB('v9_vote_chara.sql'),
  importDB('v8.sql'),
  importDB('v7.sql'),
  importDB('v6.sql'),
  importDB('v5.sql'),
  importDB('v4.sql'),
  importDB('v3.sql'),
])

console.log('> Collect charas')
const charaMapV4: Record<string, number> = {
  因幡帝: 30,
  '四季映姬·亚玛萨那度': 39,
  '玛艾露贝莉·赫恩': 135,
}
await dbv4.each('SELECT * FROM r_chara', (err, row) => {
  if (charaMapV4[row.name] || ['大地精'].includes(row.name)) return
  const chv9 = Object.values(charas).find((ch) => ch.name === row.name)
  charaMapV4[row.name] = chv9?.value || 0
})
// console.log(Object.entries(charaMapV4).filter(([, v]) => v === 0))
// throw ''
const charaMapV3: Record<string, number> = {
  '蕾迪·霍瓦特洛克': 13,
  因幡帝: 30,
  '四季映姬·亚玛萨那度': 39,
  '玛艾露贝莉·赫恩': 135,
  雷兽: 162,
  '人形（含上海人形、哥利亚人形）': 183,
  STG作品中没有名称的BOSS: 191,
}
await dbv3.each('SELECT * FROM r_chara', (err, row) => {
  if (charaMapV3[row.name] || ['儚月抄召唤诸神', '大地精'].includes(row.name)) return
  const chv9 = Object.values(charas).find((ch) => ch.name === row.name)
  charaMapV3[row.name] = chv9?.value || 0
})
// console.log(Object.entries(charaMapV3).filter(([, v]) => v === 0))
// throw ''

console.log('> Collect db')
const collectChara = async (db: ImportedDB) => {
  const votes: Record<string, number> = {}
  const votesFirst: Record<string, number> = {}
  await db.each('SELECT * FROM vote_chara', (err, row) => {
    if (!row.enable) return
    if (!votes[row.value]) votes[row.value] = 0
    votes[row.value]++
    if (row.first) {
      if (!votesFirst[row.value]) votesFirst[row.value] = 0
      votesFirst[row.value]++
    }
  })
  const sum = Object.values(votes).reduce((a, b) => a + b, 0)
  const sumFirst = Object.values(votesFirst).reduce((a, b) => a + b, 0)
  return [votes, votesFirst, sum, sumFirst] as const
}
const collectCharaV4 = async (db: ImportedDB, charaMap: Record<string, number>) => {
  const votes: Record<string, number> = {}
  const votesFirst: Record<string, number> = {}
  await db.each('SELECT * FROM r_chara', (err, row) => {
    if (!charaMap[row.name]) return
    votes[charaMap[row.name]] = row.total
    votesFirst[charaMap[row.name]] = row.first
  })
  const sum = Object.values(votes).reduce((a, b) => a + b, 0)
  const sumFirst = Object.values(votesFirst).reduce((a, b) => a + b, 0)
  return [votes, votesFirst, sum, sumFirst] as const
}
const votesByChara = {
  v9: await collectChara(dbv9),
  v8: await collectChara(dbv8),
  v7: await collectChara(dbv7),
  v6: await collectChara(dbv6),
  v5: await collectChara(dbv5),
  v4: await collectCharaV4(dbv4, charaMapV4),
  v3: await collectCharaV4(dbv3, charaMapV3),
}
await writeFile(
  r(`../gen/charaCountByYear.json`),
  JSON.stringify({
    sum: [
      votesByChara.v9[2],
      votesByChara.v8[2],
      votesByChara.v7[2],
      votesByChara.v6[2],
      votesByChara.v5[2],
      votesByChara.v4[2],
      votesByChara.v3[2],
    ],
    sumFirst: [
      votesByChara.v9[3],
      votesByChara.v8[3],
      votesByChara.v7[3],
      votesByChara.v6[3],
      votesByChara.v5[3],
      votesByChara.v4[3],
      votesByChara.v3[3],
    ],
    charas: Object.fromEntries(
      Object.entries(charas)
        .map(([, v]) => {
          return [
            v.name,
            [
              // total, first
              [votesByChara.v9[0][v.value], votesByChara.v9[1][v.value]],
              [votesByChara.v8[0][v.value], votesByChara.v8[1][v.value]],
              [votesByChara.v7[0][v.value], votesByChara.v7[1][v.value]],
              [votesByChara.v6[0][v.value], votesByChara.v6[1][v.value]],
              [votesByChara.v5[0][v.value], votesByChara.v5[1][v.value]],
              [votesByChara.v4[0][v.value], votesByChara.v4[1][v.value]],
              [votesByChara.v3[0][v.value], votesByChara.v3[1][v.value]],
            ],
          ]
        })
        .filter(Boolean) as [string, number][]
    ),
  })
)

dbv9.db.close()
dbv8.db.close()
dbv7.db.close()
dbv6.db.close()
dbv5.db.close()
dbv4.db.close()
dbv3.db.close()
