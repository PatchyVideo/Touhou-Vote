# Result 前端快速上手

> 面向需要维护 `packages/result` 的开发者，基于当前代码整理。

## 项目定位
- `packages/result` 是投票结果前端，负责结果首页、角色/音乐/CP/提名/问卷相关页面，以及多种图表展示。
- 路由基准是 `/v11/`，和投票页一样挂在同一届目录下，但接口代理前缀单独使用 `/res-be`。
- 应用依赖 Apollo Client 访问 GraphQL，页面路由和布局都走自动生成。

## 架构概览
- 入口：`src/main.ts`
- 路由：`vite-plugin-pages`
- 布局：`vite-plugin-vue-layouts`
- 样式：UnoCSS + `src/styles/global.postcss`
- 加载反馈：`nprogress`

## 入口与初始化
- `src/main.ts` 会：
  - 创建 Apollo Client
  - 通过 `provideClient` 注入到应用
  - 使用 `setupLayouts(generatedRoutes)` 组装路由
  - 创建 `createWebHistory('/v11/')`
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
- 页面文件位于 `src/pages`，文件名直接决定路由。
- 首页 `src/pages/index.vue` 使用 `<route lang="yaml">` 指定 `layout: blank`。
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
  - `autoImport` 包含 `vue/macros`
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
1. 新增结果页路由时，直接在 `src/pages` 新建 `.vue` 文件；如果需要不同布局，用 `<route lang="yaml">` 标记 `layout`。
2. 改首页入口、部门卡片或说明文案，优先看 `src/pages/index.vue`。
3. 改导航结构时，通常同时涉及 `src/components/Nav.vue`、`src/components/NavTop.vue` 和 `src/layouts/default.vue`。
4. 改图表表现，优先在 `src/components` 找现有组件复用，再决定是否新增。
5. GraphQL schema 或缓存策略变化后，记得同时更新 codegen 产物和 `typePolicies.ts`。

## 调试提示
- 如果 GraphQL 数据异常，先检查 `/res-be` 代理是否可用，再看 Apollo 封装是否把旧结果清空导致页面瞬时空态。
- `optimizeDeps` 对 Apollo 做了 include/exclude 配置，升级依赖后如果 dev 启动异常，需要优先检查这里。
- 构建开启了 sourcemap，适合线上问题回溯。
