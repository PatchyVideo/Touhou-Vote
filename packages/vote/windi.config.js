import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'
import lineClamp from 'windicss/plugin/line-clamp'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import animation from '@windicss/plugin-animations'
import { palette } from './src/theme/colors'

/**
 * WindiCSS Configuration File
 *
 * Docs: https://windicss.org/guide/configuration.html
 *
 * Colors live in src/theme/colors.ts; this file only maps them to semantic names.
 */
export default defineConfig({
  extract: {
    include: ['src/**/*.{html,vue,ts,tsx,js,jsx,css}'],
  },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand color: 100-300 tints, 600 primary, 700+ text/emphasis
        'accent-color': palette.accent,
        subaccent: palette.surface, // card background
        'subaccent-divider': palette.divider, // separators
        textaccent: palette.text, // body text
        textmuted: palette.textMuted, // secondary text
        onaccent: palette.onAccent, // text on accent
        overlay: palette.mask, // modal overlay
      },
      screens: {
        '3xl': '1920px',
      },
      boxShadow: {
        around: '5px 20px 25px rgba(0, 0, 0, 0.1), -3px -3px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-typography#usage
    typography,
    lineClamp,
    aspectRatio,
    animation,
  ],
})
