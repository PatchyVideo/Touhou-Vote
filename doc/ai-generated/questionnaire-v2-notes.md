# 当前问卷 V2 指南

核对日期：2026-11-09；依据当前本地实现，未核验线上题库和部署。
本页是当前问卷实现的阅读入口；历史模型说明和迁移方案见[归档索引](../../docs/archive/frontend/README.md)。

## 定义来源与职责

- 正式问卷定义由后端 `${API_PREFIX}/questionnaire/structure` 返回，响应为 `{ questionnaires: [...] }`。
- [共享请求](../../packages/shared/api/questionnaire.ts)供填写与结果应用加载同一后端结构；[共享类型](../../packages/shared/data/questionnaireV2.ts)定义契约，不维护前端静态题库或正式题目内容。
- 问卷定义包含 `id`、`key`、`title`、`introduction`、`category`、`required`、`order` 和 `questionGroups`。
- `category` 为 `main` 或 `extra`；页面和首页消费这些分类，必填完成态读取 `required`。
- 问题组包含 `id`、`order`、`hiddenByDefault`、`questions`；当前模型没有 `initialQuestionId`。
- 题目与选项的 `id` 用于作答关联，可空 `code` 用于结果统计/DSL/链接，不可混用。题目类型为 `Single`、`Multiple`、`Input`；选项携带 `relatedQuestionIds`、`mutexOptionIds`、`optionGroup`。
- 题目、分组、选项及其 ID 以本次后端返回为准；本地旧表不能用来判断线上缺题或分配 ID。

## 当前主链路

1. [登录状态模块](../../packages/vote/src/home/lib/user.ts)加载问卷结构，再调用 `restorePaperV2` 恢复后端答案。
2. [questionnaireStateV2.ts](../../packages/vote/src/questionnaire/lib/questionnaireStateV2.ts)管理结构、答案草稿、持久化与完成态。
3. [questionnaireV2Parser.ts](../../packages/vote/src/questionnaire/lib/questionnaireV2Parser.ts)把定义与草稿解析为可见题组和当前题目。
4. [Questionnaire.vue](../../packages/vote/src/questionnaire/Questionnaire.vue)渲染题目、修改答案并提交；[切题侧栏](../../packages/vote/src/questionnaire/components/QuestionnaireChange.vue)使用同一运行时。
5. 首页问卷入口与[路由守卫](../../packages/vote/src/main/main.ts)使用 V2 状态，不再以旧 `questionnaireData.ts` 作为主状态中心。

## 答案、提交与回填

草稿按问卷 ID 保存为 `QuestionnaireDrafts`；每个问卷下的 `groups` 包含：

- `groupId`
- `activeQuestionId`（隐藏时为 `null`）
- `selectedOptionIds`
- `input`

`buildAnswerStatePayload()` 遍历当前定义中的问卷与题组，输出扁平答案行。
每行包含 `questionnaireId` 及上述题组字段，直接作为 `submitPaperV2(voteToken, answers)` 的 `answers`。
页面提交的是这份全量答案数组，未走 `v2 -> 旧 paperJson` 转换。

`getPaperV2` 返回 snake_case 行：`questionnaire_id`、`group_id`、`active_question_id`、`selected_option_ids`、`input_text`。
状态模块将这些行映射到现有题组，重新归一化并写回草稿。
后端返回非空行时应用这些行；返回空数组或请求失败时保留本地草稿。
这些是当前客户端恢复行为，不代表本次已完成真实账号联调。

## 可见性与分支

- 解析器要求数组中的第一个问题组存在且仅有一道题，不满足时抛错。
- `order === 1` 的问题组固定显示其 `questions[0]`。
- 其他题组没有选项触发时，按 `hiddenByDefault` 决定隐藏或显示 `questions[0]`。
- 当前可见题目的已选选项通过 `relatedQuestionIds` 指向真实题目 ID，解析器据定义查找所属题组。
- 多个触发命中同一组时，若当前题仍在命中列表中则保留，否则取第一项。
- 题目切换或题组隐藏时清空该组旧选项和输入；隐藏题组的 `activeQuestionId` 为 `null`。
- 当前逻辑不以题目 ID 尾数 `0` 判定隐藏，也不推导“题目 ID 去掉末位就是组 ID”。

## 互斥、归一化与完成度

- 已选选项声明的 `mutexOptionIds` 汇总为互斥目标；命中的已选项被移除，渲染时对应选项不可选。
- 多选题只保留与最后选中选项具有相同 `optionGroup` 的选项。
- 输入题移除选项选择；单选题最多保留一项并清空输入；多选题清空输入。
- 归一化会移除当前题目不存在的选项，并重新计算分支和互斥。
- 输入题以 `input.trim()` 非空为完成，选择题以至少一项选择为完成。
- 单份问卷须至少有一个可见组，且所有可见组均完成；隐藏组不计入完成数量。
- 全部必填完成态仅检查 `required === true` 的问卷，是客户端预判；提交校验仍以后端为准。

## 存储边界

| 存储 | 当前键 | 内容与用途 |
| --- | --- | --- |
| sessionStorage | 旧 `questionnaireStructureV2` | 不再读取或写入；加载时移除旧键 |
| localStorage | `questionnaireDataLocalV2` | 用户答案草稿，用于恢复未提交填写状态 |
| 内存 | `questionnaires`、`drafts`、运行时计算值 | 当前页面加载后的定义、答案及显示状态 |

`loadQuestionnaireStructure(force = false)` 在当前应用成功加载后复用内存，合并进行中请求；刷新页面后重新请求后端，失败可手动重试；`force` 可跳过成功内存复用。
结构加载成功后用当前定义归一化答案；`toggleOption`、`setInput` 写入本地草稿。
退出登录会调用 `clearQuestionnaireV2LocalData()` 清除上述两个存储键及内存草稿。
结构内存与填写草稿用途不同，移除旧题库缓存不删除个人答案。首页名称与说明读取后端 title/introduction，按 key 的配图暂保留。

## Legacy 文件与维护入口

下列文件仍保留为历史代码，不能作为当前提交链路或正式题库的依据：

- [旧共享问卷](../../packages/shared/data/questionnaire.ts)
- [旧状态中心](../../packages/vote/src/questionnaire/lib/questionnaireData.ts)
- [旧 paperJson 兼容层](../../packages/vote/src/questionnaire/lib/questionnaireV2PaperJson.ts)

需要改问卷内容或规则定义时，先核对后端来源；前端继续负责现有契约的渲染、交互与答案状态。
结果应用的图表、文本详情与高级搜索已改用后端定义及 code 索引；旧表只保留其他历史/测试入口使用，不作为结果来源。
需求原文仍见[问卷大纲](../OUTLINE-Questionnaire.md)，旧迁移建议仅见归档。

## 未核验范围

- 线上具体题目、身份映射、统计数据及账号认证现状。
- 当前部署是否与本地源码一致，以及真实账号提交、回填结果。
- 特殊地图/性别图及趋势代理题保留既有 code 绑定；跨届题库定义未版本化。
