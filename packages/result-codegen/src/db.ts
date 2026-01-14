import { readFile } from 'fs/promises'
import initSqlJs from 'sql.js'

export async function importDB(file: string) {
  console.log(`> Import DB ${file} > Importing`)

  const SQL = await initSqlJs({
    // Required when sql.js is loaded by webpack or other bundlers
    locateFile: (filename: string) => `https://sql.js.org/dist/${filename}`,
  })

  const db = new SQL.Database()

  const sqlContent = await readFile(new URL(`../data/${file}`, import.meta.url), 'utf8')

  try {
    db.exec(sqlContent)
  } catch (err) {
    console.warn(`Warning: failed to execute SQL:`, err)
  }

  console.log(`> Import DB ${file} > Done`)

  return {
    db,
    run: (sql: string, params?: any[]) => db.run(sql, params),
    exec: (sql: string) => db.exec(sql),
    each: (sql: string, cb: (row: any) => void) => {
      const stmt = db.prepare(sql)
      let row
      while (stmt.step()) {
        row = stmt.getAsObject()
        cb(row)
      }
      stmt.free()
      return 0 // sql.js doesn't return count
    },
  }
}

export type ImportedDB = Awaited<ReturnType<typeof importDB>>
