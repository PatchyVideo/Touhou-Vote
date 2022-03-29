;(async () => {
  console.log('> GraphQL > Codegen')
  await exec('graphql-codegen --config ./src/graphql/codegen.yml')
  console.log('\n')
})()

function exec(cmd) {
  const child_process = require('child_process')
  return new Promise((resolve) => {
    const proc = child_process.spawn('pnpm', ['exec ' + cmd], {
      stdio: 'inherit',
      shell: true,
    })
    proc.on('error', (e) => {
      throw e
    })
    proc.on('exit', resolve)
  })
}
