import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'

const HOST = 'http://localhost'

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      vue(),
      autoImport({
        imports: ['vue', 'vue-router', '@vueuse/core'],
        dts: true,
      }),
      components({
        dts: true,
      }),
      unocss(),
    ],
    server: {
      proxy: {
        '/nav-be': {
          target: `${HOST}/nav-be`,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/nav-be/, ''),
        },
      },
    },
    build: {
      sourcemap: true,
      assetsDir: 'nav/assets',
    },
    esbuild: {
      charset: 'utf8',
    },
  }
})
