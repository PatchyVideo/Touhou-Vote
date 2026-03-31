`doc/ai-generated` 里的内容是基于当前仓库代码整理出的前端速查文档，用来帮助快速定位入口、路由、构建方式和常见改动点。

这些文档不是规范来源，只适合作为阅读代码前的导航：
- 具体行为以 `packages/*` 下的实际实现为准。
- 如果文档和代码不一致，应优先相信代码。
- 文档覆盖的是当前仓库里的 3 个前端应用：`packages/vote`、`packages/result`、`packages/navigator`。

目前文件说明如下：
- `vote-dev-notes.md`：投票页，包含登录、问卷、角色/音乐/CP/提名投票流程。
- `result-dev-notes.md`：结果页，包含自动路由、布局、Apollo/GraphQL 和图表页面。
- `navigator-dev-notes.md`：导航页，负责历届投票入口与当前届引导。

如果接下来主要开发 `packages/vote`，建议先读 `vote-dev-notes.md`。当前仓库里前端交互最复杂、改动也最集中的部分就是投票页，包括首页入口状态切换和“导出投票结果为图片”组件链路。
