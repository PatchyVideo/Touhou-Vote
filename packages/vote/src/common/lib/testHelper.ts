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

import {
  voteToken,
  isLogin,
  setUserDataToLocalStorage,
  user,
  createDefaultVoter,
  deleteUserData,
  enableDevMode,
  disableDevMode,
} from '@/home/lib/user'
import { reloadWithBootstrap } from '@/main/lib/appBootstrap'
import type { Voter } from '@/graphql/__generated__/graphql'
import { voteYear } from '@/common/lib/voteYear'
import { characters, CHARACTERVOTENUM } from '@/vote-character/lib/voteData'
import { characterList } from '@/vote-character/lib/characterList'
import { Character } from '@/vote-character/lib/character'
import { couples, CPVOTENUM } from '@/vote-couple/lib/voteData'
import { Couple } from '@/vote-couple/lib/couple'
import { musics, MUSICVOTENUM } from '@/vote-music/lib/voteData'
import { Music } from '@/vote-music/lib/music'
import { musicList } from '@/vote-music/lib/musicList'
import { loadVoteObjects, voteObjectsError } from '@/common/lib/voteObjectsDataSource'
import { setDataSourceMode, getDataSourceMode, type DataSourceMode } from './voteDataSource'

const TEST_LOGIN_SNAPSHOT_KEY = 'thvote_test_login_snapshot'

/**
 * 角色/曲目候选表是从后端拉的（voteObjectsDataSource），在控制台里直接调用这些
 * 工具时多半还没加载。所有按名字找候选的入口都要先过这一步，否则会静默设置出
 * 一份空投票。
 */
async function ensureVoteObjects(): Promise<void> {
  await loadVoteObjects()
  if (voteObjectsError.value) {
    throw new Error(`投票候选表加载失败：${voteObjectsError.value}`)
  }
}

/**
 * 按名字在候选表里找一项。后端的 `name` 是中文译名、`origname` 是日文原名，
 * 两边都试一次；找不到就出声——静默跳过正是这些默认曲名过期了好几个月都没人
 * 发现的原因。
 */
function findByName<T extends { name: string; origname?: string }>(
  list: T[],
  keyword: string,
  what: string
): T | undefined {
  const hit =
    list.find((item) => item.name.includes(keyword)) ??
    list.find((item) => item.origname?.includes(keyword))
  if (!hit) console.warn(`⚠️ 候选表里没有${what}「${keyword}」，这一票会被跳过`)
  return hit
}

interface TestLoginSnapshot {
  user: Voter
  voteToken: string
  sessionToken: string
  savedAt: string
}

interface TestLoginSnapshotSummary {
  username: string | null
  savedAt: string
}

function parseUser(rawUser: string): Voter {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawUser)
  } catch {
    throw new Error('当前登录用户数据已损坏，无法保存测试 token')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || Object.keys(parsed).length === 0) {
    throw new Error('当前登录用户数据无效，无法保存测试 token')
  }
  return parsed as Voter
}

function readLoginSnapshot(): TestLoginSnapshot {
  const rawSnapshot = localStorage.getItem(TEST_LOGIN_SNAPSHOT_KEY)
  if (!rawSnapshot) throw new Error('未找到已保存的测试登录 token')

  let parsed: unknown
  try {
    parsed = JSON.parse(rawSnapshot)
  } catch {
    throw new Error('已保存的测试登录 token 快照已损坏')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('已保存的测试登录 token 快照无效')
  }

  const snapshot = parsed as Partial<TestLoginSnapshot>
  if (
    !snapshot.user ||
    typeof snapshot.user !== 'object' ||
    Array.isArray(snapshot.user) ||
    Object.keys(snapshot.user).length === 0
  ) {
    throw new Error('已保存的测试登录 token 快照缺少用户数据')
  }
  if (typeof snapshot.voteToken !== 'string' || !snapshot.voteToken) {
    throw new Error('已保存的测试登录 token 快照缺少 voteToken')
  }
  if (typeof snapshot.sessionToken !== 'string' || !snapshot.sessionToken) {
    throw new Error('已保存的测试登录 token 快照缺少 sessionToken')
  }
  if (typeof snapshot.savedAt !== 'string' || Number.isNaN(Date.parse(snapshot.savedAt))) {
    throw new Error('已保存的测试登录 token 快照缺少有效保存时间')
  }
  return snapshot as TestLoginSnapshot
}

/** 将当前真实登录结果保存为开发测试快照。 */
export function saveLoginTokens(): TestLoginSnapshotSummary {
  const rawUser = localStorage.getItem('user')
  const storedVoteToken = localStorage.getItem('voteToken')
  const storedSessionToken = localStorage.getItem('sessionToken')
  if (!rawUser || !storedVoteToken || !storedSessionToken) {
    throw new Error('当前没有完整的真实登录数据，无法保存测试 token')
  }

  const storedUser = parseUser(rawUser)
  const snapshot: TestLoginSnapshot = {
    user: storedUser,
    voteToken: storedVoteToken,
    sessionToken: storedSessionToken,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(TEST_LOGIN_SNAPSHOT_KEY, JSON.stringify(snapshot))

  const summary = { username: storedUser.username, savedAt: snapshot.savedAt }
  console.log('✅ 测试登录 token 已保存', summary)
  return summary
}

/** 恢复登录输入状态并 reload，后续请求由应用启动逻辑自动触发。 */
export async function loginWithSavedTokens(): Promise<void> {
  const snapshot = readLoginSnapshot()
  await reloadWithBootstrap(() => {
    deleteUserData()
    setUserDataToLocalStorage({ ...snapshot.user }, snapshot.voteToken, snapshot.sessionToken)
    console.log('✅ 已恢复测试登录 token，正在重新加载', {
      username: snapshot.user.username,
      savedAt: snapshot.savedAt,
    })
  })
}

/** 幂等删除已保存的开发测试登录快照。 */
export function clearSavedLoginTokens(): void {
  const snapshotExisted = localStorage.getItem(TEST_LOGIN_SNAPSHOT_KEY) !== null
  localStorage.removeItem(TEST_LOGIN_SNAPSHOT_KEY)
  console.log(snapshotExisted ? '✅ 已清除测试登录 token' : 'ℹ️ 没有需要清除的测试登录 token')
}

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
 * 设置角色投票数据。
 * 存整份候选对象 + honmei/reason，和线上 `updateVoteCharacters` 的形状一致，
 * 这样投票页也能正常显示，而不只是导图能用。
 * @param honmeiName 本命角色名称（中文名或日文原名，子串匹配）
 * @param otherNames 其他角色名称数组
 */
export async function setupTestCharacterVotes(honmeiName?: string, otherNames: string[] = []) {
  console.log('🔧 设置测试角色投票数据...')
  await ensureVoteObjects()

  // 清空现有数据（空位是默认 Character，id 为 '00000000'）
  characters.value = new Array(CHARACTERVOTENUM).fill(null).map(() => new Character())

  // 设置本命角色
  if (honmeiName) {
    const honmeiChar = findByName(characterList.value, honmeiName, '角色')
    if (honmeiChar) {
      characters.value[0] = { ...honmeiChar, honmei: true, reason: '第一次见到她的时候，弹幕已经铺满了整个屏幕。' }
      console.log(`✅ 设置本命角色: ${honmeiChar.name} (ID: ${honmeiChar.id})`)
    }
  }

  // 设置其他角色
  otherNames.forEach((name, index) => {
    if (index + 1 >= CHARACTERVOTENUM) return
    const char = findByName(characterList.value, name, '角色')
    if (char) {
      // 非本命角色不需要 reason
      characters.value[index + 1] = { ...char, honmei: false, reason: '' }
      console.log(`✅ 设置角色 ${index + 1}: ${char.name} (ID: ${char.id})`)
    }
  })

  // 保存到 localStorage
  localStorage.setItem('characters', JSON.stringify(characters.value))

  console.log('✅ 角色投票数据设置完成')
}

/**
 * 快速设置常见角色投票数据
 */
export async function setupQuickTestVotes() {
  console.log('🔧 设置快速角色测试数据...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置角色投票（博丽灵梦 + 常见角色）
  await setupTestCharacterVotes(
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
export async function setupTestMusicVotes(honmeiName?: string, otherNames: string[] = []) {
  console.log('🔧 设置测试音乐投票数据...')
  await ensureVoteObjects()

  // 清空现有数据（空位是默认 Music，id 为 '00000000'）
  musics.value = new Array(MUSICVOTENUM).fill(null).map(() => new Music())

  // 设置本命音乐
  if (honmeiName) {
    const honmeiMusic = findByName(musicList.value, honmeiName, '曲目')
    if (honmeiMusic) {
      musics.value[0] = { ...honmeiMusic, honmei: true, reason: '因为太好听了，循环播放停不下来！' }
      console.log(`✅ 设置本命音乐: ${honmeiMusic.name} (ID: ${honmeiMusic.id})`)
    }
  }

  // 设置其他音乐
  otherNames.forEach((name, index) => {
    if (index + 1 >= MUSICVOTENUM) return
    const music = findByName(musicList.value, name, '曲目')
    if (music) {
      musics.value[index + 1] = { ...music, honmei: false, reason: '' }
      console.log(`✅ 设置音乐 ${index + 1}: ${music.name} (ID: ${music.id})`)
    }
  })

  // 保存到 localStorage
  localStorage.setItem('musics', JSON.stringify(musics.value))

  console.log('✅ 音乐投票数据设置完成')
}

/**
 * 一键设置角色 + CP + 音乐三份投票数据。
 */
export async function setupAllTestVotes() {
  console.log('🔧 设置完整测试数据（角色 + CP + 音乐）...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置角色投票（博丽灵梦 + 常见角色）
  await setupTestCharacterVotes(
    '博丽灵梦', // 本命
    ['雾雨魔理沙', '琪露诺', '十六夜咲夜', '蕾米莉亚', '芙兰朵露', '帕秋莉', '爱丽丝'] // 其他7个
  )
  
  // 设置CP投票
  await setupTestCoupleVotes(
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
  await setupTestMusicVotes(
    '幽雅地绽放吧，墨染的樱花',
    ['U.N.OWEN就是她吗？', '上海红茶馆', '献给已逝公主的七重奏']
  )
  
  console.log('✅ 完整测试数据设置完成！')
  console.log('💡 现在可以在首页点击头像，使用"导出角色/CP/音乐投票为图片"功能了')
}

/**
 * 获取可用的角色列表（用于测试）
 */
export async function getAvailableCharacters() {
  await ensureVoteObjects()
  const commonCharacters = characterList.value
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
  clearSavedLoginTokens()
  
  localStorage.removeItem('user')
  localStorage.removeItem('voteToken')
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('characters')
  localStorage.removeItem('musics')
  localStorage.removeItem('couples')
  localStorage.removeItem('doujins')
  localStorage.removeItem('questionnaireDataLocal')
  localStorage.removeItem('questionnaireDataLocalV2')
  sessionStorage.removeItem(`voteObjectsCharacters:${voteYear}`)
  sessionStorage.removeItem(`voteObjectsMusic:${voteYear}`)

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
export async function setupTestCoupleVotes(
  honmeiCouples: Array<{ names: string[]; active?: string; reason?: string }> = [],
  otherCouples: Array<{ names: string[]; active?: string; reason?: string }> = []
) {
  console.log('🔧 设置测试CP投票数据...')
  await ensureVoteObjects()

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
      const char = findByName(characterList.value, name, '角色')
      if (char) {
        newCouple.characters[charIndex] = { ...char }
        console.log(`  ${isHonmei ? '本命' : '其他'}CP[${index}] 角色${charIndex}: ${char.name}`)
      }
    })
    
    // 设置主动方
    if (coupleConfig.active) {
      const activeIndex = newCouple.characters.findIndex(
        (c) => c && (c.name.includes(coupleConfig.active!) || c.origname?.includes(coupleConfig.active!))
      )
      if (activeIndex >= 0) {
        newCouple.seme = activeIndex
        console.log(`  ${isHonmei ? '本命' : '其他'}CP[${index}] 主动方: ${coupleConfig.active} (索引${activeIndex})`)
      } else {
        console.warn(`⚠️ CP[${index}] 的主动方「${coupleConfig.active}」不在这组角色里，按未指定处理`)
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
export async function setupQuickTestCoupleVotes() {
  console.log('🔧 设置快速CP测试数据...')
  
  // 模拟登录
  setupTestUser()
  
  // 设置CP投票
  await setupTestCoupleVotes(
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
export async function setupQuickTestMusicVotes() {
  console.log('🔧 设置快速音乐测试数据...')

  // 模拟登录
  setupTestUser()

  // 设置音乐投票
  await setupTestMusicVotes(
    '幽雅地绽放吧，墨染的樱花',
    ['U.N.OWEN就是她吗？', '上海红茶馆', '献给已逝公主的七重奏']
  )

  console.log('✅ 快速音乐测试数据设置完成！')
  console.log('💡 现在可以在音乐投票页面，使用"导出音乐投票为图片"功能了')
}

/**
 * 获取可用的音乐列表（用于测试）
 */
export async function getAvailableMusics() {
  await ensureVoteObjects()
  const commonMusics = musicList.value
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
    saveLoginTokens,
    loginWithSavedTokens,
    clearSavedLoginTokens,
    clearTestUserData,
    checkTestStatus,
    setDataSourceMode: setTestDataSourceMode,
    getDataSourceMode: getTestDataSourceMode
  }
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           测试环境辅助工具已加载 ✅                       ║
╚═══════════════════════════════════════════════════════════╝

⚠️ 需要候选表的命令都是 async（候选表从后端拉，控制台里直接调时通常还没加载），
   建议加 await；不加也能跑完，只是日志会晚一点出来。

💡 在控制台使用以下命令:

  await testHelper.setupAllTestVotes() - 一键设置完整测试数据（角色+CP+音乐）
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
  testHelper.saveLoginTokens()          - 保存当前真实登录 token
  testHelper.loginWithSavedTokens()     - 恢复已保存 token 并重新加载
  testHelper.clearSavedLoginTokens()    - 清除已保存的测试 token
  testHelper.checkTestStatus()          - 检查当前状态
  testHelper.clearTestUserData()        - 清理测试数据

🎯 快速开始: 
  await testHelper.setupAllTestVotes()        // 一键设置所有测试数据（推荐）
  await testHelper.setupQuickTestVotes()      // 仅测试角色投票导出
  await testHelper.setupQuickTestCoupleVotes() // 仅测试CP投票导出
  await testHelper.setupQuickTestMusicVotes() // 仅测试音乐投票导出

   名字按子串匹配，中文译名和日文原名都行；匹配不到会在控制台 warn，
   不会静默少投一票。
  `)
}
