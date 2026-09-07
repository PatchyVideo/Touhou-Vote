import { voteYear, voteWindowEnd, voteWindowStart } from '@touhou-vote/shared/data/voteYear'

export { voteYear }

// 投票的官方时区固定为 UTC+8：按用户本地时区格式化会把日期挪掉一天。
const VOTE_TIMEZONE_OFFSET_MS = 8 * 60 * 60 * 1000

function formatVoteDate(date: Date): string {
  const shifted = new Date(date.getTime() + VOTE_TIMEZONE_OFFSET_MS)
  return `${shifted.getUTCFullYear()}年${shifted.getUTCMonth() + 1}月${shifted.getUTCDate()}日`
}

/**
 * 导出投票卡片底部的「投票时间」文案。
 * 本届尚未定档（shared/data/voteYear.ts 里的常量为 null）时返回空串，
 * 调用方据此隐藏整行，避免把占位文字截进用户分享出去的图片。
 */
export const voteWindowText: string =
  voteWindowStart && voteWindowEnd ? `${formatVoteDate(voteWindowStart)}-${formatVoteDate(voteWindowEnd)}` : ''
