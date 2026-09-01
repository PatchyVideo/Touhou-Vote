export const voteYear = 12

// 本届投票开始时刻——结果站趋势图把后端返回的"小时桶"换算成日历时间的轴起点。
// ⚠️ 必须与后端 Nacos 配置 `VOTE_START_ISO` 保持一致(后端按同一起点分桶),
// 改任何一边都要同步另一边。当前值为测试环境占位窗口(2026-01-01T00:00:00Z),
// 本届正式定档后更新此处 + Nacos 两处。
export const voteStart = new Date(Date.UTC(2026, 0, 1, 0))
