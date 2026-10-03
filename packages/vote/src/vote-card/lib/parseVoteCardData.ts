import type { Department, ParsedCard, Source } from './types'
export const draftKeys = { role: 'characters', music: 'musics', cp: 'couples' } as const
export function nonemptyId(id: unknown): id is string {
  return typeof id === 'string' && !['', '0', '00000000'].includes(id.trim())
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('投票数据结构异常，请返回投票部门编辑')
  return value as Record<string, unknown>
}
export function parseVoteCardData(department: Department, raw: unknown, source: Source): ParsedCard {
  if (!Array.isArray(raw)) throw new Error('投票数据必须为数组，请返回投票部门编辑')
  const result: ParsedCard = { entries: [], skipped: [] }
  let honmeiCount = 0
  raw.forEach((value, slotIndex) => {
    const item = record(value)
    const first = item[source === 'local' ? 'honmei' : 'first']
    if (typeof first !== 'boolean' || (item.reason != null && typeof item.reason !== 'string'))
      throw new Error('投票字段结构异常，请返回投票部门编辑')
    if (first) honmeiCount++
    const members =
      department === 'cp'
        ? source === 'local'
          ? (() => {
              if (
                !Array.isArray(item.characters) ||
                item.characters.length < 2 ||
                item.characters.length > 3 ||
                !Number.isInteger(item.seme) ||
                Number(item.seme) < -1 ||
                Number(item.seme) > 2
              )
                throw new Error('CP 数据结构异常，请返回 CP 部门编辑')
              return item.characters.map((member, memberIndex) => ({ id: record(member).id, memberIndex }))
            })()
          : [item.idA, item.idB, item.idC ?? ''].map((id, memberIndex) => ({ id, memberIndex }))
        : [{ id: item.id, memberIndex: 0 }]
    if (members.some((member) => typeof member.id !== 'string')) throw new Error('投票 ID 结构异常，请返回投票部门编辑')
    if (source === 'cloud' && department === 'cp' && item.active != null && typeof item.active !== 'string')
      throw new Error('CP 主动方结构异常')
    const selected = members.filter((member): member is { id: string; memberIndex: number } => nonemptyId(member.id))
    if (selected.length < (department === 'cp' ? 2 : 1)) {
      if (selected.length) result.skipped.push({ slotIndex, reason: 'CP 至少需要两位成员，已跳过未填完整票位' })
      return
    }
    const activeIndex =
      department !== 'cp'
        ? -1
        : source === 'local'
        ? Number(item.seme)
        : members.findIndex((member) => nonemptyId(item.active) && member.id === item.active)
    result.entries.push({
      slotIndex,
      id: selected[0].id,
      isHonmei: first,
      reason: String(item.reason ?? ''),
      members: selected,
      activeIndex,
    })
  })
  if (honmeiCount > 1) throw new Error('同一部门有多个本命，请返回投票部门修复')
  if (result.entries.length > { role: 8, music: 12, cp: 4 }[department])
    throw new Error('已填好条目超过部门名额，请返回投票部门修复')
  result.entries.sort((a, b) => Number(b.isHonmei) - Number(a.isHonmei) || a.slotIndex - b.slotIndex)
  return result
}
export function readLocalDraft(
  department: Department,
  storage: Pick<Storage, 'getItem'>,
  reader?: () => unknown
): { state: 'present' | 'absent'; raw: unknown[] } {
  const stored = reader ? reader() : storage.getItem(draftKeys[department])
  const raw: unknown = reader ? stored : stored === null ? [] : JSON.parse(String(stored))
  parseVoteCardData(department, raw, 'local')
  return { state: (raw as unknown[]).length ? 'present' : 'absent', raw: raw as unknown[] }
}
