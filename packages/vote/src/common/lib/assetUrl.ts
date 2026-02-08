/**
 * 资源 URL 处理工具
 * 
 * 
 * 开发环境代理说明：
 * - 第三方服务器 asset.lilywhite.cc 禁止跨域请求
 * - 开发环境下，我们通过 Vite 代理将 /th-assets 路径代理到 https://asset.lilywhite.cc
 * - 这样可以避免 CORS 错误，同时保持生产环境的灵活性
 * 
 * 代理配置位置：packages/vote/vite.config.ts
 * 
 * 使用方式：
 * - 原始 URL: https://asset.lilywhite.cc/character/1.png
 * - 开发环境: /th-assets/character/1.png (通过代理)
 * - 生产环境: https://asset.lilywhite.cc/character/1.png (直接请求)
 * 
 * 注意：
 * - 此代理仅在开发环境 (npm run dev) 生效
 * - 生产环境构建后，使用完整的原始 URL
 * - 使用此工具函数可以自动处理环境差异
 */

/**
 * 将完整的 asset.lilywhite.cc URL 转换为适合当前环境的 URL
 * 
 * @param url - 原始 URL，例如：https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png
 * @returns 适合当前环境的 URL
 * 
 * @example
 * // 开发环境
 * getAssetUrl('https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png')
 * // 返回: '/th-assets/thvote/imgs/nav/character@100px.png'
 * 
 * // 生产环境
 * getAssetUrl('https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png')
 * // 返回: 'https://asset.lilywhite.cc/thvote/imgs/nav/character@100px.png'
 */
export function getAssetUrl(url: string): string {
  // 如果不是 asset.lilywhite.cc 的 URL，直接返回
  if (!url.includes('asset.lilywhite.cc')) {
    return url
  }

  // 开发环境：使用代理路径
  if (import.meta.env.DEV) {
    // 将 https://asset.lilywhite.cc 替换为 /th-assets
    return url.replace('https://asset.lilywhite.cc', '/th-assets')
  }

  // 生产环境：直接使用原始 URL
  return url
}

/**
 * 批量处理资源 URL
 * 
 * @param urls - URL 数组
 * @returns 处理后的 URL 数组
 */
export function getAssetUrls(urls: string[]): string[] {
  return urls.map(getAssetUrl)
}