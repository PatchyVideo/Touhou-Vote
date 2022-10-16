import { startTime } from '@touhou-vote/shared/data/time'
export const startTimeWithTimezoneOffset = Math.abs(
  startTime - 8 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000
)
export function voteNotStart(): boolean {
  return new Date(startTimeWithTimezoneOffset).getTime() > Date.now()
}
