/**
 * 测试环境辅助工具
 * 
 * 注意：仅用于开发和测试环境，生产环境不要使用
 * 
 * 使用方式：
 * 1. 在浏览器控制台中调用 setupTestUser()
 * 2. 或者直接访问 /test 页面使用测试工具
 */

import { voteToken, isLogin, setUserDataToLocalStorage, user, createDefaultVoter, enableDevMode, disableDevMode } from '@/home/lib/user'
import { characters } from '@/vote-character/lib/voteData'
import { characterList } from '@/vote-character/lib/characterList'
import { Character } from '@/vote-character/lib/character'

/**
 * 模拟登录用户
 */
export function setupTestUser() {
  console.log('🔧 设置测试用户...')
  
  // 启用开发模式以绕过后端验证
  enableDevMode()
  
  // 模拟用户数据
  const testUser = {
    ...createDefaultVoter(),
    username: '测试用户',
    phone: '138****8888',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
  }
  
  // 模拟 token（在开发模式下不需要后端验证）
  const testVoteToken = 'test_token_' + Date.now()
  const testSessionToken = 'test_session_' + Date.now()
  
  // 保存到 localStorage
  user.value = testUser
  setUserDataToLocalStorage(testUser, testVoteToken, testSessionToken)
  
  console.log('✅ 测试用户设置成功')
  console.log('用户名:', testUser.username)
  console.log('Token:', testVoteToken)
  console.log('登录状态:', isLogin.value ? '已登录' : '未登录')
  
  return {
    user: testUser,
    voteToken: testVoteToken,
    isLogin: isLogin.value
  }
}

/**
 * 设置角色投票数据
 * 只存储 id + reason + honmei，其他信息从 characterList 中读取
 * @param honmeiName 本命角色名称
 * @param otherNames 其他角色名称数组
 */
export function setupTestCharacterVotes(honmeiName?: string, otherNames: string[] = []) {
  console.log('🔧 设置测试角色投票数据...')
  
  // 清空现有数据（使用 Character 类）
  characters.value = new Array(8).fill(null).map(() => new Character())
  
  // 设置本命角色
  if (honmeiName) {
    const honmeiChar = characterList.find(c => c.name.includes(honmeiName))
    if (honmeiChar) {
      const newHonmei = new Character()
      newHonmei.id = honmeiChar.id
      newHonmei.honmei = true
      newHonmei.reason = `奶龙奶龙奶龙奶龙奶龙奶龙奶龙奶龙奶龙奶龙奶龙我是奶龙！`
      characters.value[0] = newHonmei
      console.log(`✅ 设置本命角色: ${honmeiChar.name} (ID: ${honmeiChar.id})`)
    }
  }
  
  // 设置其他角色
  otherNames.forEach((name, index) => {
    if (index >= 7) return // 最多7个普通角色
    const char = characterList.find(c => c.name.includes(name))
    if (char) {
      const newChar = new Character()
      newChar.id = char.id
      newChar.honmei = false
      newChar.reason = '' // 非本命角色不需要 reason
      characters.value[index + 1] = newChar
      console.log(`✅ 设置角色 ${index + 1}: ${char.name} (ID: ${char.id})`)
    }
  })
  
  // 保存到 localStorage
  localStorage.setItem('characters', JSON.stringify(characters.value))
  
  console.log('✅ 角色投票数据设置完成（只存储 id + reason + honmei）')
}

/**
 * 快速设置常见角色投票数据
 */
export function setupQuickTestVotes() {
  console.log('🔧 设置快速测试数据...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置角色投票（博丽灵梦 + 常见角色）
  setupTestCharacterVotes(
    '博丽灵梦', // 本命
    ['雾雨魔理沙', '琪露诺', '十六夜咲夜', '蕾米莉亚', '芙兰朵露', '帕秋莉', '爱丽丝'] // 其他7个
  )
  
  console.log('✅ 快速测试数据设置完成！')
  console.log('💡 现在可以在首页点击头像，使用"导出角色投票为图片"功能了')
}

/**
 * 获取可用的角色列表（用于测试）
 */
export function getAvailableCharacters() {
  const commonCharacters = characterList
    .filter(c => c.name.includes('灵梦') || c.name.includes('魔理沙') || c.name.includes('琪露诺'))
    .slice(0, 20)
  
  console.log('📋 可用角色列表（前20个）:')
  commonCharacters.forEach((char, index) => {
    console.log(`${index + 1}. ${char.name} (ID: ${char.id})`)
  })
  
  return commonCharacters
}

/**
 * 清理所有测试数据
 */
export function clearTestUserData() {
  console.log('🧹 清理测试数据...')
  
  // 禁用开发模式
  disableDevMode()
  
  localStorage.removeItem('user')
  localStorage.removeItem('voteToken')
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('characters')
  localStorage.removeItem('musics')
  localStorage.removeItem('couples')
  localStorage.removeItem('doujins')
  localStorage.removeItem('questionnaireDataLocal')
  
  // 重置状态
  user.value = createDefaultVoter()
  voteToken.value = ''
  
  // 刷新页面
  location.reload()
}

/**
 * 检查当前登录状态
 */
export function checkTestStatus() {
  console.log('📊 当前测试状态:')
  console.log('登录状态:', isLogin.value ? '✅ 已登录' : '❌ 未登录')
  console.log('Token:', voteToken.value || '(空)')
  console.log('用户名:', user.value.username || '(未设置)')
  
  const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]')
  const validCharacters = savedCharacters.filter((c: any) => c.id !== '0')
  console.log('角色投票数量:', validCharacters.length)
  if (validCharacters.length > 0) {
    console.log('已投票角色:', validCharacters.map((c: any) => c.name))
  }
}

// 在控制台暴露全局函数（仅在开发环境）
if (import.meta.env.DEV) {
  ;(window as any).testHelper = {
    setupTestUser,
    setupTestCharacterVotes,
    setupQuickTestVotes,
    getAvailableCharacters,
    clearTestUserData,
    checkTestStatus
  }
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           测试环境辅助工具已加载 ✅                       ║
╚═══════════════════════════════════════════════════════════╝

💡 在控制台使用以下命令:

  testHelper.setupQuickTestVotes()    - 快速设置完整测试数据
  testHelper.setupTestUser()           - 仅设置测试用户
  testHelper.setupTestCharacterVotes('灵梦', ['魔理沙', '琪露诺'])
                                        - 自定义角色投票
  testHelper.getAvailableCharacters()   - 查看可用角色
  testHelper.checkTestStatus()          - 检查当前状态
  testHelper.clearTestUserData()        - 清理测试数据

🎯 快速开始: testHelper.setupQuickTestVotes()
  `)
}