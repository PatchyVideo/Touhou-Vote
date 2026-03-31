# Navigator 前端快速上手

> 面向需要维护 `packages/navigator` 的开发者，基于当前代码整理。

## 项目定位
- `packages/navigator` 是历届投票导航页，用来承接站点首页入口，并把用户导向当前届投票页或往届结果页。
- 应用本身很轻，核心逻辑基本都集中在 `src/pages/index.vue`。
- 路由基准是 `/nav/`，部署时服务端也要按这个前缀回退。

## 架构概览
- 入口：`src/main.ts`
- 路由：`src/router.ts` 显式定义，`App.vue` 只渲染 `<router-view />`
- 样式：UnoCSS + `src/styles/global.postcss`
- 主要运行时依赖：
  - Vue 3
  - Vue Router 4
  - `@vueuse/core`
  - `date-fns`
  - `naive-ui`、`vfonts` 已安装，但当前入口页面里几乎没看到实际使用

## 关键文件
- `src/main.ts`：创建应用并挂载 `src/router.ts`
- `src/router.ts`：显式注册首页和 404 路由，使用 `createWebHistory('/nav/')`
- `src/pages/index.vue`：整站主要页面，包含届数列表、最新届倒计时、版权区
- `src/pages/[...all].vue`：404 兜底
- `vite.config.ts`：自动导入、组件自动注册、UnoCSS
- `unocss.config.ts`：`presetUno`、`presetIcons`、`transformerDirectives`

## 首页数据模型
- `resultListRaw` 直接写在 `src/pages/index.vue`，每项结构是：
  - `[link, title, icon, time, endDate?]`
- 页面会先给每项补上原始索引，再 `reverse()`，所以渲染顺序是最新届在前。
- 最新一届会单独渲染为顶部大按钮，其余届数走下面的列表。
- 是否显示“参与投票”还是“查看结果”由最新一届是否配置 `endDate` 且当前时间未超过截止时间决定。

## 当前实现的几个注意点
- 倒计时不是单独的全局配置，而是依赖 `resultListRaw` 最后一项里的 `endDate`。
- 当前代码里第 11 回的展示时间字符串是 `2023/12/29 ~ 01/14`，截止时间字符串是 `2024-01-15T00:00:00+08:00`；后续更新新一届时，这两处都要一起改。
- `createWebHistory('/nav/')` 已写死，但 `vite.config.ts` 没有额外设置 `base`，所以本地开发通常直接跑在 Vite 默认根路径下，生产环境再由服务端路径处理。

## 本地运行
```bash
pnpm install
pnpm nav:dev
```

预览构建：
```bash
pnpm nav:build
pnpm nav:serve
```

## 常见改动点
1. 更新届数、封面、投票时间，直接改 `src/pages/index.vue` 的 `resultListRaw`。
2. 如果要把数据从硬编码改成接口拉取，优先重构 `resultListRaw` 和最新届派生逻辑，不要只改单个展示块。
3. 如果部署前缀变化，至少同步检查 `src/main.ts` 里的 `/nav/` 和服务端回退规则。
4. 如果要扩展更多页面，新增页面文件后记得同步更新 `src/router.ts`。

## 调试提示
- 构建产物开启了 `sourcemap`。
- 自动导入和组件类型声明由插件生成；如果类型异常，可以删掉生成的 d.ts 再重启 Vite。
- 这个应用几乎没有状态管理和接口层，页面问题通常集中在静态数据、时间判断或部署路径配置上。
