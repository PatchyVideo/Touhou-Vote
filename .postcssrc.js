// @ts-check

/**
 * PostCSS Configuration File
 *
 * See https://github.com/postcss/postcss#usage
 */
module.exports = {
  plugins: [
    // Docs: https://github.com/postcss/autoprefixer#readme
    require('autoprefixer'),
    // Docs: https://github.com/postcss/postcss-import#readme
    require('postcss-import'),
    // Docs: https://github.com/postcss/postcss-mixins#readme
    require('postcss-mixins'),
    // Docs: https://github.com/postcss/postcss-nested#readme
    require('postcss-nested'),
  ],
  preset: {
    stage: 1,
  },
}
