import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const confirmedQuestionnaireNotice = useLocalStorage('confirmedQuestionnaireNotice', false)
export const ruleMessageBoxOpen = computed<boolean>({
  get() {
    return !confirmedQuestionnaireNotice.value
  },
  set(value) {
    confirmedQuestionnaireNotice.value = !value
  },
})
