import type { Router } from 'vue-router'
import { popMessageText } from '@/common/lib/popMessage'

// 命中后端问卷门禁(QUESTIONNAIRE_NOT_COMPLETED)时提示并跳转问卷页。
// 返回 true 表示已处理,调用方应中止后续默认错误提示。
export function handleQuestionnaireGateError(error: any, router: Router): boolean {
  if (error?.graphQLErrors?.[0]?.extensions?.error_kind === 'QUESTIONNAIRE_NOT_COMPLETED') {
    popMessageText('请先完成基础问卷后再投票')
    router.push('/questionnaire')
    return true
  }
  return false
}
