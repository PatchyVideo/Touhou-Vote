import type { Ref } from 'vue'

export const screens = {
  sm: '576px',
  md: '720px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
  '3xl': '1540px',
  '4xl': '1860px',
  '5xl': '2480px',
}

const queries: [string, Ref<boolean>][] = Object.entries(screens).map(([k, v]) => [
  k,
  useMediaQuery(`(min-width: ${v})`),
])

export const screenSizes = reactive({
  ...Object.fromEntries(queries),
  ...Object.fromEntries(queries.map(([k, v]) => [`<${k}`, computed(() => !v.value)])),
  ...Object.fromEntries(
    queries.map(([k, v], i) => [`@${k}`, computed(() => v.value && !(queries[i + 1] ?? [])[1].value)])
  ),
})
