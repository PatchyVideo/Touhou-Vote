# 本地开发启动指南

> 2026-07-23 整理。以下每一步都在 Linux 真机上从零跑通验证过；
> 跳过任何一步都会撞到文末「坑速查表」里的对应症状。

## TL;DR（投票页）

```bash
git clone git@github.com:PatchyVideo/Touhou-Vote.git
cd Touhou-Vote
pnpm install                # ① 只能用 pnpm，见坑表 P1
cd packages/vote
GRAPHQL_SCHEMA_URL=http://154.37.215.62:18000/graphql pnpm codegen
                            # ② 必须先 codegen，见坑表 P2/P3
pnpm dev                    # ③ 起 dev server（端口 5175）
```

然后浏览器打开 **`http://localhost:5175/v11/`** —— **必须带 `/v11/`**（见坑表 P4）。

Windows PowerShell 的第②步写法：

```powershell
$env:GRAPHQL_SCHEMA_URL = 'http://154.37.215.62:18000/graphql'; pnpm codegen
```

## 各步骤说明

### ① 安装依赖：只能用 pnpm

本仓库是 pnpm workspace（monorepo），包间依赖用 `workspace:*` 协议声明，
`npm install` / `yarn` 无法解析该协议。根目录 `pnpm install` 一次装完所有包。

### ② codegen：生成 GraphQL 产物

`packages/vote/src/graphql/__generated__/`（typePolicies、graphql.fragment 等）
是 codegen 产物，**被 `.gitignore` 忽略、仓库里没有**。新 clone 不跑这步就
`pnpm dev`，页面会 500 白屏（vite 在模块图里解析不到这些 import）。

schema 来源按优先级：

- 环境变量 `GRAPHQL_SCHEMA_URL`（推荐指向测试机后端
  `http://154.37.215.62:18000/graphql`，schema 最新）；
- 不设置时默认 `https://touhou.ai/vote-be/graphql`——**老地址，不保证可用，
  且没有 v12 新增的查询字段**。

CI 部署（`.github/workflows/vote-image.yml`）会自动对测试机后端跑 codegen，
所以线上从不缺这些文件——这是「CI 正常、本地白屏」差异的来源。

后端 schema 变更后（例如新增 mutation/query），本地要重跑一次 codegen 才能
拿到新类型。结果页同理：`packages/result` 下 `pnpm codegen`。

### ③ dev server

`packages/vote` 下 `pnpm dev`（等价于根目录 `pnpm vote:dev`）。默认端口
**5175**（见 `packages/vote/vite.config.ts`）。启动打印
`VITE ready in ...` 即成功——但注意它是懒编译，**终端无报错 ≠ 页面能开**，
codegen 缺失的 500 只在浏览器请求时才暴露。

### ④ 访问路径：必须带 `/v11/`

路由 base 写死为 `/v11/`（`src/main/main.ts` 的
`createWebHistory('/v11/')`），而 vite dev 未设 `base`。因此：

- `http://localhost:5175/v11/` ✅ 正常页面
- `http://localhost:5175/` ❌ **无报错白屏**（应用挂载成功但路由零匹配，
  终端与 console 几乎无提示）

## 本地联调后端数据（可选）

前端 API 前缀已切到 `/v12-be`（`src/common/lib/apiPrefix.ts`），但
`vite.config.ts` 的 `server.proxy` 目前只配了 legacy 的 `/v11-be`。
不补代理时页面能打开，但登录/发码/数据请求全部 404。要联调需在
`server.proxy` 中补齐（与 `Dockerfile.vote.template` 里 nginx 的四条
v12 路由对齐）：

```ts
'/v12-be/vote-objects/': { target: 'http://154.37.215.62:18000', changeOrigin: true,
  rewrite: (p) => p.replace(/^\/v12-be\/vote-objects\//, '/api/v1/vote-objects/') },
'/v12-be/questionnaire/': { target: 'http://154.37.215.62:18000', changeOrigin: true,
  rewrite: (p) => p.replace(/^\/v12-be\/questionnaire\//, '/api/v1/questionnaire/') },
'/v12-be/doujin/api': { target: 'http://154.37.215.62:18000', changeOrigin: true,
  rewrite: () => '/api/v1/scraper/scrape' },
'/v12-be': { target: 'http://154.37.215.62:18000', changeOrigin: true,
  rewrite: (p) => p.replace(/^\/v12-be/, '') },   // graphql 等根路径端点走这条兜底
```

## 坑速查表

| # | 症状 | 原因 | 处理 |
|---|---|---|---|
| P1 | `npm install` 报 `EUNSUPPORTEDPROTOCOL workspace:` | pnpm workspace 协议 | 用 `pnpm install` |
| P2 | 打开页面 **500 白屏**，终端有 `Failed to resolve import "./__generated__/typePolicies"` | 没跑 codegen，产物被 gitignore | 按 ② 跑 codegen |
| P3 | codegen 卡住/报网络错误 | 默认 schema 地址 `touhou.ai` 老旧不可用 | 设 `GRAPHQL_SCHEMA_URL` 指测试机 |
| P4 | 页面**无报错白屏**，终端一切正常 | 打开了裸 `/`，路由 base 是 `/v11/` | 访问 `http://localhost:5175/v11/` |
| P5 | 页面能开，登录/数据全部 404 | dev 代理缺 `/v12-be` 映射 | 按「本地联调」补 proxy |
| P6 | 根目录 `npm run dev` 报 Missing script | 根目录只有 `vote:dev` 等前缀脚本 | `pnpm vote:dev` 或进 `packages/vote` 跑 `pnpm dev` |

## 相关文档

- 设计规范（分辨率/配色）：[DEVELOPEDOC.md](./DEVELOPEDOC.md)
- 测试环境部署流水线：`.github/workflows/{vote,result,navigator}-image.yml`
  （push `dev`/`zfq_dev_fe` 且命中各自 package 路径时自动部署到测试机）
- ⚠️ **`vote-ci.yml` 是生产（Vercel）发版流水线，push `dev` 且命中
  `packages/vote/**` 即触发**——日常开发请在个人分支进行，合入 `dev` 前
  确认这次改动可以直接发生产。
