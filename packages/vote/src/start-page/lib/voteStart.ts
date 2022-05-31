// Strat Time: 2021/6/17 18:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
const startTime = new Date(2022, 5, 17, 18).getTime()
export const startTimeWithTimezoneOffset = Math.abs(
  startTime - 8 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000
)
export function voteNotStart(): boolean {
  return new Date(startTimeWithTimezoneOffset).getTime() > Date.now()
}
