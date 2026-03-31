# Vote 前端快速上手

> 面向需要维护投票页的开发者，基于当前 `packages/vote` 代码整理。

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
  - 需要完成问卷的页面依赖 `IsQuestionnaireAllDone`

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
- `src/common`：通用组件、导出图片、消息、搜索、拼音匹配、测试辅助工具。
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
  4. 结合 `characterList` / `musicList` 等静态元数据补全名称、图片、颜色
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

## 问卷结构现状
- 现有问卷页面仍在使用旧的“题库/候选问题数组”模型：
  - 共享题库：`packages/shared/data/questionnaire.ts`
  - 前端运行时状态：`packages/vote/src/questionnaire/lib/questionnaireData.ts`
- 这套旧模型通过 `questions: Question[][]`、`answers[i].id` 和尾号为 `0` 的占位 ID 表示“当前问题组默认隐藏 / 当前显示哪个候选问题”，实现是可运行的，但和 PRD 里更显式的“问题组 -> 组内问题 -> 渐进暴露”模型不完全一致。
- 现在已经补了一套更适合后续重构的新版格式：
  - `packages/shared/data/questionnaireV2.ts`
- `questionnaireV2.ts` 现在不再尝试从旧版问卷数据推导，而是作为新版问卷的独立 source of truth，先提供可替换的占位问题组结构：
  - `questionGroups`
  - `initialQuestionId`
  - `questions`
- 其中 `initialQuestionId` 明确对应 PRD 里的“初始问题”：
  - 末位为 `0`：该问题组默认隐藏
  - 末位非 `0`：该问题组默认展示第 `1` 个问题
  - 第一个问题组必须只有一个问题，并从这个问题开始作答
- 同文件还提供了 `createQuestionnaireAnswerStateV2()`，用于初始化新版答案草稿结构；后续合作者应直接在这份文件里维护正式问卷，而不是继续修改旧版 `questionnaire.ts` 或尝试从旧版结构自动推导。
- 对应的新版解析器已经补在：
  - `packages/vote/src/questionnaire/lib/questionnaireV2Parser.ts`
- 这层解析器目前提供的核心能力包括：
  - `normalizeQuestionnaireDraftV2()`：按新版问题组模型重算可见组、当前问题和答案清理
  - `parseQuestionnaireRuntimeV2()`：产出页面可直接消费的运行时结构
  - `toggleQuestionOptionV2()`：处理单选/多选点击后的答案更新
  - `setQuestionInputV2()`：处理输入题答案更新
  - `getRuntimeGroupByIdV2()` / `getRuntimeQuestionByIndexV2()`：给页面层按组或按当前顺序取题
- 当前解析器已经覆盖：
  - 严格按 PRD 处理单个问卷逻辑：
  - 第一个问题组固定从唯一问题开始
  - `related` 指向组内第 `0` 个问题时，目标问题组隐藏
  - `related` 指向组内非 `0` 个问题时，展示对应问题
  - 未被 `related` 命中的问题组，如果 `initialQuestionId` 非 `0` 结尾，则默认展示第 `1` 个问题
  - `mutex` 触发的选项移除
  - 多选题按 `group` 的组选项互斥
  - 分支切换时重置无效答案
- 目前还没有把旧页面切到这套解析器上；后续新问卷页面应直接基于 `questionnaireV2.ts + questionnaireV2Parser.ts` 实现。
