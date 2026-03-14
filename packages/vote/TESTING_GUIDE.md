# 测试环境使用指南

## 概述

本指南帮助你在开发和测试环境中模拟用户登录和设置测试数据，以便测试投票导出功能。

## 前置条件

确保你在开发环境中运行项目：
```bash
cd packages/vote
pnpm dev
```

## 快速开始

### 方式一：使用浏览器控制台（推荐）

1. 打开浏览器，访问 `http://localhost:5173/v11/`
2. 打开浏览器开发者工具（F12）
3. 切换到 Console（控制台）标签
4. 你会看到测试工具已加载的提示信息
5. 输入以下命令：

```javascript
testHelper.setupQuickTestVotes()
```

这条命令会：
- 自动登录一个测试用户
- 设置角色投票数据（博丽灵梦为本命，其他7个角色）
- 所有数据会自动保存到 localStorage

6. 页面会自动刷新，你会看到已登录状态
7. 点击右上角头像，在用户菜单中点击"导出角色投票为图片"
8. 预览并下载图片

### 方式二：访问测试页面

访问 `http://localhost:5173/v11/test` 可以看到现有的测试页面。

## 可用的测试命令

### 1. 快速设置完整测试数据

```javascript
testHelper.setupQuickTestVotes()
```

一键设置：
- 测试用户登录
- 本命角色：博丽灵梦
- 其他角色：雾雨魔理沙、琪露诺、十六夜咲夜等

### 2. 仅设置测试用户

```javascript
testHelper.setupTestUser()
```

只创建一个登录用户，不设置投票数据。

### 3. 自定义角色投票

```javascript
testHelper.setupTestCharacterVotes('灵梦', ['魔理沙', '琪露诺'])
```

参数：
- 第一个参数：本命角色名称（可选）
- 第二个参数：其他角色名称数组（可选）

示例：
```javascript
// 只有本命
testHelper.setupTestCharacterVotes('博丽灵梦')

// 自定义多个角色
testHelper.setupTestCharacterVotes('博丽灵梦', ['雾雨魔理沙', '琪露诺', '十六夜咲夜'])
```

### 4. 查看可用角色

```javascript
testHelper.getAvailableCharacters()
```

显示前20个可用的角色列表（包含灵梦、魔理沙、琪露诺相关角色）。

### 5. 检查当前状态

```javascript
testHelper.checkTestStatus()
```

显示：
- 登录状态
- Token 信息
- 用户名
- 角色投票数量和名称

### 6. 清理测试数据

```javascript
testHelper.clearTestUserData()
```

清除所有测试数据并刷新页面。

## 测试场景示例

### 场景1：只有本命角色

```javascript
// 设置测试用户
testHelper.setupTestUser()

// 只设置本命角色
testHelper.setupTestCharacterVotes('博丽灵梦')

// 测试导出功能
```

### 场景2：没有投票数据

```javascript
// 只设置测试用户，不设置投票
testHelper.setupTestUser()

// 测试无数据时的显示
```

### 场景3：多个投票数据

```javascript
// 快速设置8个角色投票
testHelper.setupQuickTestVotes()

// 查看当前状态
testHelper.checkTestStatus()
```

### 场景4：自定义角色

```javascript
// 查看可用角色
testHelper.getAvailableCharacters()

// 自定义投票
testHelper.setupTestCharacterVotes('十六夜咲夜', ['蕾米莉亚', '芙兰朵露'])
```

## 常见问题

### Q1: 命令找不到？

**A:** 确保：
1. 在开发环境运行项目（`pnpm dev`）
2. 页面已经加载完成
3. 在浏览器的 Console 中输入命令

### Q2: 角色名称不匹配？

**A:** 使用 `testHelper.getAvailableCharacters()` 查看可用的角色名称，使用完整名称或部分名称。

### Q3: 如何重置所有数据？

**A:** 使用 `testHelper.clearTestUserData()` 清理所有测试数据。

### Q4: 生产环境能用吗？

**A:** 不能！测试工具仅在开发环境（`import.meta.env.DEV`）中加载，生产环境不会加载。

### Q5: 设置的数据会持久化吗？

**A:** 会。所有数据都保存在 localStorage 中，刷新页面不会丢失。

## 测试导出功能

### 完整测试流程

1. **设置测试数据**
   ```javascript
   testHelper.setupQuickTestVotes()
   ```

2. **页面会自动刷新**

3. **进入用户主页**
   - 访问 `http://localhost:5173/v11/`
   - 页面应该显示已登录状态

4. **打开导出功能**
   - 点击右上角头像
   - 在用户菜单中找到"导出角色投票为图片"按钮

5. **测试导出**
   - 点击按钮，预览卡片
   - 点击"生成并下载"
   - 检查下载的 PNG 图片

6. **检查图片内容**
   - 头部：第X回 中文东方人气投票
   - 本命角色：博丽灵梦
   - 其他角色：雾雨魔理沙等
   - 底部：生成时间和品牌信息

### 测试检查清单

- [ ] 登录功能正常
- [ ] 用户菜单显示导出按钮
- [ ] 导出对话框正常打开
- [ ] 预览卡片显示正确
- [ ] 本命角色突出显示
- [ ] 其他角色列表正确
- [ ] 投票理由正常显示
- [ ] 生成图片成功
- [ ] 图片下载成功
- [ ] 图片质量清晰
- [ ] 无投票数据时显示提示

## 手动设置数据（高级）

如果你想手动设置数据，可以在控制台直接操作：

```javascript
// 设置登录
import { voteToken, setUserDataToLocalStorage, user, createDefaultVoter } from '@/home/lib/user'
const testUser = {
  ...createDefaultVoter(),
  username: '自定义用户',
  phone: '138****8888'
}
setUserDataToLocalStorage(testUser, 'test_token', 'test_session')

// 设置角色投票
import { characters } from '@/vote-character/lib/voteData'
import { Character } from '@/vote-character/lib/character'
const newChar = new Character()
newChar.id = '12345'
newChar.name = '测试角色'
newChar.honmei = true
newChar.reason = '测试理由'
characters.value[0] = newChar
localStorage.setItem('characters', JSON.stringify(characters.value))

// 刷新页面
location.reload()
```

## 清理和重置

### 完全清理

```javascript
testHelper.clearTestUserData()
```

### 部分清理

```javascript
// 只清理角色投票
localStorage.removeItem('characters')
location.reload()

// 只清理用户登录
localStorage.removeItem('user')
localStorage.removeItem('voteToken')
localStorage.removeItem('sessionToken')
location.reload()
```

## 注意事项

1. **仅用于开发环境**：测试工具不会在生产环境加载
2. **数据持久化**：数据保存在 localStorage，手动清理才会删除
3. **不影响后端**：这是纯前端模拟，不会影响后端数据
4. **Token 无效**：模拟的 token 无法通过后端验证
5. **刷新生效**：设置数据后需要刷新页面才能看到效果

## 后续测试

