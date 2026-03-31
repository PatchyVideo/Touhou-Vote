// 当前页面与提交链路默认仍使用旧版问卷数据结构。
// 这里继续导出共享包中的旧问卷定义，供现有问卷页面、首页问卷入口、
// 完成态判断与提交逻辑使用。
// `questionnaireV2` 仅作为并行开发中的新结构，不替代当前默认实现。

import { questionnaire } from '@touhou-vote/shared/data/questionnaire'
import type { QuestionnaireALL } from '@touhou-vote/shared/data/questionnaire'

export { QuestionnaireALL, questionnaire }
