# Result 前端快速上手

> 面向需要维护 `packages/result` 的开发者，基于当前代码整理。

## 项目定位
- `packages/result` 是投票结果前端，负责结果首页、角色/音乐/CP/提名/问卷相关页面，以及多种图表展示。
- 路由基准是 `/v11/`，和投票页一样挂在同一届目录下，但接口代理前缀单独使用 `/res-be`。
- 应用依赖 Apollo Client 访问 GraphQL，页面路由由 `src/router.ts` 显式定义，布局仍通过 `vite-plugin-vue-layouts` 组装。

## 架构概览
- 入口：`src/main.ts`
- 路由：`src/router.ts`
- 布局：`vite-plugin-vue-layouts`
- 样式：UnoCSS + `src/styles/global.postcss`
- 加载反馈：`nprogress`

## 入口与初始化
- `src/main.ts` 会：
  - 创建 Apollo Client
  - 通过 `provideClient` 注入到应用
  - 挂载 `src/router.ts` 中创建的 router
- `src/router.ts` 会：
  - 显式注册 `src/pages` 下的页面组件
  - 手动补齐原先 `<route lang="yaml">` 提供的 `meta.navid`
  - 继续通过 `setupLayouts(routes)` 让首页使用 `blank` 布局
- `App.vue` 只负责渲染路由出口。

## GraphQL 与数据层
- Apollo 初始化在 `src/composables/graphql/index.ts`。
- GraphQL 地址固定为 `/res-be/graphql`，本地开发由 Vite 代理到 `https://touhou.ai/vote-be`。
- `useQuery` 做了统一封装：
  - 创建后主动清空旧结果
  - 强制 `restart()`
  - Apollo 出错时统一 `logErrorMessages`
- schema、fragment introspection、type policies 都在 `src/composables/graphql/__generated__`。
- 代码生成命令是 `pnpm result:codegen`，配置文件为 `src/composables/graphql/codegen.yml`。

## 路由与页面组织
- 页面文件位于 `src/pages`，但实际路由路径和 meta 由 `src/router.ts` 显式维护。
- 首页 `/` 仍使用 `blank` 布局，其余页面走默认布局。
- 主要页面分组如下：
  - 角色：`character.vue`、`characterDetail.vue`、`characterCompare.vue`、`characterEvolution.vue`、`characterSingleDetail.vue`、`CharacterReason.vue`
  - 音乐：`Music.vue`、`MusicDetail.vue`、`MusicCompare.vue`、`MusicEvolution.vue`、`MusicSingleDetail.vue`、`MusicReason.vue`
  - CP：`Couple.vue`、`CoupleDetail.vue`、`CoupleSingleDetail.vue`、`CoupleReason.vue`
  - 提名/问卷：`Doujin.vue`、`QuestionnaireDetail.vue`、`QuestionnaireInputDetail.vue`
- `characterConnect.vue` 和 `MusicConnect.vue` 目前仍是很薄的占位页，文档上不要把它们写成已完备模块。

## 关键组件与职责
- `src/components/Nav.vue`：结果页主要导航
- `src/components/NavTop.vue`：移动端顶部导航
- `src/components/AdvancedSearch.vue`：高级搜索和约束输入
- `src/components/VoteSelect.vue`：通用选择器
- 图表组件：
  - `GraphPie.vue`
  - `GraphRadar.vue`
  - `GraphSunburst.vue`
  - `GraphEvolution.vue`
  - `GraphMap.vue`
  - `Graph1.vue`（更偏实验/示例性质）

## 样式与构建
- `unocss.config.ts` 定义了项目主题色：
  - `accent`
  - `subaccent`
  - `textaccent`
- 还额外定义了 `3xl` 断点和 `around` 阴影。
- `vite.config.ts` 的几个关键点：
  - alias：`@/` -> `src/`
  - `@vitejs/plugin-vue` 使用默认配置，不再开启 `reactivityTransform`
  - `autoImport` 只注入 `vue`、`vue-router`、`@vueuse/core` 和共享的 `setSiteTitle`
  - 组件自动注册仅扫描 `src/components`
  - `directoryAsNamespace: true`
  - `build.assetsDir = 'v11/assets'`
  - `build.sourcemap = true`

## 本地运行
```bash
pnpm install
pnpm result:dev
```

常用命令：
```bash
pnpm result:build
pnpm result:serve
pnpm result:codegen
```

## 常见改动点
1. 新增结果页路由时，先在 `src/pages` 新建页面，再同步把路径和 `meta` 加到 `src/router.ts`。
2. 指向 `/nav` 这类跨应用入口时，不要用 `router-link`，应使用普通 `href`，避免被结果页自己的 `/v11/` history 基准错误拼接。
3. 改首页入口、部门卡片或说明文案，优先看 `src/pages/index.vue`。
4. 改导航结构时，通常同时涉及 `src/components/Nav.vue`、`src/components/NavTop.vue` 和 `src/layouts/default.vue`。
5. 改图表表现，优先在 `src/components` 找现有组件复用，再决定是否新增。
6. GraphQL schema 或缓存策略变化后，记得同时更新 codegen 产物和 `typePolicies.ts`。

## 调试提示
- 如果 GraphQL 数据异常，先检查 `/res-be` 代理是否可用，再看 Apollo 封装是否把旧结果清空导致页面瞬时空态。
- `optimizeDeps` 对 Apollo 做了 include/exclude 配置，升级依赖后如果 dev 启动异常，需要优先检查这里。
- 构建开启了 sourcemap，适合线上问题回溯。


## 结果趋势时间范围（2026-10-22）

- 六处趋势页（角色/音乐演进、角色/音乐/CP 单条详情、问卷详情）在原 GraphQL 查询中同时请求 `queryResultTimeline(voteYear)`。
- `src/lib/Graph.ts` 的 `useResultTimeline()` 为每个页面维护时间范围、日期说明和曲线转换方法。横轴采用本次计票的 `voteStart` 至 `statisticsEnd`，第 0 桶从投票开始时间标记，末尾不足一小时仍显示。
- 时间文案统一用北京时间，包含配置的投票起止时间、统计截止和结果生成时间。不再读取 `shared/data/time.ts` 的旧日期，不依赖浏览器当前时刻，不按筛选对象最后一票裁剪横轴。
- 多曲线使用同一范围，空小时补零、累计值延续、负增量保留。重新收到查询结果时替换旧曲线，不追加重复系列。
- 旧结果时间信息为 null 时保留榜单、显示“暂无趋势时间信息”；范围内无票时显示“暂无投票数据”。后端继续在人工反作弊完成后人工计票，前端不会请求重算。
- 先发布支持新字段的后端，再生成类型并发布前端。现有结果需在业务安排允许时重新计票，才会生成时间元信息；不自动重算线上结果。
- 单元验证：`pnpm exec tsx --test packages/result/src/lib/__tests__/Graph.test.ts`；构建：`pnpm result:build`。


## 部门有效票与问卷填写情况（2026-10-22）

- 排名 `global.totalVotes` 现在是部门有效提交数，一张票的多个票位不累加成多张部门票；候选票数、本命及平均/中位得票保持原有口径。
- `queryCompletionRates.items[].name` 为真实问卷 key。`Questionnaire.vue` 从既有 `/res-be/api/v1/questionnaire/structure` 读取 key→title，并保留旧静态问卷编号和原始名称回退。
- 完成数量按最新答案批次及真实可见题组判定，选填问卷也统计；筛选后 numComplete/total/rate 以筛选人群计算。
- GraphPie 保持原图表形式；有 rate 的问卷项显示后端完成率，其他饼图继续显示扇区占比。各问卷可以由同一个人完成，独立完成率不能使用所有扇区完成数之和作分母。
- 后端/前端适配发布后，安排反作弊完成后的人工计票，才会刷新旧缓存口径。不自动重算真实结果。


## 详情页人群筛选（2026-10-22）

- 三个本届榜单通过 `encodeAdditionalConstraint()` 将当前有效的图形/指令模式投票者条件放入原有压缩 URL q 参数。`getAdditionalConstraintString()` 同时兼容旧图形约束对象与新原始 DSL 对象。
- 单角色、音乐、组合详情通过 `withTargetConstraint()` 生成 `(原条件) AND 目标`，问卷组件不再丢失原筛选；OR 条件有括号保护，目标名称通过 JSON.stringify 转义。
- 组合详情发送 `cp=("A","B"[,"C"])`，后端按组合票完整无序匹配，保留 A×A 的重复成员。两人组合不会匹配含同两人的三人组合，角色部门共投两个角色也不算投过该组合。
- 后端先发布 cp 查询支持，再发布前端；不新增接口、存储、配置或依赖，不改变人工计票与既有高级搜索按需计算流程。
- 相关单元检查：`pnpm exec tsx --test packages/result/src/lib/__tests__/detailConstraint.test.ts`。
