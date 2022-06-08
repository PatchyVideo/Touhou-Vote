import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@touhou-vote/result-codegen', '@touhou-vote/shared'],
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue(),
    // https://github.com/hannoeru/vite-plugin-pages
    pages(),
    // https://github.com/antfu/unplugin-auto-import
    autoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: true,
    }),
    // https://github.com/antfu/vite-plugin-components
    components({
      dirs: ['src/layouts/components'],
      dts: true,
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    unocss(),
  ],
  build: {
    sourcemap: true,
    assetsDir: 'v10/assets',
  },
  esbuild: {
    charset: 'utf8',
  },
})
