/**
 * Global palette — single source of truth.
 *
 * windi.config.js maps it to utility colors; global.postcss exposes them as
 * `--color-*` variables. Use `var(--color-*)` in styles; import `palette` in JS
 * when a raw value is needed (canvas, fallbacks).
 */
export const accent = {
  100: '#FCECEC',
  200: '#F8DAD8',
  300: '#F1B5B0',
  400: '#EA8F88',
  500: '#E36A60',
  600: '#DB4437',
  700: '#B23A2E',
  800: '#8C2318',
  900: '#5E130C',
} as const

export const palette = {
  accent,
  surface: '#FFFFFF', // card/panel background
  divider: '#F8DAD8', // separators
  text: '#3A2E2B', // body text
  textMuted: '#6B5B57', // secondary text
  onAccent: '#FFFFFF', // text on accent
  mask: 'rgba(0, 0, 0, 0.3)', // modal overlay
  /** Fallbacks for data without a color */
  fallback: {
    character: accent[600], // default card color
    honmei: accent[800], // default honmei header
    contrast: '#999999', // for very light backgrounds
  },
  /** Department colors */
  department: {
    role: accent[600],
    music: '#2563EB',
    cp: '#DB2777',
  },
  /** Doujin type tag colors */
  doujinType: {
    none: '#000000',
    music: '#4CAF50',
    video: '#FF9800',
    drawing: '#D6C231',
    software: '#F77194',
    article: '#0075C5',
    craft: '#6339B5',
    other: '#733542',
  },
} as const

export type Palette = typeof palette
