# Navigator 前端快速上手

> 面向熟悉 Vue/Vite 的开发者，帮助快速理解 `packages/navigator` 的结构与常用改动点。

Copilot 生成的内容仅供参考，具体实现请以实际代码为准。

## 项目概览
- 入口：`src/main.ts` 创建 Vue 3 应用，挂载 `App.vue`，历史模式基准 `/nav/`（部署时需匹配 Nginx/静态服务的 `base`）。
- 路由：使用 `vite-plugin-pages` 自动生成；`src/pages/index.vue` 为首页，`src/pages/[...all].vue` 为兜底 404。
- 样式：`@unocss/reset/tailwind.css` + `uno.css`（UnoCSS 原子化），`src/styles/global.postcss` 引入 Quicksand 字体。
- 设计：主页展示各届投票入口，使用 `@vueuse/core` 的 `useNow`、`date-fns` 计算投票倒计时。

## 主要依赖
- 运行时：Vue 3、Vue Router 4、@vueuse/core、date-fns。
- 构建：Vite、vite-plugin-pages、unplugin-auto-import、unplugin-vue-components、UnoCSS。

## 目录速览（关键文件）
- `src/main.ts`：创建 app，注册 router，挂载样式。
- `src/App.vue`：仅渲染 `<router-view />`。
- `src/pages/index.vue`：主页 UI/逻辑；含 `resultListRaw` 数据、倒计时计算、封面背景渐变样式。
- `src/pages/[...all].vue`：简单 404 占位。
- `src/styles/global.postcss`：字体类 `.quicksand`。
- `vite.config.ts`：
  - alias `@/` → `src/`
  - 自动路由/按需导入/组件/UnoCSS 插件
  - 构建产物 `assetsDir: 'nav/assets'`，`sourcemap: true`。
- `unocss.config.ts`：`presetUno` + `presetIcons`（scale 1.2）+ `transformerDirectives`。

## 本地运行
```bash
pnpm install
pnpm --filter @touhou-vote/navigator dev
# 预览构建
pnpm --filter @touhou-vote/navigator build && pnpm --filter @touhou-vote/navigator serve
```
- 开发服务器默认端口由 Vite 决定；路由 `base` 为 `/nav/`，本地直接 `http://localhost:5173` 即可。

## 关键业务点（主页）
- 数据源：`resultListRaw` 写死各届链接/标题/封面/时间，`reverse()` 后最新在前；`latestLink` 拼接为 `/' + latestLink`。
- 投票状态：`votingEnd = new Date(2024, 0, 15)`；`useNow({ interval: 1000 })` + `computed` 判断是否投票中，并用 `date-fns` 格式化剩余时间。
- 图标位置：`resultListIconPosition` 控制背景定位，按索引取模。

## 常见改动提示
1) **更新届数/时间/封面**：编辑 `src/pages/index.vue` 的 `resultListRaw`，保持 `[link, title, icon, time]` 格式；若有新的投票截止时间同步更新 `votingEnd`。
2) **调整导航基准**：若部署路径变化，需同时调整 `createWebHistory('/nav/')` 与上游反向代理；必要时修改 `vite.config.ts` 的 `base`（当前未设置，沿用默认 `/`）。
3) **新增页面**：在 `src/pages` 下按约定式路由新增 `.vue` 文件即可自动注册；如需布局，请在页面内自行组织，暂无全局布局组件。
4) **样式与图标**：优先使用 UnoCSS 原子类；需要自定义指令时可用 `@apply` 等（已启用 `transformerDirectives`）。图标用 `presetIcons`，类名如 `i-carbon-arrow-right`。

## 调试/排错
- 构建产物开启 `sourcemap`，方便前端监控或本地调试。
- 若自动导入类型缺失，删除重建 `auto-imports.d.ts`/`components.d.ts`（`pnpm dev` 会重新生成）。

## 快速起手清单
- [ ] 跑通 `pnpm --filter @touhou-vote/navigator dev`
- [ ] 根据最新活动更新 `resultListRaw` 与 `votingEnd`
- [ ] 验证路由在目标部署路径下可正常刷新（历史模式需要服务器回退）
- [ ] 检查 UnoCSS 原子类是否满足设计需求，必要时在 `unocss.config.ts` 扩展
- [ ] 如需 SEO/统计，可在 `index.html` 注入对应脚本
