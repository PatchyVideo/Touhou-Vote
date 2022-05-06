// Deadline: 2021/5/1 00:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
const deadline = new Date(2022, 4, 15).getTime()
export const deadlineWithTimezoneOffset = deadline - 8 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000
export function voteEnded(): boolean {
  return new Date(deadlineWithTimezoneOffset).getTime() < Date.now()
}
