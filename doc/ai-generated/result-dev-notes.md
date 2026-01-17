# Result 前端快速上手

> 面向熟悉 Vue/Vite 的开发者，帮助快速理解 `packages/result` 的结构与常用改动点。

## 项目概览
- 入口：`src/main.ts` 创建 Vue 3 应用，挂载 `App.vue`，启用 `vite-plugin-pages` + `vite-plugin-vue-layouts` 自动路由与布局；路由基准路径为 `/v11/`（部署需匹配）。
- 数据层：在入口处创建 Apollo 客户端（`createApollo` / `provideClient` 由自动导入），与 GraphQL 服务交互；本地 dev 通过 `/res-be` 代理到 `https://touhou.ai/vote-be`。
- UI 框架：UnoCSS 原子化（自定义 `accent` 调色板），全局样式在 `src/styles/global.postcss`；顶部加载条使用 `nprogress`。
- 页面布局：`layouts/default.vue` 统一头部导航与页脚，`layouts/blank.vue` 用于全屏/自定义页面。

## 主要依赖
- 运行时：Vue 3、Vue Router 4、@apollo/client、@vue/apollo-composable、@vueuse/core、date-fns、d3、echarts、nprogress。
- 构建：Vite、vite-plugin-pages、vite-plugin-vue-layouts、unplugin-auto-import、unplugin-vue-components、UnoCSS。
- 代码生成：GraphQL Codegen（脚本 `pnpm --filter @touhou-vote/result codegen`）。

## 目录速览（关键文件）
- `src/main.ts`：注册 Apollo 客户端、自动布局路由、历史模式 `/v11/`、挂载全局样式和 `nprogress`。
- `src/App.vue`：仅渲染 `<router-view />`。
- 布局：
  - `src/layouts/default.vue`：包含 `Nav`、内容容器、页脚链接。
  - `src/layouts/blank.vue`：极简布局，仅渲染子路由。
- 主页与兜底：
  - `src/pages/index.vue`：封面 + 部门入口导航（使用 `screenSizes` 响应式判断，`resultTypeMeta` 配置五个入口）。
  - `src/pages/[...all].vue`：简易 404。
- 样式/主题：
  - `src/styles/global.postcss`：链接样式、滚动条、字体 `.quicksand`，背景渐变工具类。
  - `unocss.config.ts`：`presetUno` + `presetIcons`，`transformerVariantGroup` / `transformerDirectives`，自定义 `accent` 调色板与 `boxShadow`。
- 配置：
  - `vite.config.ts`：别名 `@/` → `src/`，自动导入（含 Vue macros）、组件按目录命名空间、代理 `/res-be`，构建产物 `assetsDir: 'v11/assets'`、`sourcemap: true`。
  - `package.json`：脚本 `dev` / `build` / `serve` / `codegen`。
- GraphQL：`src/composables/graphql/` 下的 `codegen.yml`、`typePolicies.ts`、生成文件 `__generated__` 以及 `result-codegen` workspace 依赖。

## 页面与组件索引（Vue 文件总览）
- 布局/入口：应用壳 [packages/result/src/App.vue](packages/result/src/App.vue)；路由与 Apollo 初始化 [packages/result/src/main.ts](packages/result/src/main.ts#L1-L37)；布局 [packages/result/src/layouts/default.vue](packages/result/src/layouts/default.vue#L1-L14) 与 [packages/result/src/layouts/blank.vue](packages/result/src/layouts/blank.vue#L1-L3)。
- 导航与交互：主导航栏 [packages/result/src/components/Nav.vue](packages/result/src/components/Nav.vue#L1-L150)，移动抽屉 [packages/result/src/components/NavTop.vue](packages/result/src/components/NavTop.vue#L1-L74)，高级筛选 [packages/result/src/components/AdvancedSearch.vue](packages/result/src/components/AdvancedSearch.vue#L1-L400)（GUI/指令双模式，角色/音乐/CP/问卷约束），下拉选择 [packages/result/src/components/VoteSelect.vue](packages/result/src/components/VoteSelect.vue#L1-L88)。
- 图表组件：折线 [packages/result/src/components/GraphEvolution.vue](packages/result/src/components/GraphEvolution.vue#L1-L76)、地图 [packages/result/src/components/GraphMap.vue](packages/result/src/components/GraphMap.vue#L1-L95)、饼/柱切换 [packages/result/src/components/GraphPie.vue](packages/result/src/components/GraphPie.vue#L1-L93)、雷达/柱切换 [packages/result/src/components/GraphRadar.vue](packages/result/src/components/GraphRadar.vue#L1-L116)、环+外圈饼/柱切换 [packages/result/src/components/GraphSunburst.vue](packages/result/src/components/GraphSunburst.vue#L1-L103)、D3 线图示例 [packages/result/src/components/Graph1.vue](packages/result/src/components/Graph1.vue#L1-L162)。
- 首页与兜底：封面导航 [packages/result/src/pages/index.vue](packages/result/src/pages/index.vue#L1-L86)，404 占位 [packages/result/src/pages/[...all].vue](packages/result/src/pages/%5B...all%5D.vue#L1-L3)。
- 角色部门：目录 [packages/result/src/pages/character.vue](packages/result/src/pages/character.vue#L1-L88)，本届榜单 [packages/result/src/pages/characterDetail.vue](packages/result/src/pages/characterDetail.vue#L1-L240)，往届对比 [packages/result/src/pages/characterCompare.vue](packages/result/src/pages/characterCompare.vue#L1-L260)，演进对比 [packages/result/src/pages/characterEvolution.vue](packages/result/src/pages/characterEvolution.vue#L1-L195)，单角色详情 [packages/result/src/pages/characterSingleDetail.vue](packages/result/src/pages/characterSingleDetail.vue#L1-L170)，单角色理由 [packages/result/src/pages/CharacterReason.vue](packages/result/src/pages/CharacterReason.vue#L1-L130)，同投占位 [packages/result/src/pages/characterConnect.vue](packages/result/src/pages/characterConnect.vue#L1-L9)。
- 音乐部门：目录 [packages/result/src/pages/Music.vue](packages/result/src/pages/Music.vue#L1-L88)，本届榜单 [packages/result/src/pages/MusicDetail.vue](packages/result/src/pages/MusicDetail.vue#L1-L240)，往届对比 [packages/result/src/pages/MusicCompare.vue](packages/result/src/pages/MusicCompare.vue#L1-L250)，演进对比 [packages/result/src/pages/MusicEvolution.vue](packages/result/src/pages/MusicEvolution.vue#L1-L195)，单曲详情 [packages/result/src/pages/MusicSingleDetail.vue](packages/result/src/pages/MusicSingleDetail.vue#L1-L170)，单曲理由 [packages/result/src/pages/MusicReason.vue](packages/result/src/pages/MusicReason.vue#L1-L120)，同投占位 [packages/result/src/pages/MusicConnect.vue](packages/result/src/pages/MusicConnect.vue#L1-L9)。
- CP 部门：目录 [packages/result/src/pages/Couple.vue](packages/result/src/pages/Couple.vue#L1-L88)，榜单 [packages/result/src/pages/CoupleDetail.vue](packages/result/src/pages/CoupleDetail.vue#L1-L240)，单 CP 详情 [packages/result/src/pages/CoupleSingleDetail.vue](packages/result/src/pages/CoupleSingleDetail.vue#L1-L200)，单 CP 理由 [packages/result/src/pages/CoupleReason.vue](packages/result/src/pages/CoupleReason.vue#L1-L160)。
- 提名与问卷：作品提名静态页 [packages/result/src/pages/Doujin.vue](packages/result/src/pages/Doujin.vue#L1-L200)；问卷总览 [packages/result/src/pages/QuestionnaireDetail.vue](packages/result/src/pages/QuestionnaireDetail.vue#L1-L160)；问卷回答列表 [packages/result/src/pages/QuestionnaireInputDetail.vue](packages/result/src/pages/QuestionnaireInputDetail.vue#L1-L110)。

## 本地运行
```bash
pnpm install
# 开发
pnpm --filter @touhou-vote/result dev
# 预览构建
pnpm --filter @touhou-vote/result build && pnpm --filter @touhou-vote/result serve
# 重新生成 GraphQL 类型
pnpm --filter @touhou-vote/result codegen
```
- 开发时的 API 走 `/res-be` 代理；生产部署需确认反向代理/环境变量与 `/v11/` 路由基准一致。

## 常见改动提示
1) **新增页面/路由**：在 `src/pages` 下新增文件即可自动注册，若需布局在 `<route lang="yaml">` 中设置 `layout`（示例见主页）。
2) **导航/页脚**：修改 `src/components/Nav.vue`、`src/components/NavTop.vue`（按需）以及 `layouts/default.vue` 中的页脚链接。
3) **主题/样式**：调整 `unocss.config.ts` 的 `theme.colors` 或在 `global.postcss` 添加通用样式；优先使用 UnoCSS 原子类。
4) **数据可视化**：图表组件集中在 `src/components`（D3/ECharts）；公共格式化方法在 `src/lib`（如 `graphBar.ts`、`numberFormat.ts`）。
5) **GraphQL 类型/策略**：更新 schema 后运行 `codegen`；若缓存策略变动，同步修改 `src/composables/graphql/typePolicies.ts`。

## 调试/排错
- 构建产物已开启 `sourcemap`，便于定位线上问题。
- 若自动导入类型缺失，可删除并让 Vite 重新生成 `auto-imports.d.ts`、`components.d.ts`。
- Apollo 相关错误可检查 `optimizeDeps` 的 include/exclude 配置与代理 `/res-be`。

## 快速起手清单
- [ ] 跑通 `pnpm --filter @touhou-vote/result dev`，确认 `/v11/` 路由可刷新
- [ ] 验证 `/res-be` 代理联通后端；必要时调整代理目标
- [ ] 如需新图表/页面，在 `src/pages` 与 `src/components` 扩展并复用 `lib` 工具
- [ ] 更新 GraphQL schema 后运行 `pnpm --filter @touhou-vote/result codegen`
- [ ] 检查主题色是否满足设计，必要时调整 `unocss.config.ts`
