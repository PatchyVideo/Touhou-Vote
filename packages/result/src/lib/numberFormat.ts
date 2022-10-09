export function toPercentageString(num: number): string {
  return (num * 100).toFixed(2) + '%'
}
export function toTimeFormat(time: string): string {
  time = time.slice(0, 4) + '/' + time.slice(4)
  time = time.slice(0, 7) + '/' + time.slice(7)
  return time
}
