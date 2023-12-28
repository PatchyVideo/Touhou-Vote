// Strat Time: 2023/12/29 18:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
export const startTime = new Date(2022, 11, 29, 18).getTime()
// Deadline: 2024/1/15 00:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
export const deadline = new Date(2024, 0, 15).getTime()
export function timeFormat(date: Date): string {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ': 00'
}
export const startTimeString = timeFormat(new Date(startTime))
export const deadlineString = timeFormat(new Date(deadline))
