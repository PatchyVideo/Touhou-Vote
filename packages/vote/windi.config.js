import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'
import lineClamp from 'windicss/plugin/line-clamp'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import animation from '@windicss/plugin-animations'

/**
 * WindiCSS Configuration File
 *
 * Docs: https://windicss.org/guide/configuration.html
 */
export default defineConfig({
  extract: {
    include: ['src/**/*.{html,vue,ts,tsx,js,jsx,css}'],
  },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // accent-color-600 is the default accent color of the project
        // accent-color-300 is recommended to used for text
        'accent-color': {
          100: '#D6CEE6',
          200: '#D6C2F7',
          300: '#BDA6EF',
          400: '#AD8EEF',
          500: '#9C75EF',
          600: '#7351C5',
          700: '#5A41A4',
          800: '#4A317B',
          900: '#312052',
        },
        subaccent: '#3A3531',
        // Color for divider in home page
        'subaccent-divider': '#5a5a56',
        textaccent: '#CEBEAD',
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
