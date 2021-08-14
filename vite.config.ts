// @ts-check
import fs, { promises as fsp } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
import components from 'vite-plugin-components'
import viteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
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
        customComponentResolvers: [
          ViteIconsResolver({
            componentPrefix: 'icon',
          }),
        ],
        globalComponentsDeclaration: 'packages/dts/__generated__/viteComponents.d.ts',
      }),
      viteIcons(),
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
    },
  }
})
