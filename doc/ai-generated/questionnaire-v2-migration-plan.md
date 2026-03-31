# Questionnaire V2 迁移计划

> 目标：在不一次性打爆现有问卷链路的前提下，把旧问卷实现逐步迁移到 `questionnaireV2`。

## 结论

可以迁，但不建议一次性“全站切换”。

当前更稳的策略是：

1. 保留旧问卷链路继续可用
2. 先把 `v2` 作为新问卷定义和解析基础
3. 新问卷页面优先接 `v2`
4. 提交阶段先通过兼容层转成旧 `paperJson`
5. 等页面层稳定后，再逐步替换首页完成态、路由守卫、登录恢复和本地缓存

这是一种“渐进迁移”，不是“大爆破重写”。

## 为什么这件事容易牵一发而动全身

旧问卷数据不是只被问卷页使用，它已经渗透到了以下几类场景：

- 问卷编辑页本体
- 问卷切题/总览侧栏
- 首页问卷完成状态展示
- 投票和提名入口的启用条件
- 路由守卫中的“是否允许进入投票页”
- 登录恢复时后端返回的 `papers_json`
- 本地缓存 `questionnaireDataLocal`
- 问卷提交时发给后端的 `paperJson`

所以如果直接把旧问卷状态中心删掉，影响的不是一个页面，而是整条“问卷 -> 首页入口 -> 路由 -> 提交 -> 恢复”链路。

## 旧问卷强耦合点

### 1. 问卷页面

- `packages/vote/src/questionnaire/Questionnaire.vue`

强耦合点：

- 直接依赖 `questionnaireData`
- 直接依赖 `questionnaireComputed`
- 直接依赖 `questionDone`
- 直接调用 `computeQuestionnaire()`
- 当前题目读取方式是 `questions[questionNum][0]`
- 提交时直接发送 `JSON.stringify(questionnaireData.value)`

这说明它完全建立在旧版“题库槽位 + 当前题 ID”模型之上。

### 2. 问卷切题面板

- `packages/vote/src/questionnaire/components/QuestionnaireChange.vue`

强耦合点：

- 基于 `questionDone[...] .answers` 渲染题号和完成数量
- 默认认为“一个可见问题 = 旧 answers 数组的一个位置”

### 3. 首页问卷入口

- `packages/vote/src/home/components/UserQuestionnaire.vue`
- `packages/vote/src/home/components/UserQuestionnaireDp.vue`

强耦合点：

- 直接遍历旧版 `questionnaire`
- 直接使用 `IsQuestionnaireDone`
- 直接使用 `IsQuestionnaireAllDone`

### 4. 首页总面板和投票入口

- `packages/vote/src/home/UserHome.vue`

强耦合点：

- 投票入口、提名入口是否可进入，取决于 `IsQuestionnaireAllDone`
- 桌面端 tab 切换时，问卷没完成会被强制打回

### 5. 路由守卫

- `packages/vote/src/main/main.ts`

强耦合点：

- `/vote/*` 和 `/doujin` 是否可访问，由 `IsQuestionnaireAllDone` 决定

### 6. 登录恢复 / 本地缓存 / 后端回填

- `packages/vote/src/home/lib/user.ts`

强耦合点：

- 登录成功后，后端返回的 `papers_json` 会直接写入 `questionnaireData.value`
- 旧本地缓存 key 为 `questionnaireDataLocal`
- 退出登录时会删除该 key

### 7. 旧问卷状态中心

- `packages/vote/src/questionnaire/lib/questionnaireData.ts`

强耦合点：

- 维护旧答案结构
- 维护旧版 `related` / `mutex` / 隐藏问题逻辑
- 维护 `IsQuestionnaireDone` / `IsQuestionnaireAllDone`

它不是普通工具文件，而是旧问卷的运行时核心。

## 哪些地方现在不用急着改

这些 `v2` 文件当前是新增基础设施，不影响旧页面：

- `packages/shared/data/questionnaireV2.ts`
- `packages/vote/src/questionnaire/lib/questionnaireV2Parser.ts`
- `packages/vote/src/questionnaire/lib/questionnaireV2PaperJson.ts`

所以当前最安全的方式不是“先删旧逻辑”，而是“先让新逻辑在旁边跑起来”。

## 推荐迁移方案

### 阶段 0：保持旧页面可用

目标：

- 不影响当前问卷主流程
- 不影响首页、路由、缓存、提交

这阶段只做两件事：

- 维护 `v2` 数据定义
- 维护 `v2` 解析器和兼容层

### 阶段 1：先做新问卷页面，不碰全站完成态

目标：

- 新问卷页面改为基于 `questionnaireV2 + questionnaireV2Parser`
- 但首页入口、路由守卫、登录恢复先保持旧逻辑

需要改的核心文件：

- `packages/vote/src/questionnaire/Questionnaire.vue`
- `packages/vote/src/questionnaire/components/QuestionnaireChange.vue`

策略：

- 页面内部不再依赖 `questionnaireData` / `questionnaireComputed`
- 页面内部只使用 `v2` 运行时结构
- 提交前通过 `questionnaireV2PaperJson.ts` 转成旧 `paperJson`

这样能先把问卷体验和结构迁到 `v2`，但不需要立刻重写首页与守卫。

### 阶段 2：补 `v2` 完成态和首页接入

目标：

- 用 `v2` 的可见问题组和完成状态来替换旧的 `IsQuestionnaireDone`
- 首页和问卷入口改为消费 `v2`

需要改的文件：

- `packages/vote/src/home/components/UserQuestionnaire.vue`
- `packages/vote/src/home/components/UserQuestionnaireDp.vue`
- `packages/vote/src/home/UserHome.vue`

需要补的能力：

- `v2` 版 `IsQuestionnaireDone`
- `v2` 版 `IsQuestionnaireAllDone`
- `v2` 版问卷列表 / 标题 / 完成统计

### 阶段 3：补缓存恢复和登录回填

目标：

- 让本地缓存和后端 `papers_json` 恢复逻辑支持 `v2`

需要改的文件：

- `packages/vote/src/home/lib/user.ts`

这里要决定一件事：

- 本地是否继续缓存旧版 `paperJson`
- 或者缓存 `v2` 自己的答案状态

更稳的做法通常是：

- 内部状态用 `v2`
- 提交和兼容时再序列化为旧 `paperJson`

### 阶段 4：最后替换路由守卫

目标：

- 用 `v2` 的整体完成态替换旧 `IsQuestionnaireAllDone`

需要改的文件：

- `packages/vote/src/main/main.ts`

之所以放最后，是因为这里一旦改错，会直接影响用户能不能进入投票页。

## 风险最高的地方

1. `Questionnaire.vue`

- 它既管显示，又管切题，又管本地状态，又管提交
- 一次改太多最容易出回归

2. `questionnaireData.ts`

- 它现在是旧逻辑核心
- 如果太早删掉，会把首页、守卫、完成态一起带崩

3. `user.ts`

- 它涉及登录恢复和后端数据回填
- 这是最容易出现“刷新后状态错乱”的地方

4. `main.ts`

- 这里的改动直接影响权限和页面可达性

## 建议的落地顺序

1. 保留旧逻辑，不删
2. 新问卷页面先接 `v2`
3. 提交先走 `v2 -> 旧 paperJson` 兼容层
4. 页面稳定后，再改首页完成态
5. 再改本地缓存与登录恢复
6. 最后改路由守卫
7. 确认无回归后，再考虑逐步下线旧状态中心

## 当前建议

如果你现在的目标是“让问卷逻辑更优雅，但不想立刻炸全站”，最合理的路径就是：

- 不要立刻迁全站
- 先把问卷页面本体迁到 `v2`
- 先依赖兼容层继续提交旧 `paperJson`
- 把首页、守卫、缓存这些高耦合环节留到第二阶段以后

这样能把风险切小，而不是一次性把整条链路一起推倒。
