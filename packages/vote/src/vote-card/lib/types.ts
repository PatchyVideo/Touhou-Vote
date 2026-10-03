export const departments = ['role', 'music', 'cp'] as const
export type Department = (typeof departments)[number]
export type Source = 'local' | 'cloud'
export interface CardMember {
  id: string
  memberIndex: number
  name?: string
  image?: string
  works?: string[]
  color?: string
}
export interface CardEntry {
  slotIndex: number
  id: string
  isHonmei: boolean
  reason: string
  members: CardMember[]
  activeIndex: number
  name?: string
  origname?: string
  album?: string
  image?: string
  works?: string[]
  color?: string
}
export interface ParsedCard {
  entries: CardEntry[]
  skipped: { slotIndex: number; reason: string }[]
}
export interface DepartmentState extends ParsedCard {
  status: 'loading' | 'ready' | 'empty' | 'error'
  source?: Source
  error?: string
}
