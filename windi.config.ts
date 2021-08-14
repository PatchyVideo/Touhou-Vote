import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'
import lineClamp from 'windicss/plugin/line-clamp'
import aspectRatio from 'windicss/plugin/aspect-ratio'

/**
 * WindiCSS Configuration File
 *
 * Docs: https://windicss.org/guide/configuration.html
 */
export default defineConfig({
  extract: {
    include: ['packages/**/*.{html,vue,ts,tsx,js,jsx,css}'],
  },
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-typography#usage
    typography,
    lineClamp,
    aspectRatio,
  ],
})
