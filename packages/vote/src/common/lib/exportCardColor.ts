/**
 * 导出投票卡片的配色计算。
 * 角色 / 音乐 / CP 三张卡片共用同一套规则，集中在这里避免各写一份后风格漂移。
 */

const FALLBACK_COLOR = '#FC4328'

function parseHex(input: string): number[] | null {
  const matched = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(input.trim())
  if (!matched) return null
  const hex = matched[1]
  return hex.length === 3
    ? hex.split('').map((c) => parseInt(c + c, 16))
    : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) => parseInt(c, 16))
}

function toHex(rgb: number[]): string {
  return `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`
}

/**
 * 把候选自带的颜色规整成 6 位 hex。
 * 亮度过高的颜色（卡片是白底，几乎看不见）会退成灰色；解析不出来的退回默认色。
 */
export function normalizeColor(input: string | undefined): string {
  if (!input) return FALLBACK_COLOR
  const rgb = parseHex(input)
  if (!rgb) return FALLBACK_COLOR
  const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
  if (luminance > 0.9) return '#999999'
  return toHex(rgb)
}

/** 按比例压暗一个颜色，用于本命卡片的深色底；解析不出来时原样返回。 */
export function darkenColor(input: string, amount: number): string {
  const rgb = parseHex(input)
  if (!rgb) return input
  const scale = Math.max(0, Math.min(1, 1 - amount))
  return toHex(rgb.map((v) => v * scale))
}

function hashStringToHue(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % 360
}

function hslToHex(h: number, s: number, l: number): string {
  const sRatio = s / 100
  const lRatio = l / 100
  const c = (1 - Math.abs(2 * lRatio - 1)) * sRatio
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lRatio - c / 2
  const [r, g, b] =
    h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
    : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c]
    : h < 300 ? [x, 0, c]
    : [c, 0, x]
  return toHex([r, g, b].map((v) => (v + m) * 255))
}

/**
 * 曲目没有自带颜色，按曲名哈希出一个稳定的深色。
 * 取较低的亮度是为了保证深色底上的白字读得清。
 */
export function getMusicColor(name: string): string {
  return hslToHex(hashStringToHue(name || 'music'), 68, 32)
}
