# Vote 前端快速上手

> 面向需要维护投票页的开发者，基于当前 `packages/vote` 代码整理。

当前工作与核验范围见[项目状态](../../PROJECT_STATUS.md)；本页保留投票应用的代码导航。

## 项目定位
- `packages/vote` 是主投票前端，负责登录后首页、问卷、角色/音乐/CP/提名投票，以及投票开始前和结束后的入口状态切换。
- 应用使用 Vue 3 + Vue Router + Apollo Client，路由基准是 `/v11/`。
- 样式体系不是 UnoCSS，而是 `vite-plugin-windicss` + `src/tailwindcss/global.postcss` 里的项目级语义类。
- 如果后续主要做前端迭代，这个包应当是优先阅读对象；`navigator` 和 `result` 更像外围站点与结果展示。

## 入口与路由
- 入口文件：`src/main/main.ts`
- 根渲染不是 `App.vue`，而是渲染 `AppRouterView.vue` 和全局消息组件 `GlobalMessages.vue`。
- 路由为手写静态配置，不是约定式路由：
  - `/`：`home/HomeEntry.vue`
  - `/user/settings`：用户设置
  - `/questionnaire`：问卷
  - `/vote/character`：角色投票
  - `/vote/music`：音乐投票
  - `/vote/couple`：CP 投票
  - `/doujin`：提名
  - `/test`：测试页

## 首页状态流转
- `home/HomeEntry.vue` 根据当前时间和登录状态在 4 个页面间切换：
  - `StartPage.vue`：投票未开始
  - `Home.vue`：未登录首页
  - `UserHome.vue`：已登录首页
  - `EndPage.vue` / `UserSettings.vue`：投票结束后的展示
- 也就是说，入口页改动通常不会只落在一个文件里：
  - 未登录入口文案和倒计时主要在 `home/Home.vue`
  - 已登录入口和主操作面板主要在 `home/UserHome.vue`
  - 总入口分流在 `home/HomeEntry.vue`
- 投票时间判断来自共享包 `@touhou-vote/shared/data/time`：
  - `start-page/lib/voteStart.ts`
  - `end-page/lib/voteEnded.ts`
- 路由守卫在 `src/main/main.ts` 中统一处理：
  - 未开始时只能进首页
  - 未登录时非首页会被拦回
  - 投票结束后大部分页面不可访问
  - 需要完成问卷的页面依赖 `isQuestionnaireAllDoneV2` 的本地草稿预判；规则和服务端闸门范围见[当前问卷指南](questionnaire-v2-notes.md#整体完成闸门维护)

## 数据层
- Apollo 初始化在 `src/graphql/index.ts`。
- GraphQL 请求地址固定为 `/v11-be/graphql`，本地开发依赖 Vite 代理。
- `useQuery` 被二次封装，默认会重置结果并主动 `restart()`，同时统一打印 Apollo 错误。
- 投票页读取“已提交投票数据”时，当前已经不再使用 `@vue/apollo-composable` 已弃用的 `useResult()`，而是直接用 `computed(() => result.value?.field ?? null)` 做结果映射。
- `typePolicies` 和 schema 生成文件位于 `src/graphql/__generated__`，代码生成配置是 `src/graphql/codegen.yml`。

## 目录结构
- `src/home`：首页、登录框、用户主页、用户设置。
- `src/questionnaire`：问卷和问卷修改侧栏。
- `src/vote-character`：角色搜索、筛选、卡片、本命角色、投票数据。
- `src/vote-music`：音乐投票，结构与角色部门相近。
- `src/vote-couple`：CP 投票，包含左右角色选择和 CP 卡片。
- `src/vote-doujin`：提名编辑与展示。
- `src/common`：通用组件、导出图片、消息、候选搜索、测试辅助工具。
- `src/tailwindcss`：全局样式入口和语义化 class，如 `baseBoxRoundedShadow`。
- `src/darkmode`：暗色模式初始化。

## 导出投票结果为图片
- 导出功能目前已经接入 `UserHome.vue` 的头像菜单，移动端和桌面端各自都挂了 3 个入口：
  - `ExportCharacterVoteImage.vue`
  - `ExportMusicVoteImage.vue`
  - `ExportCoupleVoteImage.vue`
- 这几个组件都放在 `src/common/components`，说明它们被视为跨部门的通用能力，而不是某个单一投票页私有逻辑。
- 当前实现链路基本一致：
  1. 打开 `VoteMessageBox` 预览弹层
  2. 通过 `exportVoteData.ts` 读取待导出的投票数据
  3. 数据源选择底层由 `voteDataSource.ts` 支持 `local` / `graphql` / `auto`
  4. 结合 `characterList` / `musicList` 等后端候选数据补全名称、图片、颜色
  5. 在离屏 DOM 中渲染卡片，再用 `html2canvas` 生成图片
  6. 支持预览、下载，以及在支持的浏览器中调用 Web Share API
- 当前 3 个导出组件不再保留隐藏的 GraphQL 调试开关，运行时统一遵循 `voteDataSource.ts` 的全局数据源模式；默认仍是 `auto`，也就是优先 GraphQL，失败时回退本地数据。
- 开发环境下图片 URL 会被替换到本地代理：
  - `asset.lilywhite.cc` -> `/th-assets`
  - `static.thwiki.cc` -> `/thwiki-assets`
- 这是为了让 `html2canvas` 在本地也能拿到跨域图片，不然导图很容易因为资源跨域失败。
- 这一点当前只在开发环境下成立；如果生产环境仍直接使用第三方图片源，而源站没有返回适用于 canvas 的 CORS 头，导图问题仍可能复现。
- 当前导出组件已经补上两类稳定性处理：
  - 预览图更新或弹层关闭时会释放旧的 `ObjectURL`
  - 分享按钮会基于 `navigator.share` 和 `navigator.canShare({ files })` 做真实能力判断
- 导出弹层底部的“保存图片 / 分享”操作区，现在要求 `previewImageUrl` 已经生成后才会显示，不再只依赖 `generating` 状态，避免出现“没有图但有操作按钮”的空状态。
- 当前导出组件在未强制勾选 GraphQL 时，会遵循 `voteDataSource.ts` 里的全局数据源模式；因此开发环境下可以直接在控制台用 `testHelper.setDataSourceMode('local')` 强制走本地测试数据。
- `voteDataSource.ts` 的 GraphQL 获取现在使用 Apollo Client 直接查询，而不是在通用工具函数里调用 `useLazyQuery`；这样点击导出按钮时不会再触发 “Apollo client with id default not found” 这类错误。
- 导出组件里重复的图片生成逻辑已经抽到两个共享模块：
  - `src/common/lib/useVoteImageExport.ts`：统一处理离屏渲染、图片等待、预览 URL 生命周期、下载和分享
  - `src/common/lib/exportAssetUrl.ts`：统一处理开发环境下的图片代理 URL 改写
- 现在三份 `Export*VoteImage.vue` 主要保留各自的数据映射、配色和卡片结构，后续继续改导图时应优先复用这两个共享模块。
- 三个导出入口现在都会在生成前检查投票数据是否为空；如果本地数据和 GraphQL 数据都为空，会直接提示“我没有数据，请你先提交投票”，并中断生成，不再继续导出空白图片。
- 卡片底部不再依赖第三方在线二维码服务，而是改成静态引导样式块，只保留 `touhou.vote` 的访问提示，避免生产环境继续受在线二维码服务可用性和跨域表现影响。

## 导出功能当前限制
- 角色头像、曲绘等远程图片在开发环境里会走本地代理，但生产环境仍需要确认正式图源是否满足 canvas 绘制所需的 CORS 条件。

## 导出功能后续开发建议
1. 如果要继续迭代导出能力，优先先统一三份 `Export*VoteImage.vue` 里重复的生成、等待图片、下载、分享和 URL 代理逻辑。
2. 在补 GraphQL 导出前，先决定 UI 是否真的要暴露“数据源模式”给用户，还是只保留开发态入口。
3. 生产环境上线前，要先确认二维码资源、角色图、曲绘图在 Canvas 场景下都满足跨域要求。

## 样式与构建
- 构建配置在 `vite.config.ts`：
  - alias：`@/` 指向 `src/`，`@@/` 指向包根目录
  - 构建产物目录：`v11/assets`
  - `build` 时会生成 `dist/stats.html` 包体积报告
- 使用的主要前端插件：
  - `vite-plugin-windicss`
  - `unplugin-vue-components`
  - `unplugin-icons`
  - `@rollup/plugin-yaml`
- 开发代理：
  - `/v11-be` -> `https://touhou.ai/vote-be`
  - `/th-assets` -> `https://asset.lilywhite.cc`
  - `/thwiki-assets` -> `https://static.thwiki.cc`
- 其中图片代理额外改写了 CORS 和缓存头，说明前端开发时有跨域图片访问需求。

## 本地运行
```bash
pnpm install
pnpm vote:codegen
pnpm vote:dev
```

常用命令：
```bash
pnpm vote:build
pnpm vote:serve
```

## 常见改动点
1. 改首页状态或入口文案，优先看 `src/home/HomeEntry.vue`、`src/home/Home.vue`、`src/start-page/StartPage.vue`、`src/end-page/EndPage.vue`。
2. 改投票开放时间，不在前端硬编码，优先检查 `@touhou-vote/shared/data/time`。
3. 改登录后路由限制或问卷前置逻辑，检查 `src/main/main.ts` 的路由守卫。
4. 改导出图片功能，优先看 `src/common/components/Export*VoteImage.vue`、`src/common/lib/exportVoteData.ts`、`src/common/lib/voteDataSource.ts`。
5. 改搜索、消息弹层等跨部门能力，优先看 `src/common`。
6. GraphQL schema 变更后，需要重新执行 `pnpm vote:codegen`。

## 调试提示
- 开发环境会自动加载：
  - `src/common/lib/testHelper`
  - `src/common/lib/testErrorHandling`
- 这意味着本地调试时会附带额外的测试辅助逻辑，排查行为差异时需要先确认是否只在 `import.meta.env.DEV` 下触发。
- `testHelper` 里已经有针对导出图片的快捷测试数据提示，调试导出功能时可以优先复用。
- 如果页面资源正常、接口却异常，先检查 `/v11-be` 代理和 Cookie `credentials: 'include'` 是否符合本地环境。

## 问卷阅读入口

当前问卷的定义来源、状态引擎、解析规则、`submitPaperV2`／`getPaperV2` 和存储边界统一见[当前问卷指南](questionnaire-v2-notes.md)。
页面、首页与守卫已接入 V2；旧迁移阶段及模型说明移入[历史归档](../../docs/archive/frontend/README.md)，不作为当前待办。

## 候选拼音搜索（2026-11-08，本地实现）

角色和音乐共用输入框已更名为 `CandidateSearchInput.vue`，CP 保留自己的输入框。角色、音乐和 CP 成员选择通过 `src/common/lib/useCandidateSearch.ts` 调用共享 `packages/shared/api/candidateSearch.ts`，不再执行前端 Pinin。请求路径为 `${API_PREFIX}/api/v1/autocomplete/search`，沿用现有前缀转发；明确传入 `voteYear`，分类为 character 或 music，CP 成员使用 character。

后端按候选名称、各别名和主作品／专辑名匹配，返回全部匹配的整数 candidate IDs；hook 转成 `Set<string>`，与已经加载的候选列表求交。前端继续排除个人已选项、保留 CP 重复成员规则、作品／类别筛选和日期排序。搜索不包含音乐其他收录专辑、结果页筛选或 CP 组合推荐。

输入沿用 100ms 节流并限制 64 字符。空输入直接显示原列表且不请求；非空新输入清空旧命中，显示“正在搜索…”，当前请求失败显示“搜索失败，请修改关键词重试”。Vue watch cleanup 忽略旧响应，不增加自动重试、客户端拼音回退或结果缓存。

Python 后端用 pypinyin 与项目内匹配器，Redis 分别缓存派生语料和结果 60 秒；复用候选／作品写入的失效逻辑。第二阶段只保留 `/autocomplete/search` 的候选 ID 契约，移除旧建议契约和临时候选路径；前后端须按同一阶段配套发布及回滚。无数据库迁移和新增配置。本地单元检查和构建不代表已部署或经过浏览器交互验收。


## CP 作品筛选数据来源（2026-11-08）

`src/vote-couple/lib/workList.ts` 的作品选项、分类选项及分类标签统一来自 `voteObjectsDataSource.characterFilterMeta`，由已有角色候选接口加载。这里使用角色专属元数据，音乐独有作品不会混入 CP 筛选；不再按作品名到 `shared/data/work.ts` 查分类，也不保留静态分类兜底。

元数据加载后默认选中全部实际分类，临时条件与已确认条件仍分开，沿用确定、取消和重置流程；按作品筛选成员与 CP 允许重复成员的规则保持现状。本项无新增请求、后端接口或存储机制；回滚只需还原对应前端改动。


验证：`./node_modules/.bin/tsx --tsconfig packages/vote/tsconfig.json --test packages/vote/src/vote-couple/lib/__tests__/workList.test.ts packages/vote/src/common/lib/__tests__/candidateSearch.test.ts packages/vote/src/common/lib/__tests__/useCandidateSearch.test.ts`，5 项通过；CP 筛选代码和用例 ESLint、`pnpm --filter @touhou-vote/vote build` 通过。新增用例先复现了新作品被归入 `others`，修改后验证后端分类、角色／音乐元数据隔离，以及临时条件、确认和重置。未进行浏览器交互验收。
