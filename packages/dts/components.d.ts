import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router').RouterLink
    RouterView: typeof import('vue-router').RouterView
    'i18n-t': {
      new (): {
        $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & import('vue-i18n').TranslationProps
      }
    }
    'i18n-d': {
      new (): {
        $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & import('vue-i18n').DatetimeFormatProps
      }
    }
    'i18n-n': {
      new (): {
        $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & import('vue-i18n').NumberFormatProps
      }
    }
  }
}

export {}
