# Touhou-Vote 当前开发状态

核对日期：2026-11-09，会话收尾。本地分支 `feat/questionnaire-backend-source`，功能提交基线16be240；配套后端功能提交基线97e8fb4。以下问卷状态已核对提交，不代表线上状态；本会话未推送或部署。

## 当前重点

- 主要维护 `packages/vote`，梳理后端数据来源、前端缓存与本地填写状态的边界。
- 下方记录已提交源码事实；工作区试验和未提交调整不计入已完成进展。

## 已提交源码现状

- 问卷页面、首页完成态、登录回填和路由守卫已接入 `questionnaireStateV2.ts`。
- 问卷定义由后端 `/questionnaire/structure` 返回；共享 `questionnaireV2.ts` 只定义类型。
- 问卷以结构化答案调用 `submitPaperV2`，通过 `getPaperV2` 恢复，提交格式已接通。
- 问卷填写与结果共用后端定义，结果端题干、选项及筛选不再依赖旧静态TS题库（4fda4ef）。
- 整体完成预判为全部必填＋至少一份extra选填（16be240）；后端按已保存答案执行同一政策，并退出旧问卷JSON放行。前端草稿完成不能代替服务端资格。
- 角色、音乐候选资料来自后端；同次页面运行复用内存，刷新页面后重新请求。
- 角色、音乐、CP 成员搜索已使用 `/api/v1/autocomplete/search`，保留前端筛选与排序。
- CP 作品及分类筛选已使用角色候选的 `characterFilterMeta`（提交 `edeaeea`）。
- 角色、音乐、CP 的投票结果图片导出入口和共享生成逻辑已存在。

## 尚存代码与核验边界

- 问卷结构只在本次应用运行中内存复用，刷新重新拉后端；sessionStorage旧题库不再作为加载来源。答案草稿另存localStorage的 `questionnaireDataLocalV2`。
- 投票开放时间仍取自 `packages/shared/data/time.ts` 的静态值，其中截止时间为 2099 年。
- 静态投票时间尚未调整；问卷结构缓存方式已在本轮完成迁移。
- 旧问卷定义、状态与 paperJson 兼容代码仍保留为 legacy；文件存在不表示主链路尚未迁移。
- 特殊地图/性别图和趋势代理保留既有code绑定，真实题库分类/编码、账号提交回填与结果未核验；后端已提供独立只读定义检查脚本，尚未对真实库运行。
- 工作区另有投票草稿、codegen与本地开发说明等未提交改动，不计入本轮问卷交付；后续提交先核对范围。
- 本次未查询线上题库、账号认证、统计或部署状态；旧记录中的认证故障未重新核验。
- 导出图片在开发环境使用资源代理；正式图源的 canvas 跨域表现本次未验证。

## 阅读入口

- [本地启动与排障](doc/LOCAL_DEV.md)
- [前端文档索引](doc/ai-generated/explain.md)
- [投票页速查](doc/ai-generated/vote-dev-notes.md)
- [当前问卷指南](doc/ai-generated/questionnaire-v2-notes.md)
- [变更记录](docs/CHANGELOG.md)
- [历史归档索引](docs/archive/frontend/README.md)

旧状态快照和问卷迁移方案保留在归档中，仅用于了解当时背景。
