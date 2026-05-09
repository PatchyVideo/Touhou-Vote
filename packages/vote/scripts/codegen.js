;(async () => {
  console.log('> GraphQL > Codegen')
  const fs = require('fs')
  const path = require('path')
  const generatedDir = path.join(__dirname, '../src/graphql/__generated__')
  fs.mkdirSync(generatedDir, { recursive: true })
  process.env.GRAPHQL_SCHEMA_URL ??= 'https://touhou.ai/vote-be/graphql'
  await exec('pnpm', ['exec', 'graphql-codegen', '--config', './src/graphql/codegen.yml'])
  console.log('\n')
})()

function exec(cmd, args) {
  const child_process = require('child_process')
  return new Promise((resolve) => {
    const proc = child_process.spawn(cmd, args, {
      stdio: 'inherit',
      cwd: __dirname + '/../',
      shell: true,
    })
    proc.on('error', (e) => {
      throw e
    })
    proc.on('exit', resolve)
  })
}
