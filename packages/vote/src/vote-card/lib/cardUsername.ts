import { graphemeSegments } from 'unicode-segmenter/grapheme'
export function truncateUsername(value: string): string {
  return Array.from(graphemeSegments(value))
    .slice(0, 20)
    .map(({ segment }) => segment)
    .join('')
}
export function customUsername(value: string): string | undefined {
  const result = truncateUsername(value)
  return result.trim() ? result : undefined
}
export function defaultUsername(profile: {
  username?: string | null
  phone?: string | null
  email?: string | null
}): string {
  const value = [profile.username, profile.phone?.slice(-4), profile.email, '匿名用户'].find((v) => v?.trim())!
  return truncateUsername(value)
}
