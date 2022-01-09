// @ts-check
import fs, { promises as fsp } from 'fs'
import path from 'path'
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
 *
 * Docs: https://vitejs.dev/config/
 */
export default defineConfig(async ({ command, mode }) => {
  /* create __generated__ dir */
  {
    const list = ['dts']
    const promises = []
    for (const dir of list) promises.push(fsp.mkdir(path.resolve(__dirname, `./packages/${dir}/__generated__`)))
    await Promise.allSettled(promises)
  }

  return {
    base: '/v10/',
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './packages/') },
        { find: '@@', replacement: path.resolve(__dirname, './') },
      ],
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
        dts: 'packages/dts/__generated__/viteComponents.d.ts',
      }),
      icons(),
      {
        ...visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
        apply: 'build',
      },
    ],
    build: {
      sourcemap: true,
      assetsDir: 'v10/assets',
    },
  }
})
