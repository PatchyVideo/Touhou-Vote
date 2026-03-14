/**
 * 测试环境辅助工具
 * 
 * 注意：仅用于开发和测试环境，生产环境不要使用
 * 
 * 使用方式：
 * 1. 在浏览器控制台中调用 setupTestUser()
 * 2. 或者直接访问 /test 页面使用测试工具
 * 
 * 新增功能：
 * - 支持设置数据源模式（localStorage / GraphQL / auto）
 * - 通过 setDataSourceMode() 控制数据获取方式
 */

import { voteToken, isLogin, setUserDataToLocalStorage, user, createDefaultVoter, enableDevMode, disableDevMode } from '@/home/lib/user'
import { characters } from '@/vote-character/lib/voteData'
import { characterList } from '@/vote-character/lib/characterList'
import { Character } from '@/vote-character/lib/character'
import { couples, CPVOTENUM } from '@/vote-couple/lib/voteData'
import { Couple } from '@/vote-couple/lib/couple'
import { musics, MUSICVOTENUM } from '@/vote-music/lib/voteData'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import { setDataSourceMode, getDataSourceMode, type DataSourceMode } from './voteDataSource'

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
    if (index >= 9) return // 最多9个普通角色
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
  console.log('🔧 设置快速角色测试数据...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置角色投票（博丽灵梦 + 常见角色）
  setupTestCharacterVotes(
    '博丽灵梦', // 本命
    ['雾雨魔理沙', '琪露诺', '十六夜咲夜', '蕾米莉亚', '芙兰朵露', '帕秋莉', '爱丽丝'] // 其他7个
  )
  
  console.log('✅ 快速角色测试数据设置完成！')
  console.log('💡 现在可以在首页点击头像，使用"导出角色投票为图片"功能了')
}

/**
 * 设置音乐投票数据
 * 只存储 id + reason + honmei，其他信息从 musicList 中读取
 * @param honmeiName 本命音乐名称
 * @param otherNames 其他音乐名称数组
 */
export function setupTestMusicVotes(honmeiName?: string, otherNames: string[] = []) {
  console.log('🔧 设置测试音乐投票数据...')

  // 清空现有数据（使用 Music 类）
  musics.value = new Array(MUSICVOTENUM).fill(null).map(() => new Music())

  // 设置本命音乐
  if (honmeiName) {
    const honmeiMusic = musicList.find(m => m.name.includes(honmeiName))
    if (honmeiMusic) {
      const newHonmei = new Music()
      newHonmei.id = honmeiMusic.id
      newHonmei.honmei = true
      newHonmei.reason = '因为太好听了，循环播放停不下来！'
      musics.value[0] = newHonmei
      console.log(`✅ 设置本命音乐: ${honmeiMusic.name} (ID: ${honmeiMusic.id})`)
    }
  }

  // 设置其他音乐
  otherNames.forEach((name, index) => {
    if (index >= MUSICVOTENUM - 1) return
    const music = musicList.find(m => m.name.includes(name))
    if (music) {
      const newMusic = new Music()
      newMusic.id = music.id
      newMusic.honmei = false
      newMusic.reason = ''
      musics.value[index + 1] = newMusic
      console.log(`✅ 设置音乐 ${index + 1}: ${music.name} (ID: ${music.id})`)
    }
  })

  // 保存到 localStorage
  localStorage.setItem('musics', JSON.stringify(musics.value))

  console.log('✅ 音乐投票数据设置完成（只存储 id + reason + honmei）')
}

/**
 * 快速设置完整的角色和CP投票数据
 * 同时配置角色投票和CP投票
 */
export function setupAllTestVotes() {
  console.log('🔧 设置完整测试数据（角色 + CP）...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置角色投票（博丽灵梦 + 常见角色）
  setupTestCharacterVotes(
    '博丽灵梦', // 本命
    ['雾雨魔理沙', '琪露诺', '十六夜咲夜', '蕾米莉亚', '芙兰朵露', '帕秋莉', '爱丽丝'] // 其他7个
  )
  
  // 设置CP投票
  setupTestCoupleVotes(
    // 本命CP
    [
      {
        names: ['博丽灵梦', '雾雨魔理沙'],
        active: '博丽灵梦',
        reason: '最经典的组合！永远支持红白组！'
      }
    ],
    // 其他CP
    [
      {
        names: ['琪露诺', '大妖精','八云紫'],
        active: '琪露诺',
        reason: '最强⑨和她的仆从'
      },
      {
        names: ['十六夜咲夜', '蕾米莉亚'],
        active: '十六夜咲夜',
        reason: '红魔馆的日常'
      },
      {
        names: ['西行寺幽幽子', '魂魄妖梦'],
        active: '西行寺幽幽子',
        reason: '主仆关系'
      }
    ]
  )

  // 设置音乐投票
  setupTestMusicVotes(
    '幽雅地绽放吧，墨染的樱花',
    ['U.N.オーエンは彼女なのか？', '上海红茶馆', '亡き王女の为のセプテット']
  )
  
  console.log('✅ 完整测试数据设置完成！')
  console.log('💡 现在可以在首页点击头像，使用"导出角色/CP/音乐投票为图片"功能了')
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
 * 设置CP投票数据
 * @param honmeiCouples 本命CP配置数组 [{names: ['角色1', '角色2'], active: '角色1', reason: '理由'}]
 * @param otherCouples 其他CP配置数组
 */
export function setupTestCoupleVotes(
  honmeiCouples: Array<{ names: string[]; active?: string; reason?: string }> = [],
  otherCouples: Array<{ names: string[]; active?: string; reason?: string }> = []
) {
  console.log('🔧 设置测试CP投票数据...')
  
  // 清空现有CP数据
  couples.value = new Array(CPVOTENUM).fill(null).map(() => new Couple())
  
  const setupCouple = (
    coupleConfig: { names: string[]; active?: string; reason?: string },
    index: number,
    isHonmei: boolean
  ) => {
    const newCouple = new Couple()
    newCouple.honmei = isHonmei
    newCouple.reason = coupleConfig.reason || ''
    
    // 设置角色
    coupleConfig.names.forEach((name, charIndex) => {
      if (charIndex >= 3) return // 最多3个角色
      const char = characterList.find(c => c.name.includes(name))
      if (char) {
        newCouple.characters[charIndex] = char
        console.log(`  ${isHonmei ? '本命' : '其他'}CP[${index}] 角色${charIndex}: ${char.name}`)
      }
    })
    
    // 设置主动方
    if (coupleConfig.active) {
      const activeIndex = newCouple.characters.findIndex(c => c && c.name.includes(coupleConfig.active!))
      if (activeIndex >= 0) {
        newCouple.seme = activeIndex
        console.log(`  ${isHonmei ? '本命' : '其他'}CP[${index}] 主动方: ${coupleConfig.active} (索引${activeIndex})`)
      }
    }
    
    newCouple.valid = true
    return newCouple
  }
  
  // 设置本命CP（第一个）
  if (honmeiCouples.length > 0) {
    const honmeiCouple = setupCouple(honmeiCouples[0], 0, true)
    couples.value[0] = honmeiCouple
    console.log(`✅ 设置本命CP: ${honmeiCouple.characters.map(c => c?.name).join(' × ')}`)
  }
  
  // 设置其他CP
  let otherIndex = honmeiCouples.length > 0 ? 1 : 0
  otherCouples.forEach((config) => {
    if (otherIndex >= CPVOTENUM) return
    const couple = setupCouple(config, otherIndex, false)
    couples.value[otherIndex] = couple
    console.log(`✅ 设置其他CP[${otherIndex}]: ${couple.characters.map(c => c?.name).join(' × ')}`)
    otherIndex++
  })
  
  // 保存到 localStorage
  localStorage.setItem('couples', JSON.stringify(couples.value))
  
  console.log('✅ CP投票数据设置完成')
}

/**
 * 快速设置常见CP投票数据
 */
export function setupQuickTestCoupleVotes() {
  console.log('🔧 设置快速CP测试数据...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置CP投票
  setupTestCoupleVotes(
    // 本命CP
    [
      {
        names: ['博丽灵梦', '雾雨魔理沙'],
        active: '博丽灵梦',
        reason: '最经典的组合！永远支持红白组！'
      }
    ],
    // 其他CP
    [
      {
        names: ['琪露诺', '大妖精'],
        active: '琪露诺',
        reason: '最强⑨和她的仆从'
      },
      {
        names: ['十六夜咲夜', '蕾米莉亚'],
        active: '十六夜咲夜',
        reason: '红魔馆的日常'
      },
      {
        names: ['西行寺幽幽子', '魂魄妖梦'],
        active: '西行寺幽幽子',
        reason: '主仆关系'
      }
    ]
  )
  
  console.log('✅ 快速CP测试数据设置完成！')
  console.log('💡 现在可以在CP投票页面，使用"导出CP投票为图片"功能了')
}

/**
 * 快速设置常见音乐投票数据
 */
export function setupQuickTestMusicVotes() {
  console.log('🔧 设置快速音乐测试数据...')

  // 模拟登录
  setupTestUser()

  // 设置音乐投票
  setupTestMusicVotes(
    '幽雅地绽放吧，墨染的樱花',
    ['U.N.オーエンは彼女なのか？', '上海红茶馆', '亡き王女の为のセプテット']
  )

  console.log('✅ 快速音乐测试数据设置完成！')
  console.log('💡 现在可以在音乐投票页面，使用"导出音乐投票为图片"功能了')
}

/**
 * 获取可用的音乐列表（用于测试）
 */
export function getAvailableMusics() {
  const commonMusics = musicList
    .filter(m => m.name.includes('红魔') || m.name.includes('樱花') || m.name.includes('月'))
    .slice(0, 20)

  console.log('📋 可用音乐列表（前20个）:')
  commonMusics.forEach((music, index) => {
    console.log(`${index + 1}. ${music.name} (ID: ${music.id})`)
  })

  return commonMusics
}

/**
 * 获取可用的CP组合示例（用于测试）
 */
export function getAvailableCoupleExamples() {
  const examples = [
    { names: ['博丽灵梦', '雾雨魔理沙'], desc: '红白组' },
    { names: ['琪露诺', '大妖精'], desc: '冰精组' },
    { names: ['十六夜咲夜', '蕾米莉亚'], desc: '红魔馆组' },
    { names: ['西行寺幽幽子', '魂魄妖梦'], desc: '冥界组' },
    { names: ['八云紫', '八云蓝'], desc: '八云组' },
    { names: ['蓬莱山辉夜', '藤原妹红'], desc: '竹取组' },
    { names: ['东风谷早苗', '八坂神奈子'], desc: '守矢组' },
    { names: ['古明地恋', '古明地觉'], desc: '古明地组' }
  ]
  
  console.log('📋 可用CP组合示例:')
  examples.forEach((cp, index) => {
    console.log(`${index + 1}. ${cp.names.join(' × ')} - ${cp.desc}`)
  })
  
  return examples
}

/**
 * 检查当前登录状态
 */
export function checkTestStatus() {
  console.log('📊 当前测试状态:')
  console.log('登录状态:', isLogin.value ? '✅ 已登录' : '❌ 未登录')
  console.log('Token:', voteToken.value || '(空)')
  console.log('用户名:', user.value.username || '(未设置)')
  console.log('数据源模式:', getDataSourceMode())
  
  const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]')
  const validCharacters = savedCharacters.filter((c: any) => c.id !== '0')
  console.log('角色投票数量:', validCharacters.length)
  if (validCharacters.length > 0) {
    console.log('已投票角色:', validCharacters.map((c: any) => c.name))
  }
  
  const savedCouples = JSON.parse(localStorage.getItem('couples') || '[]')
  const validCouples = savedCouples.filter((c: any) => c.valid)
  console.log('CP投票数量:', validCouples.length)
  if (validCouples.length > 0) {
    console.log('已投票CP:', validCouples.map((c: any) => 
      c.characters.filter((char: any) => char.id !== '0').map((char: any) => char.name).join(' × ')
    ))
  }
}

/**
 * 设置数据源模式
 * @param mode 'local' - 使用本地存储 | 'graphql' - 使用 GraphQL | 'auto' - 自动选择
 */
export function setTestDataSourceMode(mode: DataSourceMode) {
  setDataSourceMode(mode)
  console.log(`✅ 数据源模式已设置为: ${mode}`)
}

/**
 * 获取当前数据源模式
 */
export function getTestDataSourceMode(): DataSourceMode {
  const mode = getDataSourceMode()
  console.log(`当前数据源模式: ${mode}`)
  return mode
}

// 在控制台暴露全局函数（仅在开发环境）
if (import.meta.env.DEV) {
  ;(window as any).testHelper = {
    setupTestUser,
    setupTestCharacterVotes,
    setupQuickTestVotes,
    setupTestCoupleVotes,
    setupQuickTestCoupleVotes,
    setupTestMusicVotes,
    setupQuickTestMusicVotes,
    setupAllTestVotes,
    getAvailableCharacters,
    getAvailableMusics,
    getAvailableCoupleExamples,
    clearTestUserData,
    checkTestStatus,
    setDataSourceMode: setTestDataSourceMode,
    getDataSourceMode: getTestDataSourceMode
  }
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           测试环境辅助工具已加载 ✅                       ║
╚═══════════════════════════════════════════════════════════╝

💡 在控制台使用以下命令:

  testHelper.setupAllTestVotes()      - 快速设置完整测试数据（角色+CP）
  testHelper.setupQuickTestVotes()    - 快速设置角色测试数据
  testHelper.setupQuickTestCoupleVotes() - 快速设置CP测试数据
  testHelper.setupTestUser()           - 仅设置测试用户
  testHelper.setupTestCharacterVotes('灵梦', ['魔理沙', '琪露诺'])
                                        - 自定义角色投票
  testHelper.setupTestMusicVotes('樱花', ['红魔', '月'])
                                        - 自定义音乐投票
  testHelper.setupTestCoupleVotes(
      [{names: ['灵梦', '魔理沙'], active: '灵梦', reason: '理由'}],
      [{names: ['琪露诺', '大妖精']}]
    )                          - 自定义CP投票
  testHelper.getAvailableCharacters()   - 查看可用角色
  testHelper.getAvailableMusics()       - 查看可用音乐
  testHelper.getAvailableCoupleExamples() - 查看可用CP示例
  testHelper.checkTestStatus()          - 检查当前状态
  testHelper.clearTestUserData()        - 清理测试数据

🎯 快速开始: 
  testHelper.setupAllTestVotes()         // 一键设置所有测试数据（推荐）
  testHelper.setupQuickTestVotes()       // 仅测试角色投票导出
  testHelper.setupQuickTestCoupleVotes()  // 仅测试CP投票导出
  testHelper.setupQuickTestMusicVotes()  // 仅测试音乐投票导出
  `)
}