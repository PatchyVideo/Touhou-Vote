const { resolve } = require('path')

module.exports = {
  client: {
    service: {
      name: 'PVGQL(local)',
      localSchemaFile: resolve(__dirname, './src/graphql/__generated__/schema.graphql'),
    },
    includes: [resolve(__dirname, './src/**/*.{graphql,js,ts,jsx,tsx,vue}')],
    excludes: [resolve(__dirname, './src/graphql/__generated__/*')],
    validationRules: [], // disable validation for now, most of the validations are incompatible with the current graphql plugin.
    tagName: 'gql',
  },
}
