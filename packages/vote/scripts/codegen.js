;(async () => {
  console.log('> GraphQL > Codegen')
  await exec('pnpm', ['exec', 'graphql-codegen', '--config', './src/graphql/codegen.yml'])
  console.log('\n')
})()

function exec(cmd, args) {
  const child_process = require('child_process')
  return new Promise((resolve) => {
    const proc = child_process.spawn(cmd, args, {
      stdio: 'inherit',
      cwd: __dirname + '/../',
    })
    proc.on('error', (e) => {
      throw e
    })
    proc.on('exit', resolve)
  })
}
