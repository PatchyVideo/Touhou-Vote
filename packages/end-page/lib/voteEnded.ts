export const deadline = '2022/1/31'
export function voteEnded(): boolean {
  let now = new Date().getTime()
  let ddl = new Date(deadline)
  let ddltime = ddl.getTime()
  return ddltime < now
}
