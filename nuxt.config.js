import path from 'path'

export default {
  /*
   * Nuxt rendering mode
   * See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   * Nuxt target
   * See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   * Headers of the page
   * See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: '东方Project人气投票 第九回',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '天朝东方Project人气投票 第九回' },
      { hid: 'keyword', name: 'keyword', content: '东方Project 东方 人气投票 TBSGroup PatchyVideo' },
      { hid: 'author', name: 'author', content: 'TBSGroup PatchyVideo' },
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   * Global CSS
   */
  css: [],
  /*
   * Plugins to load before mounting the App
   * https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   * Auto import components
   * See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   * Nuxt.js dev-modules
   */
  buildModules: [
    // Nuxt TypeScript Builder
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://composition-api.now.sh/
    'nuxt-composition-api',
  ],
  /*
   * Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://nuxt-community.github.io/nuxt-i18n/
    [
      'nuxt-i18n',
      {
        locales: ['zh-CN', 'en-US'],
        defaultLocale: 'zh-CN',
        lazy: true,
        langDir: 'locales/',
      },
    ],
  ],
  /*
   * Axios module configuration
   * See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   * Build configuration
   * See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    postcss: {
      plugins: {
        // Doc: https://github.com/postcss/autoprefixer#readme
        autoprefixer: {},
        // Doc: https://github.com/postcss/postcss-import#readme
        'postcss-import': {},
        // Doc: https://github.com/postcss/postcss-nested#readme
        'postcss-nested': {},
        // Doc: https://tailwindcss.com/
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
      },
      preset: {
        stage: 1, // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-featuress
      },
    },
  },
}
