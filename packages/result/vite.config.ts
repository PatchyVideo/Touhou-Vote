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
    vue(),
    // https://github.com/hannoeru/vite-plugin-pages
    pages(),
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    layouts(),
    // https://github.com/antfu/unplugin-auto-import
    autoImport({
      dirs: ['src/composables/*/index.{js,ts,jsx,tsx}'],
      imports: [
        'vue',
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
  server: {
    proxy: {
      // 对应 Dockerfile.result.template 的 `location /res-be/` → 后端根路径。
      // 源码只用 /res-be/graphql（composables/graphql/index.ts）。
      // 此前指向老 Rust 生产后端 touhou.ai，而 result 页面已按 Python 契约层
      // 重写（12 个 query* 字段），老 Rust 没有这些字段 → dev 下必然报错。
      '/res-be': {
        target: process.env.VITE_DEV_BACKEND ?? 'http://154.37.215.62:18000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/res-be/, ''),
      },
    },
  },
  build: {
    sourcemap: true,
    assetsDir: 'v11/assets',
  },
  esbuild: {
    charset: 'utf8',
  },
})
