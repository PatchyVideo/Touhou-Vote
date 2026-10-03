import { checkExportImage, mapExportResources } from '@/common/lib/checkExportImage'
import defaultCharacter from '@/vote-character/assets/defaultCharacterImage.png'
import defaultMusic from '@/vote-music/assets/defaultMusicImage.jpg'
import qr from '../assets/vote-qr.svg'
import type { CardEntry, Department } from './types'

/** Mutate only the task's private snapshot; CP member positions remain distinct. */
export async function prepareVoteCardImages(
  snapshot: { department: Department; entries: CardEntry[]; showQr: boolean },
  onFailure: () => void
) {
  const fallback = snapshot.department === 'music' ? defaultMusic : defaultCharacter
  const resources: { image?: string }[] =
    snapshot.department === 'cp' ? snapshot.entries.flatMap((e) => e.members) : snapshot.entries
  const checks = new Map<string, Promise<void>>()
  const check = (url: string) => {
    if (!checks.has(url)) checks.set(url, checkExportImage(url))
    return checks.get(url)!
  }
  let failed = false
  await mapExportResources(resources, async (resource) => {
    try {
      await check(resource.image || '')
    } catch {
      if (!failed) onFailure()
      failed = true
      await check(fallback)
      resource.image = fallback
    }
  })
  if (snapshot.showQr) await check(qr)
  return failed
}
