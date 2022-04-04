import { mkdir, readFile, writeFile } from 'fs/promises'
import { promisify } from 'util'
import rimraf_ from 'rimraf'
import type { DeserializeOptions, Document } from 'bson'
import { deserialize } from 'bson'
import type { ImportedDB } from './db'
import { importDB } from './db'
import type { Character } from 'touhou-vote-vote/src/vote-character/lib/character'

import charasV9 from '../data/chara.json'
import { characterList as charasV10 } from 'touhou-vote-vote/src/vote-character/lib/characterList'

const charasV10ByName = Object.fromEntries(charasV10.map((v: Character) => [v.name, v]))
const charasV10ByID = Object.fromEntries(charasV10.map((v: Character) => [v.id, v]))

const rimraf = promisify(rimraf_)

const r = (dir: string) => new URL(dir, import.meta.url)

function _getNextObjectSize(buffer: Buffer) {
  return buffer[0] | (buffer[1] << 8) | (buffer[2] << 16) | (buffer[3] << 24)
}

function deserializeBSON(buffer: Buffer, options?: DeserializeOptions) {
  let _buffer = buffer
  const _result = []

  while (_buffer.length > 0) {
    const nextSize = _getNextObjectSize(_buffer)
    if (_buffer.length < nextSize) {
      throw new Error('Corrupted BSON file: the last object is incomplete.')
    } else if (_buffer[nextSize - 1] !== 0) {
      throw new Error(`Corrupted BSON file: the ${_result.length + 1}-th object does not end with 0.`)
    }

    const obj = deserialize(_buffer, {
      ...options,
      allowObjectSmallerThanBufferSize: true,
      promoteBuffers: true, // Since BSON support raw buffer as data type, this config allows
      // these buffers as is, which is valid in JS object but not in JSON
    })
    _result.push(obj)
    _buffer = _buffer.slice(nextSize)
  }

  return _result
}

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
const [dbv10, dbv9, dbv8, dbv7, dbv6, dbv5, dbv4, dbv3] = await Promise.all([
  readFile(r('../data/submits_v1/raw_character.bson')).then((buf) => deserializeBSON(buf)),
  importDB('v9_vote_chara.sql'),
  importDB('v8.sql'),
  importDB('v7.sql'),
  importDB('v6.sql'),
  importDB('v5.sql'),
  importDB('v4.sql'),
  importDB('v3.sql'),
])

console.log('> Collect charas')
const charaMapV9: Record<string, string> = {
  莉莉白: '16',
  坂田合欢乃: '102',
  幽玄魔眼: '133',
  '玛艾露贝莉·赫恩（梅莉）': '135',
  露娜切尔德: '168',
  '无名的读书妖怪（朱鹭子）': '184',
  反狱王: '220',
}
Object.entries(charasV9).forEach(([id, chara]) => {
  if (
    charaMapV9[chara.name] ||
    [
      '瑞江浦岛子',
      '前鬼 / 后鬼',
      '人面犬',
      '邪龙',
      '稻荷大人',
      '佑天上人',
      '读书狐狸',
      'STG作品中没有名称的角色',
      '酒吧老板',
      '长相酷似周杰伦的参拜客',
      '酒吧客人',
      // 动物灵分开了，这里还是忽略了
      '动物灵（含野狼、水獭、大鹫）',
    ].includes(chara.name)
  )
    return
  const chv10 = Object.values(charasV10ByName).find((ch) => ch.name === chara.name)
  charaMapV9[chara.name] = chv10?.id || ''
})
// console.log(Object.entries(charaMapV9).filter(([, v]) => !v))
// throw ''
const charaMapV4: Record<string, string> = {
  莉莉白: '16',
  因幡帝: '30',
  '四季映姬·亚玛萨那度': '39',
  幽玄魔眼: '133',
  '玛艾露贝莉·赫恩': '135',
  露娜切尔德: '168',
  '无名的读书妖怪（朱鹭子）': '184',
}
await dbv4.each('SELECT * FROM r_chara', (err, row) => {
  if (
    charaMapV4[row.name] ||
    [
      '大地精',
      '瑞江浦岛子',
      '前鬼 / 后鬼',
      '人面犬',
      '邪龙',
      '稻荷大人',
      '佑天上人',
      '读书狐狸',
      'STG作品中没有名称的角色',
    ].includes(row.name)
  )
    return
  const chv10 = Object.values(charasV10ByName).find((ch) => ch.name === row.name)
  charaMapV4[row.name] = chv10?.id || ''
})
// console.log(Object.entries(charaMapV4).filter(([, v]) => !v))
// throw ''
const charaMapV3: Record<string, string> = {
  '蕾迪·霍瓦特洛克': '13',
  莉莉白: '16',
  因幡帝: '30',
  '四季映姬·亚玛萨那度': '39',
  幽玄魔眼: '133',
  '玛艾露贝莉·赫恩': '135',
  雷兽: '162',
  露娜切尔德: '168',
  '无名的读书妖怪（朱鹭子）': '184',
}
await dbv3.each('SELECT * FROM r_chara', (err, row) => {
  if (
    charaMapV3[row.name] ||
    [
      '儚月抄召唤诸神',
      '大地精',
      '瑞江浦岛子',
      '邪龙',
      '人形（含上海人形、哥利亚人形）',
      '佑天上人',
      'STG作品中没有名称的BOSS',
    ].includes(row.name)
  )
    return
  const chv10 = Object.values(charasV10ByName).find((ch) => ch.name === row.name)
  charaMapV3[row.name] = chv10?.id || ''
})
// console.log(Object.entries(charaMapV3).filter(([, v]) => !v))
// throw ''

console.log('> Collect db')
const collectCharaV10 = async (db: Document[]) => {
  const votes: Record<string, number> = {}
  const votesFirst: Record<string, number> = {}
  for (const row of db) {
    for (const vote of row.characters) {
      if (!votes[vote.name]) votes[vote.name] = 0
      votes[vote.name]++
      if (vote.first) {
        if (!votesFirst[vote.name]) votesFirst[vote.name] = 0
        votesFirst[vote.name]++
      }
    }
  }
  const sum = Object.values(votes).reduce((a, b) => a + b, 0)
  const sumFirst = Object.values(votesFirst).reduce((a, b) => a + b, 0)
  return [votes, votesFirst, sum, sumFirst] as const
}
const collectCharaV9 = async (db: ImportedDB, charaMap: Record<string, string>) => {
  const votes: Record<string, number> = {}
  const votesFirst: Record<string, number> = {}
  await db.each('SELECT * FROM vote_chara', (err, row) => {
    if (!row.enable) return
    const newName = charasV10ByID[charaMap[charasV9[String(row.value) as '1']?.name]]?.name
    if (!newName) return
    if (!votes[newName]) votes[newName] = 0
    votes[newName]++
    if (row.first) {
      if (!votesFirst[newName]) votesFirst[newName] = 0
      votesFirst[newName]++
    }
  })
  const sum = Object.values(votes).reduce((a, b) => a + b, 0)
  const sumFirst = Object.values(votesFirst).reduce((a, b) => a + b, 0)
  return [votes, votesFirst, sum, sumFirst] as const
}
const collectCharaV4 = async (db: ImportedDB, charaMap: Record<string, string>) => {
  const votes: Record<string, number> = {}
  const votesFirst: Record<string, number> = {}
  await db.each('SELECT * FROM r_chara', (err, row) => {
    const newName = charasV10ByID[charaMap[row.name]]?.name
    if (!newName) return
    votes[newName] = row.total
    votesFirst[newName] = row.first
  })
  const sum = Object.values(votes).reduce((a, b) => a + b, 0)
  const sumFirst = Object.values(votesFirst).reduce((a, b) => a + b, 0)
  return [votes, votesFirst, sum, sumFirst] as const
}
const votesByChara = {
  v10: await collectCharaV10(dbv10),
  v9: await collectCharaV9(dbv9, charaMapV9),
  v8: await collectCharaV9(dbv8, charaMapV9),
  v7: await collectCharaV9(dbv7, charaMapV9),
  v6: await collectCharaV9(dbv6, charaMapV9),
  v5: await collectCharaV9(dbv5, charaMapV9),
  v4: await collectCharaV4(dbv4, charaMapV4),
  v3: await collectCharaV4(dbv3, charaMapV3),
}
await writeFile(
  r(`../gen/charaCountByYear.json`),
  JSON.stringify({
    sum: [
      // votesByChara.v10[2],
      votesByChara.v9[2],
      votesByChara.v8[2],
      votesByChara.v7[2],
      votesByChara.v6[2],
      votesByChara.v5[2],
      votesByChara.v4[2],
      votesByChara.v3[2],
    ],
    sumFirst: [
      // votesByChara.v10[3],
      votesByChara.v9[3],
      votesByChara.v8[3],
      votesByChara.v7[3],
      votesByChara.v6[3],
      votesByChara.v5[3],
      votesByChara.v4[3],
      votesByChara.v3[3],
    ],
    charas: Object.fromEntries(
      (charasV10 as Character[])
        .map((v) => {
          return [
            v.name,
            [
              // total, first
              // [votesByChara.v10[0][v.name] || 0, votesByChara.v10[1][v.name] || 0],
              [votesByChara.v9[0][v.name] || 0, votesByChara.v9[1][v.name] || 0],
              [votesByChara.v8[0][v.name] || 0, votesByChara.v8[1][v.name] || 0],
              [votesByChara.v7[0][v.name] || 0, votesByChara.v7[1][v.name] || 0],
              [votesByChara.v6[0][v.name] || 0, votesByChara.v6[1][v.name] || 0],
              [votesByChara.v5[0][v.name] || 0, votesByChara.v5[1][v.name] || 0],
              [votesByChara.v4[0][v.name] || 0, votesByChara.v4[1][v.name] || 0],
              [votesByChara.v3[0][v.name] || 0, votesByChara.v3[1][v.name] || 0],
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
