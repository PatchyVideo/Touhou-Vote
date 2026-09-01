import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'

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
      // navigator 是纯静态站，没有后端调用：源码零处引用 /nav-be，
      // Dockerfile.navigator.template 也只有 `location /`、没有任何 proxy 块。
      // 原先那条 /nav-be → localhost:80 是残留配置，已移除。
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
