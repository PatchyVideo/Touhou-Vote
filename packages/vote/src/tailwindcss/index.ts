import 'virtual:windi.css'
import './global.postcss'

import { useMediaQuery } from '@vueuse/core'
import { computed, reactive } from 'vue'

const queries = {
  sm: useMediaQuery('(min-width: 640px)'),
  md: useMediaQuery('(min-width: 768px)'),
  lg: useMediaQuery('(min-width: 1024px)'),
  xl: useMediaQuery('(min-width: 1280px)'),
  '2xl': useMediaQuery('(min-width: 1536px)'),
  '3xl': useMediaQuery('(min-width: 1920px)'),
}

export const screenSizes = reactive({
  ...queries,

  '<sm': computed(() => !queries.sm.value),
  '<md': computed(() => !queries.md.value),
  '<lg': computed(() => !queries.lg.value),
  '<xl': computed(() => !queries.xl.value),
  '<2xl': computed(() => !queries['2xl'].value),
  '<3xl': computed(() => !queries['3xl'].value),

  '@sm': computed(() => queries.sm.value && !queries.md.value),
  '@md': computed(() => queries.md.value && !queries.lg.value),
  '@lg': computed(() => queries.lg.value && !queries.xl.value),
  '@xl': computed(() => queries.xl.value && !queries['2xl'].value),
  '@2xl': computed(() => queries['2xl'].value && !queries['3xl'].value),
  '@3xl': computed(() => queries['3xl'].value),
})
