import { voteYear } from '../data/voteYear'

export function setSiteTitle(title = ''): void {
  document.title = title + (title && ' - ') + `第${voteYear}回 中文东方人气投票`
}
