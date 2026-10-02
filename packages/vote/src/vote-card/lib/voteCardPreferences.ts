import { customUsername } from './cardUsername'
export interface CardPreferences {
  version: 1
  customUsername?: string
  showReason: boolean
  showQr: boolean
}
export const preferenceKey = (account: string) => `thvote:vote-card:preferences:v1:${account}`
export function parsePreferences(raw: string | null): CardPreferences {
  const defaults: CardPreferences = { version: 1, showReason: false, showQr: true }
  try {
    const value = JSON.parse(raw || 'null')
    if (!value || value.version !== 1) return defaults
    return {
      version: 1,
      customUsername: typeof value.customUsername === 'string' ? customUsername(value.customUsername) : undefined,
      showReason: typeof value.showReason === 'boolean' ? value.showReason : false,
      showQr: typeof value.showQr === 'boolean' ? value.showQr : true,
    }
  } catch {
    return defaults
  }
}
const memory = new Map<string, CardPreferences>()
const dirty = new Set<string>()
export function readPreferences(
  account: string,
  storage: Pick<Storage, 'getItem'>
): { value: CardPreferences; failed: boolean } {
  if (dirty.has(account)) return { value: memory.get(account)!, failed: true }
  try {
    const value = parsePreferences(storage.getItem(preferenceKey(account)))
    memory.set(account, value)
    return { value, failed: false }
  } catch {
    return { value: memory.get(account) || parsePreferences(null), failed: true }
  }
}
export function writePreferences(
  account: string,
  patch: Partial<CardPreferences>,
  storage: Pick<Storage, 'getItem' | 'setItem'>
) {
  const latest = readPreferences(account, storage)
  const value = { ...latest.value, ...patch, version: 1 as const }
  memory.set(account, value)
  try {
    storage.setItem(preferenceKey(account), JSON.stringify(value))
    dirty.delete(account)
    return { value, failed: latest.failed }
  } catch {
    dirty.add(account)
    return { value, failed: true }
  }
}

export function syncPreferences(account: string, raw: string | null): CardPreferences {
  const value = parsePreferences(raw)
  memory.set(account, value)
  dirty.delete(account)
  return value
}
