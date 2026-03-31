# 投票导出更新-20260215

## 更新概述

本次更新为投票系统添加了**投票导出为图片**功能，支持角色、CP、音乐类型(其它类型尚未设计风格故没加)。用户可以将自己的投票数据生成精美图片以分享和保存。

当前入口位于 `UserHome.vue` 的用户头像下拉菜单中，移动端和桌面端都已接入三个导出按钮。

由于后端最终版本当时还未就绪，这里补了基于 localStorage 的测试数据链路，并额外设计了兼容 GraphQL 和本地数据的统一接口。

但以当前代码为准，导出 UI 并没有暴露数据源切换开关；当前默认行为已经改成 `auto`，即优先 GraphQL，失败时回退本地数据。如果以后恢复该开关，则可强制切到 `graphql`。

在最下面是一个todo list，请看。

## 核心功能

### 1. 新增三个导出组件

#### ExportCharacterVoteImage.vue - 角色投票导出
- **本命角色大卡片**：展示本命角色的头像、姓名、作品、理由
- **其他角色网格**：3列网格布局展示其他投票角色
- **主题色**：基于角色颜色自动生成背景色

#### ExportCoupleVoteImage.vue - CP投票导出
- **本命CP大卡片**：展示2-3人CP组合
- **主动方标记**：底部弓形区域显示主动方角色
- **其他CP卡片**：纵向排列，每张卡片独立主题色

#### ExportMusicVoteImage.vue - 音乐投票导出
- **本命音乐大卡片**：展示曲目名称、原名、专辑、理由
- **其他音乐网格**：3列网格布局展示其他音乐投票
- **自动主题色**：基于曲目名称哈希生成独特颜色
- **完整信息**：包含中文名、原名、专辑等元数据

### 2. 图片生成与交互

**技术实现**
- 使用 `html2canvas` 进行离屏渲染
- 自动等待图片加载完成
- 对于外站图片资源，由于CORS限制，开发环境通过Vite的代理加载，生产环境需确保资源支持跨域访问(因为把图片画到Canvas上面比把图片摆出来更严格)

**用户操作**
- **预览**：在对话框中预览生成的图片
- **下载**：保存为PNG文件到本地
- **分享**：支持Web Share API（浏览器默认的）

**当前实现限制**
- 分享按钮只检查了 `navigator.share` 是否存在，没有检查文件分享能力是否真正可用
- 预览图 URL 使用了 `URL.createObjectURL()`，当前没有看到显式释放旧 URL 的逻辑
- 卡片底部二维码依赖第三方在线服务 `api.qrserver.com`
- GraphQL 切换入口在 UI 上仍然隐藏，当前只能使用默认 `auto` 行为

### 3. 数据层架构

因为我们的后端目前还没有改和确认上线，为了测试方便，我加入了使用localStorage的假数据(从登录状态、用户信息，到投票结果都是假的），并且设计了一个兼容GraphQL和本地数据的统一接口，后端API就绪后只需要切换数据源模式即可无缝迁移。

#### exportVoteData.ts - 投票数据导出工具

提供统一的数据导出接口：

```typescript
// 角色投票数据
getExportCharacterDataFromDataSource(mode?: DataSourceMode)

// CP投票数据
getExportCoupleDataFromDataSource(mode?: DataSourceMode)

// 音乐投票数据
getExportMusicDataFromDataSource(mode?: DataSourceMode)
```

**特性**
- **数据精简**：只导出 `{id, isHonmei, reason}`，其他信息从列表读取
- **智能回退**：GraphQL失败时自动切换到localStorage
- **数据校验**：确保本命角色/CP/音乐存在

#### voteDataSource.ts - 统一数据访问层

```typescript
// 数据源模式类型
type DataSourceMode = 'local' | 'graphql' | 'auto'

// 设置数据源模式
setDataSourceMode(mode: DataSourceMode)

// 获取投票数据
fetchVoteData<T>(dataType: VoteDataType, forceMode?: DataSourceMode)
```

**模式说明**
- **`local`**：强制使用localStorage数据
- **`graphql`**：强制使用GraphQL API
- **`auto`**：当前导出 Vue 组件默认行为；优先 GraphQL，失败时回退本地

**错误识别**
- 网络连接失败
- 认证/token无效
- 服务器错误
- 数据不完整

### 4. 测试工具

#### testHelper.ts - 开发测试辅助

提供便捷的测试数据设置：

```javascript
// 在浏览器控制台使用

// 一键设置完整测试数据
testHelper.setupAllTestVotes()

// 快速设置角色投票
testHelper.setupQuickTestVotes()

// 快速设置CP投票
testHelper.setupQuickTestCoupleVotes()

// 快速设置音乐投票
testHelper.setupQuickTestMusicVotes()

// 自定义测试数据
testHelper.setupTestCharacterVotes('博丽灵梦', ['雾雨魔理沙', '琪露诺'])
testHelper.setupTestCoupleVotes(
  [{names: ['灵梦', '魔理沙'], active: '灵梦', reason: '理由'}]
)
testHelper.setupTestMusicVotes('幽雅地绽放吧，墨染的樱花', ['红魔', '月'])

// 检查当前状态
testHelper.checkTestStatus()

// 清理测试数据
testHelper.clearTestUserData()

// 设置数据源模式
testHelper.setDataSourceMode('local')  // 或 'graphql', 'auto'
```

## 技术亮点

### 1. GraphQL与本地数据兼容

- **统一接口**：通过 `voteDataSource.ts` 抽象数据访问层
- **智能降级**：后端未完成时，自动使用localStorage数据
- **透明切换**：用户无需感知数据源变化
- **未来扩展**：后端API就绪后无缝切换

### 2. 数据映射策略

**导出数据格式**：
```typescript
// 角色投票
{
  id: string        // 角色ID
  isHonmei: boolean // 是否本命
  reason: string    // 理由（仅本命需要）
}

// CP投票
{
  idA: string       // 第一个角色ID
  idB: string       // 第二个角色ID
  idC: string       // 第三个角色ID（可选）
  active: string    // 主动方角色ID
  isHonmei: boolean // 是否本命
  reason: string    // 理由
}

// 音乐投票
{
  id: string        // 音乐ID
  isHonmei: boolean // 是否本命
  reason: string    // 理由（仅本命需要）
}
```

**完整信息获取**：
- 从 `characterList`/`musicList` 读取详细信息
- 避免数据冗余存储
- 保持数据一致性

### 3. 图片生成优化

**离屏渲染**
- 使用绝对定位隐藏DOM（`left: -9999px`）

**性能和加载**
- 等待图片加载完成后再生成
- 2x scale提高图片清晰度

### 4. 错误处理与用户体验

**错误识别**
```
✅ 无效的 voteToken → 提示登录
❌ 网络连接失败 → 自动回退本地数据
⚠️ 后端数据不完整 → 使用本地数据
```

**用户反馈**
- 加载状态提示（获取数据/生成图片）
- 错误信息弹窗
- 降级策略透明化（"已使用本地数据"）

## 文件结构

```
packages/vote/src/
├── common/
│   ├── components/
│   │   ├── ExportCharacterVoteImage.vue  # 角色投票导出组件
│   │   ├── ExportCoupleVoteImage.vue     # CP投票导出组件
│   │   └── ExportMusicVoteImage.vue      # 音乐投票导出组件
│   └── lib/
│       ├── exportVoteData.ts             # 投票数据导出工具
│       ├── voteDataSource.ts             # 统一数据访问层
│       └── testHelper.ts                 # 测试环境辅助工具
```

## 使用示例

### 用户操作流程

1. **完成投票**：在相应页面完成角色/CP/音乐投票
2. **打开用户菜单**：在首页点击头像打开下拉菜单
3. **点击导出**：点击对应的导出按钮
4. **预览生成**：查看生成的投票卡片
4. **保存或分享**：下载图片或直接分享

### 开发者测试流程

```bash
# 1. 启动开发环境
pnpm vote:dev

# 2. 打开浏览器控制台
# 3. 设置测试数据
testHelper.setupAllTestVotes()

# 4. 测试导出功能
# - 登录后进入首页
# - 点击头像打开用户菜单
# - 点击"导出角色投票为图片" / "导出CP投票为图片" / "导出音乐投票为图片"

# 5. 测试数据源切换
# 注意：当前导出 UI 默认走 auto。
# 如果要专门验证“强制 GraphQL”分支，仍需要恢复或补充导出组件中的数据源切换逻辑。
testHelper.setDataSourceMode('graphql')
testHelper.setDataSourceMode('local')
testHelper.setDataSourceMode('auto')

# 6. 清理测试数据
testHelper.clearTestUserData()
```



## 注意事项

### 生产环境配置

1. **后端API**：确保GraphQL API已部署并正常运行
2. **CDN配置**：配置图片资源的CORS和缓存策略
3. **图片优化**：考虑图片压缩和懒加载优化

### 开发环境调试

- 使用 `testHelper` 快速设置测试数据
- 检查浏览器控制台的详细日志
- 使用 `checkTestStatus()` 查看当前状态
- 必要时使用 `clearTestUserData()` 清理数据

### 已知限制

- 图片生成依赖 `html2canvas`，复杂CSS可能有兼容性问题
- 大量图片可能导致性能问题
- Web Share API在某些浏览器不支持（降级为下载）
- 当前虽然默认走 `auto`，但“强制 GraphQL / 强制 local”的切换入口仍未开放到用户可操作层
- 预览图和外部二维码资源仍有进一步稳定性优化空间

---
## Todo List

### 1. 同人和问卷结果导出

我们目前没有设计好同人和问卷结果的导出样式，所以暂时没有加这两个类型的导出功能。后续需要设计好样式后再添加。

一个比较大的问题是同人作品的自由度太高了，可能需要设计一个比较通用的样式，或者提供一些自定义选项让用户选择展示哪些信息。

### 2. 服务器资源代理配置

重复一下这个问题，由于我们需要把图片资源画到Canvas上面，而这比直接展示图片更严格，所以在开发环境我们通过Vite的代理加载图片资源，生产环境需要确保这些资源支持跨域访问，或者配置服务器进行代理。在其它地方因为只是把“图片挂上去”，所以不需要特别处理。

### 3. 角色和音乐颜色信息

目前的颜色配置非常匮乏，角色虽然有颜色字段，但全都是同一个颜色，音乐完全没有颜色字段。

我非常建议我们有时间通过一些调查或者拍脑袋的方式，给每个角色和音乐配置一个合理的颜色，这样生成的图片会更好看，也更有辨识度，要不然全是默认颜色或者随机颜色都很抽象。

### 4. 模块化组件

在一些地方换用Naive-UI的组件，并且尽可能把复用的部分抽离成独立组件和脚本，让它维护起来更方便一些。

### 5. 当前必须优先处理的问题

1. **数据源行为和文档不一致**

当前这个问题已修正为默认走 `auto`。后续仍需决定是否恢复并整理数据源切换入口，让开发态能显式验证强制 `graphql` 分支。

2. **导出卡片用户名错误**

当前这个问题已修正，导出卡片会读取实际登录用户名；若用户名缺失再回退“匿名用户”。

3. **Object URL 未释放**

频繁导出会不断创建新的预览 URL，如果不释放旧 URL，浏览器内存占用会逐渐增加。

4. **分享能力检测不完整**

目前只判断 `navigator.share`，但文件分享是否可用并不总是等价，应该补 `navigator.canShare({ files })` 之类的检查。

5. **第三方二维码依赖过强**

导图流程依赖外部二维码服务，建议尽快改成本地静态资源或本地生成方案，降低不确定性。

## Git Commit 信息

```
feat: 添加投票导出图片功能，支持角色/CP/音乐三个投票类型

新增三个投票导出组件，将用户投票数据生成精美的图片卡片：

- ExportCharacterVoteImage.vue - 角色投票导出
  * 展示本命角色大卡片和其他角色网格布局
  * 支持角色头像、姓名、作品、理由等信息展示
  * 动态生成主题色背景和装饰效果

- ExportCoupleVoteImage.vue - CP投票导出  
  * 支持2-3人CP组合展示
  * 显示主动方标记（下部弓形区域）
  * 本命CP和其他CP分层展示，每张卡片独立主题色

- ExportMusicVoteImage.vue - 音乐投票导出
  * 展示本命音乐和其他音乐投票
  * 显示曲目名称、原名、专辑等信息
  * 基于曲目名称哈希自动生成主题色

技术特性：
- 使用 html2canvas 进行离屏DOM渲染，生成高质量PNG图片
- 支持预览、下载、分享三种操作
- 兼容 Web Share API（移动端）
- 自动等待图片加载完成后再生成
- 支持开发环境CDN代理

数据层设计：
- exportVoteData.ts：提供统一数据导出接口
  * 支持 localStorage 和 GraphQL 双数据源
  * 实现数据映射：完整数据精简为 {id, isHonmei, reason}
  * 智能回退机制：GraphQL失败或数据不完整时自动切换到本地数据
  * 严格校验：确保本命角色/CP/音乐存在

- voteDataSource.ts：统一数据访问层
  * 抽象数据源模式：'local' | 'graphql' | 'auto'
  * auto模式优先GraphQL，失败时回退到localStorage
  * 提供错误分类识别：网络错误、认证错误、服务器错误
  * 统一GraphQL查询定义和结果映射
  * 支持五大投票类型：character/music/couple/doujin/questionnaire

- testHelper.ts：测试环境辅助工具
  * 提供 setupAllTestVotes() 一键设置完整测试数据
  * 支持自定义测试数据设置（角色/CP/音乐）
  * 集成数据源模式控制
  * 提供便捷的控制台API
  * 支持状态检查和数据清理

背景说明：
- 由于后端GraphQL API尚未完成，实现了基于localStorage的假数据测试
- 通过抽象数据访问层，实现了兼容GraphQL和本地数据的统一接口
- 后端API就绪后，只需将数据源模式切换为'graphql'即可无缝迁移
- 当前默认使用'auto'模式，优先GraphQL，失败时自动降级到本地数据

测试方式：
1. pnpm dev 启动开发环境
2. 打开浏览器控制台，执行 testHelper.setupAllTestVotes()
3. 访问投票页面，点击"导出为图片"按钮
4. 查看生成的投票卡片，测试下载和分享功能
5. 使用 testHelper.setDataSourceMode('graphql') 测试GraphQL模式
```

---

**更新日期**：2025-02-16  
**负责人**：Renko_1055  
