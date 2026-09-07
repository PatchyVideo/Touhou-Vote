/**
 * 导出投票卡片专用的图片 URL 改写。
 *
 * html2canvas 会在克隆出来的节点上以 crossOrigin="anonymous" 重新拉取每张图片，
 * 而 asset.lilywhite.cc 不返回 Access-Control-Allow-Origin —— 直连的话图片加载
 * 失败，导出的卡片里头像会全部空白。所以导图路径下的图一律走同源代理：
 *
 *   本地 dev  packages/vote/vite.config.ts        proxy '/th-assets'
 *   测试机    Dockerfile.vote.template            nginx location /th-assets/
 *   生产      packages/vote/public/vercel.json    rewrite /th-assets/(.*)
 *
 * 三处任缺其一，对应环境的导出图就会缺图；新增部署环境时必须同步补上。
 *
 * static.thwiki.cc 自带 Access-Control-Allow-Origin: *，无需代理即可被 html2canvas
 * 读取；dev 下沿用既有的 /thwiki-assets 代理，省掉一次 308 跳转。
 *
 * 注意本文件只服务导图；页面上普通 <img> 的展示走 assetUrl.ts，仍直连 CDN。
 */

const ASSET_PROXY_PREFIX = '/th-assets'
const ASSET_ORIGIN = 'https://asset.lilywhite.cc'
const THWIKI_ORIGIN = 'https://static.thwiki.cc'

export function getExportAssetUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith(ASSET_ORIGIN)) {
    return ASSET_PROXY_PREFIX + url.slice(ASSET_ORIGIN.length)
  }
  if (import.meta.env.DEV && url.startsWith(THWIKI_ORIGIN)) {
    return '/thwiki-assets' + url.slice(THWIKI_ORIGIN.length)
  }
  return url
}
