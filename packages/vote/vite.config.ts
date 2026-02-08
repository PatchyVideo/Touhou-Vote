// @ts-check
import { promises as fsp } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
import components from 'unplugin-vue-components/vite'
import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import { visualizer } from 'rollup-plugin-visualizer'
import yaml from '@rollup/plugin-yaml'

/**
 * Vite Configuration File
 * Docs: https://vitejs.dev/config/
 */
// 自动创建生成目录逻辑（同步实现）
const list = ['dts']
for (const dir of list) {
  try {
    // 使用同步方法确保目录存在
    require('fs').mkdirSync(resolve(__dirname, `./src/${dir}/__generated__`), { recursive: true })
  } catch (e) {
    // 忽略目录已存在的错误
  }
}

export default defineConfig(({ command, mode }) => {
  return {
    optimizeDeps: {
      exclude: ['@touhou-vote/shared'],
    },
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, './src/')}/`,
        '@@/': `${resolve(__dirname, './')}/`,
      },
    },
    plugins: [
      yaml(),
      vue(),
      windicss(),
      components({
        dirs: [],
        resolvers: [
          iconsResolver({
            componentPrefix: 'icon',
          }),
        ],
        dts: resolve(__dirname, './src/dts/__generated__/viteComponents.d.ts'),
      }),
      icons(),
      // 仅在构建时启用分析
      command === 'build' ? visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }) : undefined,
    ].filter(Boolean),

    server: {
      proxy: {
        // 现有的后端接口代理
        '/v11-be': {
          target: 'https://touhou.ai/vote-be',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/v11-be/, ''),
        },
        
        // 重点：解决东方云盘图片跨域的代理
        '/th-assets': {
          target: 'https://asset.lilywhite.cc',
          changeOrigin: true,
          secure: false, // 如果目标站是自签名证书或有SSL问题，设为 false
          rewrite: (path: string) => path.replace(/^\/th-assets/, ''),
          
          // 核心配置：修改响应头
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              // 1. 强行添加 CORS 允许头
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';
              
              // 2. 优化图片缓存控制（可选）
              if (proxyRes.headers['content-type']?.includes('image')) {
                proxyRes.headers['cache-control'] = 'public, max-age=31536000';
              }
            });
          }
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
  }
})