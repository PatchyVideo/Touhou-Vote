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
      colors: {
        // accent-color-600 is the default accent color of the project
        'accent-color': {
          100: '#FCECEC',
          200: '#F8DAD8',
          300: '#F1B5B0',
          400: '#EA8F88',
          500: '#E36A60',
          600: '#DB4437',
          700: '#280D0B',
          800: '#561B15',
          900: '#822820',
        },
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
  ],
})
