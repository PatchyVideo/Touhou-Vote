<h3 align="center">第十回 国内东方人气投票</h3>

<p align="center">
  <img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/PatchyVideo/Touhou-Vote" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/PatchyVideo/Touhou-Vote">
  <img alt="Code size" src="https://img.shields.io/github/languages/code-size/PatchyVideo/Touhou-Vote">
  <img alt="Contributors" src="https://img.shields.io/github/contributors/PatchyVideo/Touhou-Vote" />
  <img alt="License" src="https://img.shields.io/github/license/PatchyVideo/Touhou-Vote" />
</p>

由 [THBWiki](https://thwiki.cc) 与 [VoileLabs](https://github.com/PatchyVideo) 共同开发的 “第十回 国内东方人气投票” 前端部分。为全新搭建的系统。

开发进度 / Status : 半成品 / WIP

## 新功能 / What's new

比起前几届的系统，本届多出了以下功能：

- 全新设计的UI，支持全响应式布局，更好的兼容手机端
- 精简的登陆逻辑，支持邮箱/手机号登陆和旧版邮箱密码登陆
- 深度拆分的问卷，问卷变短，针对性变强的同时，也将问卷数据实时存入本地，防止意外退出/刷新界面的时候还得重新填写问卷
- 图形化的投票界面，更多丰富的图形效果，规避了文字过多导致的杂乱，看起来更加简洁直观
- 更广泛的搜索系统，即使不知道名字也可以通过称号，出场作品甚至是外号来搜索到自己喜欢的角色/曲目

## 需求文档 / Requirements Doc

https://github.com/PatchyVideo/Touhou-Vote/blob/next/doc/VoileLabs-人气投票项目-需求文档.docx

## 路线图 / Roadmap

https://github.com/PatchyVideo/Touhou-Vote/blob/next/doc/ROADMAP.md

## 调查问卷大纲 / Outline-Questionnaire

https://github.com/PatchyVideo/Touhou-Vote/blob/next/doc/OUTLINE-Questionnaire.md

## 范围一览 / Vote Range

https://github.com/PatchyVideo/Touhou-Vote/blob/next/doc/VOTEDETAIL.md

## 贡献指南 / Contributing

### 如何在本地启动项目 / Run project locally

```bash
# 拉取前端项目 / clone frontend repo
$ git clone https://github.com/PatchyVideo/Touhou-Vote.git
$ cd Touhou-Vote

# 安装依赖 / install dependences
$ yarn

# 启动本地调试 / start a dev server
$ yarn dev

# 构建 & 运行 / build & start the project
$ yarn build
$ yarn serve
```
