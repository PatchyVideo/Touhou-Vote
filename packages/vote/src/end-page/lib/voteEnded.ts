import { deadline } from '@touhou-vote/shared/data/time'
export const deadlineWithTimezoneOffset = deadline - 8 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000
export function voteEnded(): boolean {
  return new Date(deadlineWithTimezoneOffset).getTime() < Date.now()
}
