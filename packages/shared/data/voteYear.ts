export const voteYear = 12

// 本届投票开始时刻——结果站趋势图把后端返回的"小时桶"换算成日历时间的轴起点。
// ⚠️ 必须与后端 Nacos 配置 `VOTE_START_ISO` 保持一致(后端按同一起点分桶),
// 改任何一边都要同步另一边。当前值为测试环境占位窗口(2026-01-01T00:00:00Z),
// 本届正式定档后更新此处 + Nacos 两处。
export const voteStart = new Date(Date.UTC(2026, 0, 1, 0))

// 本届投票对外展示的起止时刻(仅用于导出投票卡片一类的展示文案,不参与投票开关判定
// ——开关仍看 shared/data/time.ts 的 startTime / deadline)。
// ⚠️ 本届定档后三处一起更新:此处、shared/data/time.ts、后端 Nacos `VOTE_START_ISO`。
// 未定档时保持 null,导出卡片会整行隐藏该信息;不要填 "xxxx年xx月xx日" 之类的占位值,
// 那会被直接截进用户分享出去的图片里。
export const voteWindowStart: Date | null = null
export const voteWindowEnd: Date | null = null
