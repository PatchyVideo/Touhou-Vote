// @ts-check
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

/**
 * dev 模式下后端地址。默认指向测试机；想连本地起的后端时：
 *   VITE_DEV_BACKEND=http://localhost:8000 pnpm dev
 */
const BACKEND = process.env.VITE_DEV_BACKEND ?? 'http://154.37.215.62:18000'

export default defineConfig(({ command }) => {
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
      port: 5175,
      proxy: {
        // ⚠️ 以下四条必须与 Dockerfile.vote.template 的 nginx v12 块**逐条对应**。
        //    改一处必须同步另一处：dev 走这里、部署走 nginx，两边不一致会出现
        //    "本地好的、线上坏的"（或反之）。2026-08-31 就是因为 v12 迁移只改了
        //    apiPrefix.ts 和 nginx、漏了这里，导致 dev 下所有后端请求被 SPA
        //    fallback 静默返回 index.html。
        '/v12-be/vote-objects/': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/v12-be\/vote-objects\//, '/api/v1/vote-objects/'),
        },

        '/v12-be/questionnaire/': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/v12-be\/questionnaire\//, '/api/v1/questionnaire/'),
        },

        // 对应 nginx 的 `location = /v12-be/doujin/api`（精确匹配）
        '^/v12-be/doujin/api(\\?.*)?$': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/v12-be\/doujin\/api/, '/api/v1/scraper/scrape'),
        },

        // 兜底：覆盖 /graphql 与根路径的 legacy-compat 端点（如 /user-token-status）
        '/v12-be/': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/v12-be/, ''),
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
        // 解决 thwiki 图片跨域的代理
        '/thwiki-assets': {
          target: 'https://static.thwiki.cc',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/thwiki-assets/, ''),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';

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
