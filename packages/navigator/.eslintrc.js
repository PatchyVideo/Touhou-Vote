// @ts-check

/**
 * ESLint Configuration File
 *
 * Docs: https://eslint.org/docs/user-guide/configuring
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  overrides: [
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
