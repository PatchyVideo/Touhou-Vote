/**
 * 填写耗时（反刷票取证信号，B-045）。
 *
 * 计时：某个投票类别页面挂载 → 点提交的墙钟毫秒数，随提交上报，后端落库到
 * raw_*.fill_duration_ms。机器人直接打 GraphQL 不跑前端 → 值为 null（本身即信号）；
 * 真人从打开到提交至少若干秒。仅作取证记录、非拦截门；改票的假阳性由后端
 * 服务端计算的 attempt 计数兜底（首次=1、改票≥2，分析时只对首次判"太快"）。
 *
 * 用墙钟差值（相对量），不上报绝对时间戳——客户端时间不可信。
 */

const startedAt: Record<string, number> = {}

/** 页面挂载时调用，(重新)开始该类别的计时。 */
export function startFillTimer(category: string): void {
  startedAt[category] = Date.now()
}

/** 返回自挂载以来的毫秒数；未计时（如极老缓存）返回 null。 */
export function readFillDuration(category: string): number | null {
  const t = startedAt[category]
  return t === undefined ? null : Date.now() - t
}
