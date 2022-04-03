import { readFile } from 'fs/promises'
import type { Statement } from 'sqlite3'
import sqlite3_ from 'sqlite3'
import { promisify } from 'util'

const { Database } = sqlite3_.verbose()

export async function importDB(file: string) {
  console.log(`> Import DB ${file} > Importing`)
  const db = new Database(':memory:')

  const run = promisify(db.run.bind(db))
  const exec = promisify(db.exec.bind(db))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const each = (sql: string, cb: (this: Statement, err: Error | null, row: any) => void) =>
    new Promise((resolve, reject) => {
      db.each(sql, cb, (err, count) => {
        if (err) reject(err)
        else resolve(count)
      })
    })

  db.serialize()

  await exec(await readFile(new URL(`../data/${file}`, import.meta.url), 'utf8'))

  console.log(`> Import DB ${file} > Done`)

  return {
    db,
    run,
    exec,
    each,
  }
}

export type ImportedDB = Awaited<ReturnType<typeof importDB>>
