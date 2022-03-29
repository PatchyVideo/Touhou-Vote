<h3 align="center">第十回 国内东方人气投票</h3>

<p align="center">
  <img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/PatchyVideo/Touhou-Vote" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/PatchyVideo/Touhou-Vote" />
  <img alt="Lines of code" src="https://tokei.rs/b1/github/PatchyVideo/Touhou-Vote?category=code" />
  <img alt="License" src="https://img.shields.io/github/license/PatchyVideo/Touhou-Vote" />
</p>

由 [THBWiki](https://thwiki.cc) 与 [VoileLabs](https://github.com/PatchyVideo) 共同开发的 “第十回 国内东方人气投票” 前端部分。为全新搭建的系统。

开发进度: V1.1.1

## 新功能

比起前几届的系统，本届多出了以下功能：

- 全新设计的 UI，支持全响应式布局，更好的兼容手机端
- 精简的登陆逻辑，支持邮箱/手机号登陆和旧版邮箱密码登陆
- 深度拆分的问卷，问卷变短，针对性变强的同时，也将问卷数据实时存入本地，防止意外退出/刷新界面的时候还得重新填写问卷
- 图形化的投票界面，更多丰富的图形效果，规避了文字过多导致的杂乱，看起来更加简洁直观
- (TODO)更广泛的搜索系统，即使不知道名字也可以通过称号，出场作品甚至是外号来搜索到自己喜欢的角色/曲目

## 开发资料

需求文档: <https://github.com/PatchyVideo/Touhou-Vote/blob/dev/doc/VoileLabs-人气投票项目-需求文档.docx>

路线图: <https://github.com/PatchyVideo/Touhou-Vote/blob/dev/doc/ROADMAP.md>

调查问卷大纲: <https://github.com/PatchyVideo/Touhou-Vote/blob/dev/doc/OUTLINE-Questionnaire.md>

范围一览: <https://github.com/PatchyVideo/Touhou-Vote/blob/dev/doc/VOTEDETAIL.md>

## 如何在本地启动项目

```bash
# 拉取项目
$ git clone https://github.com/PatchyVideo/Touhou-Vote.git
$ cd Touhou-Vote

# 安装依赖
$ pnpm i
```

### 投票页

```bash
# 生成 GraphQL Schema
$ pnpm vote:codegen

# 启动本地调试
$ pnpm vote:dev

# 构建 & 运行
$ pnpm vote:build
$ pnpm vote:serve
```

### 导航页

```bash
# 启动本地调试
$ pnpm nav:dev

# 构建 & 运行
$ pnpm nav:build
$ pnpm nav:serve
```
