import { useLocalStorage, usePreferredDark } from '@vueuse/core'
import { ref, watch } from 'vue'

const htmlRoot = document.querySelector('html')
const themeMeta = document.querySelector('meta[name="color-scheme"]')

const themePreference = useLocalStorage('themePreference', '', { listenToStorageChanges: true, flush: 'post' })
const themes = ['light', 'dark']

function updateDOM(v: boolean) {
  if (v) {
    htmlRoot?.classList.contains('dark') || htmlRoot?.classList.add('dark')
    themeMeta?.setAttribute('content', 'dark')
  } else {
    htmlRoot?.classList.contains('dark') && htmlRoot?.classList.remove('dark')
    themeMeta?.setAttribute('content', 'light')
  }
}

const preferredDark = usePreferredDark()

export const isDark = ref(false)

watch(
  [themePreference],
  () => {
    if (themes.includes(themePreference.value)) {
      isDark.value = themePreference.value === 'dark'
    } else {
      isDark.value = preferredDark.value
    }
  },
  {
    flush: 'post',
    immediate: true,
  }
)

watch(
  [isDark],
  () => {
    if (themes.includes(themePreference.value) && isDark.value === preferredDark.value) {
      themePreference.value = ''
    } else if (isDark.value !== preferredDark.value) {
      themePreference.value = isDark.value ? 'dark' : 'light'
    }
    updateDOM(isDark.value)
  },
  {
    flush: 'post',
  }
)
