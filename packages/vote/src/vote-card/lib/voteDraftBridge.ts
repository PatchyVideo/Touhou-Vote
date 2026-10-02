import { ref } from 'vue'
import type { Department } from './types'
export const draftRevision = ref(0)
const readers = new Map<Department, { scope: string; read: () => unknown; reset: () => void }>()
export function credentialScope(): string {
  return `${localStorage.getItem('sessionToken') || ''}|${localStorage.getItem('voteToken') || ''}`
}
export function registerVoteDraft(department: Department, read: () => unknown, reset: () => void): void {
  readers.set(department, { scope: credentialScope(), read, reset })
  draftRevision.value++
}
export function getVoteDraftReader(department: Department): (() => unknown) | undefined {
  const reader = readers.get(department)
  return reader?.scope === credentialScope() ? reader.read : undefined
}
export function clearVoteDraftReaders(): void {
  readers.forEach((reader) => reader.reset())
  readers.clear()
  draftRevision.value++
}
