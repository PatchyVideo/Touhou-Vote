/**
 * 测试错误处理功能
 * 
 * 此文件用于测试不同错误场景下的系统行为
 * 
 * 测试场景：
 * 1. 无效的 token - 应该显示 "无效的 voteToken，请检查您的登录状态"
 * 2. 网络错误 - 应该显示 "网络连接失败，请检查网络连接"
 * 3. 服务器错误 - 应该显示具体的错误信息
 * 4. GraphQL 模式下失败 - 应该显示错误提示并回退到本地数据
 * 5. Local 模式下 - 不应该显示网络相关的错误
 */

import { setDataSourceMode, getDataSourceMode, fetchVoteData } from './voteDataSource'
import { setupTestUser, setupQuickTestVotes } from './testHelper'
import { voteToken } from '@/home/lib/user'

/**
 * 测试 1: 使用无效的 token 尝试获取 GraphQL 数据
 */
export async function testInvalidTokenError() {
  console.log('\n=== 测试 1: 无效 Token 错误 ===')
  
  // 设置测试用户（使用无效 token）
  setupTestUser()
  
  // 设置一个明显无效的 token
  voteToken.value = 'invalid_test_token_12345'
  
  // 设置为 GraphQL 模式
  setDataSourceMode('graphql')
  
  console.log('当前模式:', getDataSourceMode())
  console.log('Token:', voteToken.value)
  
  // 尝试获取数据
  const result = await fetchVoteData('character')
  
  console.log('结果:')
  console.log('- 数据:', result.data ? '获取成功' : '获取失败')
  console.log('- 错误:', result.error)
  console.log('- 使用的模式:', result.usedMode)
  
  return result
}

/**
 * 测试 2: 设置本地数据，然后尝试 GraphQL
 */
export async function testLocalDataFallback() {
  console.log('\n=== 测试 2: 本地数据回退 ===')
  
  // 设置测试数据
  setupQuickTestVotes()
  
  // 设置为 GraphQL 模式（但 token 可能无效）
  setDataSourceMode('graphql')
  
  console.log('当前模式:', getDataSourceMode())
  console.log('本地数据已设置')
  
  // 尝试获取数据
  const result = await fetchVoteData('character')
  
  console.log('结果:')
  console.log('- 数据:', result.data ? '获取成功' : '获取失败')
  console.log('- 错误:', result.error)
  console.log('- 使用的模式:', result.usedMode)
  
  return result
}

/**
 * 测试 3: 使用本地模式
 */
export async function testLocalMode() {
  console.log('\n=== 测试 3: 本地模式 ===')
  
  // 设置测试数据
  setupQuickTestVotes()
  
  // 设置为 local 模式
  setDataSourceMode('local')
  
  console.log('当前模式:', getDataSourceMode())
  
  // 获取数据
  const result = await fetchVoteData('character')
  
  console.log('结果:')
  console.log('- 数据:', result.data ? '获取成功' : '获取失败')
  console.log('- 错误:', result.error)
  console.log('- 使用的模式:', result.usedMode)
  
  return result
}

/**
 * 测试 4: 使用 auto 模式
 */
export async function testAutoMode() {
  console.log('\n=== 测试 4: 自动模式 ===')
  
  // 设置测试数据
  setupQuickTestVotes()
  
  // 设置为 auto 模式
  setDataSourceMode('auto')
  
  console.log('当前模式:', getDataSourceMode())
  
  // 获取数据
  const result = await fetchVoteData('character')
  
  console.log('结果:')
  console.log('- 数据:', result.data ? '获取成功' : '获取失败')
  console.log('- 错误:', result.error)
  console.log('- 使用的模式:', result.usedMode)
  
  return result
}

/**
 * 运行所有测试
 */
export async function runAllErrorTests() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║           开始错误处理测试                               ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  
  try {
    await testInvalidTokenError()
    await testLocalDataFallback()
    await testLocalMode()
    await testAutoMode()
    
    console.log('\n╔═══════════════════════════════════════════════════════════╗')
    console.log('║           所有测试完成                                     ║')
    console.log('╚═══════════════════════════════════════════════════════════╝')
  } catch (error) {
    console.error('测试过程中出错:', error)
  }
}

// 在开发环境中暴露到全局
if (import.meta.env.DEV) {
  ;(window as any).errorTests = {
    testInvalidTokenError,
    testLocalDataFallback,
    testLocalMode,
    testAutoMode,
    runAllErrorTests
  }
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           错误处理测试工具已加载 ✅                       ║
╚═══════════════════════════════════════════════════════════╝

💡 在控制台使用以下命令测试错误处理:

  errorTests.testInvalidTokenError()    - 测试无效 token 错误
  errorTests.testLocalDataFallback()    - 测试本地数据回退
  errorTests.testLocalMode()            - 测试本地模式
  errorTests.testAutoMode()             - 测试自动模式
  errorTests.runAllErrorTests()         - 运行所有测试

🎯 快速测试: errorTests.runAllErrorTests()
  `)
}
