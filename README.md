<h3 align="center">第九回 国内东方人气投票</h3>

<p align="center">
  <img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/PatchyVideo/Touhou-Vote" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/PatchyVideo/Touhou-Vote">
  <img alt="Code size" src="https://img.shields.io/github/languages/code-size/PatchyVideo/Touhou-Vote">
  <img alt="Contributors" src="https://img.shields.io/github/contributors/PatchyVideo/Touhou-Vote" />
  <img alt="License" src="https://img.shields.io/github/license/PatchyVideo/Touhou-Vote" />
</p>

由 [THBWiki](https://thwiki.cc) 与 [PatchyVideo](https://github.com/PatchyVideo) 共同开发的 “国内东方人气投票” 前端部分。

开发进度 / Status : 半成品 / WIP

## 路线图 / Roadmap

https://github.com/PatchyVideo/Touhou-Vote/blob/master/ROADMAP.md

## 范围一览 / Vote Range

https://github.com/PatchyVideo/Touhou-Vote/blob/master/VOTEDETAIL.md

## 贡献指南 / Contributing

### 如何在本地启动项目 / Run project locally

```bash
# 拉取后端项目 / clone backend repo
$ git clone https://github.com/zyddnys/Touhou-Vote-BE.git
$ cd Touhou-Vote-BE

# 启动 gateway / run gateway
$ cd gateway
$ cargo run
```

```bash
# 拉取前端项目 / clone frontend repo
$ git clone https://github.com/PatchyVideo/Touhou-Vote.git
$ cd Touhou-Vote

# 安装依赖 / install dependences
$ npm i

# 生成 GraphQL schema （需要启动 gateway） / generate GraphQL schema (needs gateway started)
$ npm run codegen

# 启动本地调试 / start a dev server
$ npm run dev

# 构建 & 运行 / build & start the project
$ npm run build
$ npm run start
```

### 常用插件表 / A list of common editor plugins

#### VSCode

- Vetur(octref.vetur): 基本 Vue 高亮、整理
- Eslint(dbaeumer.vscode-eslint): 代码纠错
- Prettier - Code formatter(esbenp.prettier-vscode): 代码格式化
- VSCode Conventional Commits(vivaxy.vscode-conventional-commits): commit 书写辅助
- i18n Ally(antfu.i18n-ally): 国际化辅助
- GraphQL(prisma.vscode-graphql)
