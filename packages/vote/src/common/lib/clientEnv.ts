/**
 * 浏览器环境指纹（反刷票取证信号，B-046）。
 *
 * 采集 JS 侧能拿到、请求头拿不到的环境属性：时区 / 屏幕 / 语言，随投票上报，
 * 后端并入 client_env（再补上服务端从请求头取的 User-Agent）。
 * 用途：浏览器时区 vs IP 地理不符（经典代理信号）、默认分辨率等。
 * 仅取证记录、非拦截门；不采集鼠标轨迹/击键等敏感数据。
 */

/** 返回环境属性的 JSON 字符串（供 GraphQL clientEnv 字段上报）；出错返回 null。 */
export function getClientEnv(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const screenStr = `${screen.width}x${screen.height}@${window.devicePixelRatio || 1}`
    const lang = navigator.language || (navigator.languages && navigator.languages[0]) || ''
    return JSON.stringify({ tz, screen: screenStr, lang })
  } catch {
    return null
  }
}
