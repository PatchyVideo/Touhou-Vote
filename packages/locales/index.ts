import { computed } from 'vue'
import { createI18n } from 'vue-i18n'
import { match } from '@formatjs/intl-localematcher/lib'
import type { Locale } from '@formatjs/intl-locale'
import { useLocalStorage } from '@vueuse/core'

export const messages = Object.fromEntries(
  Object.entries(import.meta.globEagerDefault('./*.{yml,yaml,json}')).map(([key, value]) => [
    key.replace(/.+\/(.+)\.(?:ya?ml|json)/, '$1'),
    value as never,
  ])
)

export const langs = Object.keys(messages)

const lslang = useLocalStorage<string | undefined>('lang', undefined)

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLang() || 'zh-Hans-CN',
  availableLocales: langs,
  fallbackLocale: 'zh-Hans-CN',
  messages,
})

export default i18n

function getBrowserLang(): string | undefined {
  const userLangs = [...navigator.languages]
  if (lslang.value && lslang.value !== 'undefined' && lslang.value !== 'null') userLangs.unshift(lslang.value)
  let result
  try {
    result = match(userLangs, langs, 'zh-Hans-CN', { algorithm: 'best fit' })
  } catch (e) {
    result = 'zh-Hans-CN'
    if (!(e instanceof RangeError)) throw e
  }
  return result
}

function setBrowserLang(lang: string) {
  if (lang === navigator.language) {
    lslang.value = undefined
    return
  }
  lslang.value = lang
}

export const locale = computed({
  get: () => {
    return i18n.global.locale.value
  },
  set: (x: string) => {
    setBrowserLang(x)
    i18n.global.locale.value = x
    if (confirm(i18n.global.t('locales.change-lang-reload-hint'))) location.reload()
  },
})

export const userPreferredLocales = computed(() => [locale.value, ...navigator.languages])

export function BCP47ToISO639(code: string): string {
  try {
    // https://github.com/microsoft/TypeScript/pull/39664
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lo = new Intl.Locale(code) as Locale
    switch (lo.language) {
      case 'yue':
        return 'CHT'

      case 'zh': {
        switch (lo.script) {
          case 'Hans':
            return 'CHS'
          case 'Hant':
            return 'CHT'
        }
        switch (lo.region) {
          case 'CN':
            return 'CHS'
          case 'HK':
          case 'TW':
            return 'CHT'
        }
        return 'CHS'
      }
      case 'cs':
        return 'CSY'
      case 'en':
        return 'ENG'
      case 'nl':
        return 'NLD'
      case 'fr':
        return 'FRA'
      case 'de':
        return 'DEU'
      case 'hu':
        return 'HUN'
      case 'it':
        return 'ITA'
      case 'ja':
        return 'JPN'
      case 'ko':
        return 'KOR'
      case 'pl':
        return 'PLK'
      case 'ro':
        return 'ROM'
      case 'ru':
        return 'RUS'
      case 'es':
        return 'ESP'
      case 'tr':
        return 'TRK'
      case 'vi':
        return 'VIM'
    }
    return 'CHS'
  } catch (e) {
    return 'CHS'
  }
}
export const iso639locale = computed(() => BCP47ToISO639(locale.value))
export const iso639nav = computed(() => BCP47ToISO639(navigator.language))

export const languagesList = [
  { id: 1, value: 'CHS', label: '简体中文' },
  { id: 2, value: 'CHT', label: '繁體中文' },
  { id: 3, value: 'CSY', label: 'čeština' },
  { id: 4, value: 'NLD', label: 'Nederlands' },
  { id: 5, value: 'ENG', label: 'English' },
  { id: 6, value: 'FRA', label: 'français' },
  { id: 7, value: 'DEU', label: 'Deutsch' },
  { id: 8, value: 'HUN', label: 'magyar nyelv' },
  { id: 9, value: 'ITA', label: 'italiano' },
  { id: 10, value: 'JPN', label: '日本語' },
  { id: 11, value: 'KOR', label: '한국어' },
  { id: 12, value: 'PLK', label: 'polski' },
  { id: 13, value: 'PTB', label: 'português' },
  { id: 14, value: 'ROM', label: 'limba română' },
  { id: 15, value: 'RUS', label: 'русский язык' },
  { id: 16, value: 'ESP', label: 'español' },
  { id: 17, value: 'TRK', label: 'Türk dili' },
  { id: 18, value: 'VIN', label: 'Tiếng Việt' },
]
function IDToISO639(id: number): string {
  return languagesList.find((item) => item.id === id)?.value || 'NAL'
}

interface LangItemWithName {
  lang: string
  value: string
}
interface LangItemWithID {
  l: number
  w: string
}
export function behMostMatch(valueWithLang: LangItemWithName[]): string {
  const lang = iso639locale.value
  for (const value of valueWithLang) {
    if (value.lang === lang) return value.value
  }
  return valueWithLang[0].value || 'undifined'
}
export function langBestMatchName(valueWithLang: LangItemWithName[]): string {
  const siteLang = iso639locale.value
  const browserlang = iso639nav.value
  for (const value of valueWithLang) {
    if (value.lang === siteLang) return value.value
    else if (value.lang === browserlang) return value.value
  }
  return valueWithLang[0].value || 'undifined'
}
export function langBestMatchID(valueWithLang: LangItemWithID[]): string {
  const siteLang = iso639locale.value
  const browserlang = iso639nav.value
  for (const value of valueWithLang) {
    if (IDToISO639(value.l) === siteLang) return value.w
    else if (IDToISO639(value.l) === browserlang) return value.w
  }
  return valueWithLang[0].w || 'undifined'
}

export function pickBestLocale(locales: string[], defaultLocale?: string): string {
  return match(userPreferredLocales.value, locales, defaultLocale ?? locales[0], { algorithm: 'best fit' })
}
