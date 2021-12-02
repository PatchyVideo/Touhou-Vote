import { ref } from 'vue'
export const ruleMessageBoxOpen = ref(false)
export function openRuleMessageBox(): void {
  ruleMessageBoxOpen.value = true
}
