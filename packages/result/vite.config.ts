import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import layouts from 'vite-plugin-vue-layouts'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'

export default defineConfig({
  optimizeDeps: {
    include: ['@apollo/client/core', '@apollo/client/utilities'],
    exclude: ['@apollo/client', '@touhou-vote/result-codegen', '@touhou-vote/shared'],
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    // https://github.com/hannoeru/vite-plugin-pages
    pages(),
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    layouts(),
    // https://github.com/antfu/unplugin-auto-import
    autoImport({
      dirs: ['src/composables/*/index.{js,ts,jsx,tsx}'],
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
        {
          '@touhou-vote/shared/composables/setSiteTitle': ['setSiteTitle'],
        },
      ],
      dts: true,
    }),
    // https://github.com/antfu/vite-plugin-components
    components({
      dirs: ['src/components'],
      dts: true,
      directoryAsNamespace: true,
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    unocss(),
  ],
  build: {
    sourcemap: true,
    assetsDir: 'v11/assets',
  },
  esbuild: {
    charset: 'utf8',
  },
})
