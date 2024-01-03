import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    colors: {
      // accent-600 is the default accent color of the project
      accent: {
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
      textaccent: '#CEBEAD',
    },
    screens: {
      '3xl': '1920px',
    },
    boxShadow: {
      around: '5px 20px 25px rgba(0, 0, 0, 0.1), -3px -3px 10px rgba(0, 0, 0, 0.1)',
    },
  },
})
