// Strat Time: 2021/6/17 18:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
export const startTime = new Date(2023, 5, 17, 18).getTime()
// Deadline: 2021/7/5 00:00:00 UTC+8
// Notice that month start at "0", not "1", so January is "0"
export const deadline = new Date(2023, 11, 5).getTime()
export function timeFormat(date: Date): string {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ': 00'
}
export const startTimeString = timeFormat(new Date(startTime))
export const deadlineString = timeFormat(new Date(deadline))
