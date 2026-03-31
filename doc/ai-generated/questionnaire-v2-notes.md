# Questionnaire V2 说明

> 用于说明新版问卷模型 `questionnaireV2` 与旧版问卷实现的核心差异。

## 结论

- 旧版问卷更接近“题库槽位”模型。
- `v2` 更接近需求文档里的“问题组 -> 组内问题”模型。
- `v2` 的目标是让问卷定义和前端解析逻辑更清晰，不再被旧提交格式反向绑定。

## 旧版逻辑

旧版相关文件：

- `packages/shared/data/questionnaire.ts`
- `packages/vote/src/questionnaire/lib/questionnaireData.ts`

旧版的核心特点：

- 一个问卷的数据主体是 `questions: Question[][]`
- 每个二维数组项更像一个“题库”或“候选问题集合”
- 前端运行时再根据用户答案，决定当前这个题库应该显示哪一道题
- 问题组是否显示、当前显示哪道题，很多时候编码在答案里的 `id` 中
- 尾号为 `0` 的问题 ID 常被当作“隐藏 / 无效 / 占位问题”

旧版提交给后端时，直接提交前端运行时状态：

- 每个问卷下是 `answers`
- 每条答案里有：
  - `id`
  - `options`
  - `input`

这意味着旧版的提交格式同时混合了：

- 题目答案
- 当前题库显示的是哪一道题
- 某些隐藏状态的占位表达

## V2 逻辑

`v2` 相关文件：

- `packages/shared/data/questionnaireV2.ts`
- `packages/vote/src/questionnaire/lib/questionnaireV2Parser.ts`

`v2` 的核心特点：

- 一个问卷的数据主体是 `questionGroups`
- 每个问题组都显式包含：
  - `id`
  - `order`
  - `initialQuestionId`
  - `questions`
- 组内有多个问题时，当前显示哪一个问题由解析器决定
- “问题组是否默认隐藏”不再靠旧版题库槽位推导，而是由 `initialQuestionId` 的规则直接表达

`v2` 当前遵循的 PRD 规则：

- 单个问卷由多个问题组组成
- 用户从第一个问题组的第一个问题开始作答
- 第一个问题组必定仅有一个问题
- 若 `related` 指向某问题组第 `0` 个问题，则该问题组隐藏
- 若 `related` 指向某问题组第非 `0` 个问题，则展示对应问题
- 若问题组初始问题非第 `0` 个问题，则默认展示第 `1` 个问题

## V2 数据结构

`v2` 目前拆成两层：

- 问卷定义
- 问卷答案草稿 / 运行时状态

### 1. 问卷定义

问卷定义在 `packages/shared/data/questionnaireV2.ts`。

核心结构：

- `QuestionnaireDefinitionV2`
  - `id`
  - `name`
  - `introduction`
  - `questionGroups`
- `QuestionnaireGroupV2`
  - `id`
  - `order`
  - `initialQuestionId`
  - `questions`
- `QuestionnaireQuestionV2`
  - `id`
  - `type`
  - `content`
  - `introduction`
  - `options`
- `QuestionnaireOptionV2`
  - `id`
  - `content`
  - `relatedQuestionIds`
  - `mutexOptionIds`
  - `optionGroup`

### 2. 答案草稿

答案草稿也在 `packages/shared/data/questionnaireV2.ts` 定义。

每个问题组的答案状态是：

- `groupId`
- `activeQuestionId`
- `selectedOptionIds`
- `input`

这意味着 `v2` 里“题目定义”和“当前组内正在展示哪道题”是分开的。

## 当前完整暴露逻辑

当前 `v2` 的解析逻辑在：

- `packages/vote/src/questionnaire/lib/questionnaireV2Parser.ts`

它会把“问卷定义 + 当前答案草稿”解析成页面可直接消费的运行时结构。

### 1. 第一个问题组

规则：

- 第一个问题组必须存在
- 第一个问题组必须只包含一个问题
- 用户总是从这个问题开始作答

这是硬约束，不满足时解析器会直接报错，而不是尝试兜底。

### 2. 问题组默认显示 / 默认隐藏

每个问题组都有 `initialQuestionId`。

当前规则：

- 若 `initialQuestionId` 末位为 `0`
  - 该问题组默认隐藏
  - 在没有 `related` 触发前不会显示
- 若 `initialQuestionId` 末位不为 `0`
  - 该问题组默认可见
  - 但实际显示的是该组内“第 `1` 个问题”

也就是说：

- `initialQuestionId` 的作用主要是表达“这个组默认隐藏还是默认显示”
- 默认显示时，不是显示 `initialQuestionId` 本身，而是显示组内顺序为 `1` 的问题

### 3. `related` 如何控制后续问题组

`related` 现在定义在选项上，即：

- `option.relatedQuestionIds`

解析器会扫描当前所有已显示问题组中已被选中的选项，把它们的 `relatedQuestionIds` 收集起来，再决定后续问题组当前显示哪道题。

规则如下：

- 若某个选项的 `related` 指向目标问题组的第 `0` 个问题
  - 目标问题组隐藏
- 若某个选项的 `related` 指向目标问题组的第非 `0` 个问题
  - 目标问题组显示该问题
- 若一个问题组没有被任何 `related` 命中
  - 若该组默认隐藏，则继续隐藏
  - 若该组默认显示，则展示该组第 `1` 个问题

### 4. 多个 `related` 同时命中同一问题组

当前实现里，如果多个已选选项同时把 `related` 指向同一个问题组：

- 会先过滤掉所有指向第 `0` 个问题的目标
- 在剩余“可显示问题”中决定当前组显示哪一道题

当前选题规则是：

- 如果当前 `activeQuestionId` 仍然在新的命中列表里，则保留当前题
- 否则取命中的第一道非 `0` 问题

这是一条当前实现规则，后续如果 PRD 细化，也可以继续调整。

### 5. 分支切换后的处理

如果一个问题组原来显示的是问题 A，后来因为 `related` 变化改成了问题 B，当前实现会：

- 把 `activeQuestionId` 切到新问题
- 清空这个问题组原有的：
  - `selectedOptionIds`
  - `input`

也就是说，当前实现采用的是“切分支就清空旧答案”的保守策略。

### 6. 问题组隐藏后的处理

如果某个问题组因为新的 `related` 结果需要隐藏：

- `activeQuestionId` 会变成 `null`
- 该组答案会被清空
- 页面层不会把它视为可见问题组

### 7. `mutex` 的作用方式

`mutex` 现在定义在选项上，即：

- `option.mutexOptionIds`

语义是：

- 当某个选项被选中时，它声明的 `mutexOptionIds` 对应选项将不可再选

当前实现方式：

- 解析器先扫描所有已选中的选项
- 把它们声明的 `mutexOptionIds` 汇总成一个全局集合
- 然后对所有当前可见题目执行两件事：
  - 如果某个已选选项出现在 `mutex` 目标集合中，则自动取消勾选
  - 运行时渲染该选项时，`available` 会变成 `false`

所以 `mutex` 既影响：

- 已经选上的答案
- 也影响页面上还能不能继续选

### 8. 多选题里的 `group` 互斥

`group` 在 `v2` 里叫 `optionGroup`。

当前规则只对多选题生效：

- 用户可以选多个选项
- 但最终只能保留和“最后一次选择的选项”属于同一个 `optionGroup` 的那些选项

也就是说：

- 如果先选了 A 组，再选了 B 组
- 那么 A 组已选项会被清掉
- 最终只保留 B 组的选择

这是当前实现里“组选项互斥”的具体方式。

### 9. 不同题型的答案规范化

解析器每轮都会对当前题目的答案做规范化：

- `Input`
  - 不允许保留 `selectedOptionIds`
- `Single`
  - 只允许保留一个选项
  - `input` 会被清空
- `Multiple`
  - `input` 会被清空
  - 已选项会再按 `optionGroup` 规则清洗

### 10. 问题完成判定

当前单题完成规则：

- `Input`
  - `input.trim()` 非空
- `Single`
  - `selectedOptionIds.length > 0`
- `Multiple`
  - `selectedOptionIds.length > 0`

### 11. 问卷完成判定

当前 `v2` 运行时会产出：

- `visibleGroups`
- `questionCount`
- `answeredCount`
- `done`

问卷完成条件是：

- 至少存在一个可见问题组
- 并且所有可见问题组都已完成

也就是说，隐藏的问题组不计入当前问卷完成度。

## 一个简化示例

假设有 3 个问题组：

- 问题组 1：固定显示问题 `11011`
- 问题组 2：`initialQuestionId = 11020`
- 问题组 3：`initialQuestionId = 11031`

那么初始状态下：

- 问题组 1 可见，显示 `11011`
- 问题组 2 隐藏，因为初始题是第 `0` 题
- 问题组 3 可见，显示第 `1` 题 `11031`

如果问题组 1 中某个选项的 `related = [11022]`：

- 问题组 2 会变为可见
- 且显示 `11022`

如果后来改选另一个选项，`related = [11020]`：

- 问题组 2 会重新隐藏
- 问题组 2 原先填写的答案会被清空

## 当前实现边界

- `v2` 现在已经把问卷的显示逻辑、选项互斥逻辑和完成判定逻辑显式化了
- 但它目前还没有接到现有问卷页面上
- 它也还没有接到旧后端的 `paperJson` 提交格式上
- 所以后续真正落地时，还需要补：
  - 新页面接入
  - `v2 -> 旧提交格式` 适配层，或后端同步升级

## 核心差异

### 1. 建模方式不同

旧版：

- `题库槽位 -> 当前问题`

`v2`：

- `问题组 -> 组内问题 -> 当前激活问题`

### 2. 状态表达方式不同

旧版：

- 用答案里的 `id` 和 `xxxxx0` 这类占位问题表达隐藏和分支状态

`v2`：

- 用 `groupId` 和 `activeQuestionId` 显式表达当前组状态

### 3. 与需求文档的贴合度不同

旧版：

- 是历史实现驱动出来的可运行结构

`v2`：

- 直接按 PRD 的“问题组”概念设计

### 4. 与后端提交格式的关系不同

旧版：

- 前端状态几乎直接就是后端提交格式

`v2`：

- 先保证前端模型正确
- 后续如需兼容旧后端，应增加一层 `v2 -> paperJson` 转换

## 为什么 V2 更适合后续开发

- 更容易让新协作者理解
- 更适合你们后续“小步问题组”的设计
- 更容易扩展 `related` / `mutex` / 多选 `group` 规则
- 更容易在页面层实现“当前可见问题组”“当前题目”“分支切换”等行为
- 避免继续把旧版的隐式占位逻辑带入新问卷

## 当前状态

- 当前生产环境仍运行旧版问卷逻辑
- `v2` 目前是并行开发中的新问卷定义和解析基础
- `v2` 还没有接入现有问卷页面和默认提交流程
- 如果后续要上线 `v2` 页面，需要补一层提交适配，或者让后端直接接受 `v2` 格式
- 但这件事目前仍是待确认项，不应默认假设后端一定会同步改格式
- 当前已经补了一层过渡用兼容代码：
  - `packages/vote/src/questionnaire/lib/questionnaireV2PaperJson.ts`
- 这层兼容代码会把 `v2` 的答案状态序列化成旧版 `paperJson` 结构，便于在后端未升级时继续对接旧接口。
- 但它只是过渡方案，依赖一个前提：
  - `v2` 仍然沿用当前问卷 ID 的分组规则，即“问题组 ID = 题目 ID 去掉最后一位”
- 如果未来 `v2` 的正式问卷不再保持这个 ID 约定，那么这层兼容序列化也需要一起调整，而不能继续默认可用。
