// @ts-check

/**
 * ESLint Configuration File
 *
 * Docs: https://eslint.org/docs/user-guide/configuring
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
  },
  overrides: [
    {
      files: ['./*.config.js', './*rc.js', '**/scripts/**/*.js', './public/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      env: {
        es2020: true,
        browser: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      env: {
        es2020: true,
        browser: true,
      },
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['*.vue'],
      env: {
        es2020: true,
        browser: true,
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      },
    },
  ],
}
