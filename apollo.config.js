module.exports = {
  client: {
    service: {
      name: 'PVGQL(local)',
      localSchemaFile: './packages/graphql/__generated__/schema.graphql',
    },
    includes: ['./packages/**/*.{graphql,js,ts,jsx,tsx,vue}'],
    excludes: ['./packages/graphql/__generated__/*'],
    validationRules: [], // disable validation for now, most of the validations are incompatible with the current graphql plugin.
    tagName: 'gql',
  },
}
