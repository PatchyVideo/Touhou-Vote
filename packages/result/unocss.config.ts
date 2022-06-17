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
})
