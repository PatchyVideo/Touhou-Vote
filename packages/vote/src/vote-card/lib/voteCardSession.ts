import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { createApollo, gql } from '@/graphql'
import { sessionToken, voteToken } from '@/home/lib/user'
import { voteYear } from '@/common/lib/voteYear'
import {
  characterGroupsRaw,
  characterListFromBackend,
  loadCharacterVoteObjects,
  loadMusicVoteObjects,
  musicFilterMeta,
  musicGroupsRaw,
} from '@/common/lib/voteObjectsDataSource'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import {
  cardAccess,
  checkCardTime,
  invalidateCardAccess,
  pauseCardForExternalCredentials,
  validateCardAccess,
  withTimeout,
} from './voteCardAccess'
import { clearVoteDraftReaders, credentialScope, draftRevision, getVoteDraftReader } from './voteDraftBridge'
import { draftKeys, parseVoteCardData, readLocalDraft } from './parseVoteCardData'
import { type CardEntry, type Department, type DepartmentState, departments } from './types'
const emptyState = (): DepartmentState => ({ status: 'loading', entries: [], skipped: [] })
export const cardDepartments = reactive<Record<Department, DepartmentState>>({
  role: emptyState(),
  music: emptyState(),
  cp: emptyState(),
})
export const cardVersion = ref(0)
export const cardDepartmentVersions = reactive({ role: 0, music: 0, cp: 0 })
const client = createApollo()
const contracts = {
  role: { root: 'getSubmitCharacterVote', array: 'characters', fields: 'id first reason' },
  music: { root: 'getSubmitMusicVote', array: 'music', fields: 'id first reason' },
  cp: { root: 'getSubmitCPVote', array: 'cps', fields: 'idA idB idC active first reason' },
}
let generation = 0
let consumers = 0
let previousAccount = ''
let previousYear = voteYear
const pending = new Map<Department, Promise<void>>()
const versions = { role: 0, music: 0, cp: 0 }
const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0
function enrich(department: Department, entries: CardEntry[]): CardEntry[] {
  return entries.map((entry) => {
    if (department === 'music') {
      const object = musicGroupsRaw.value
        .flatMap((group) => group.items)
        .find((item) => String(item.candidateId) === entry.id)
      const album = object?.workIds.length
        ? musicFilterMeta.value.works.find((work) => work.workId === object.workIds[0])?.name
        : undefined
      if (!text(object?.name) || !text(album)) throw new Error('所选曲目名称或专辑资料缺失，请重试')
      return {
        ...entry,
        name: object!.name,
        origname: object!.nameJp || '',
        album,
        image: getExportAssetUrl(object!.imageUrl || ''),
        color: '#2563eb',
      }
    }
    const members = entry.members.map((member) => {
      const object = characterListFromBackend.value.find((item) => item.id === member.id)
      if (!text(object?.name) || (department === 'role' && entry.isHonmei && !text(object?.origname)))
        throw new Error('所选角色必要文字资料缺失，请重试')
      return {
        ...member,
        name: object!.name,
        image: getExportAssetUrl(object!.image),
        color: object!.color,
        works: object!.work,
        origname: object!.origname,
      }
    })
    return { ...entry, ...members[0], id: entry.id, members }
  })
}
function publish(department: Department, state: DepartmentState): void {
  if (JSON.stringify(cardDepartments[department]) !== JSON.stringify(state)) {
    cardDepartments[department] = state
    cardVersion.value++
    cardDepartmentVersions[department]++
  }
}
export function loadCardDepartment(department: Department, force = false): Promise<void> {
  if (pending.has(department) && !force) return pending.get(department)!
  const epoch = generation
  const version = ++versions[department]
  const scope = credentialScope()
  const valid = () =>
    generation === epoch && versions[department] === version && scope === credentialScope() && checkCardTime()
  publish(department, emptyState())
  const promise = (async () => {
    try {
      await nextTick()
      if (!valid()) return
      const local = readLocalDraft(department, localStorage, getVoteDraftReader(department))
      const source = local.state === 'present' ? 'local' : 'cloud'
      let raw: unknown = local.raw
      if (source === 'cloud') {
        const contract = contracts[department]
        const result = await withTimeout(
          client.query({
            query: gql(
              `query ($voteToken: String!) { ${contract.root}(voteToken: $voteToken) { ${contract.array} { ${contract.fields} } } }`
            ),
            variables: { voteToken: localStorage.getItem('voteToken') },
            fetchPolicy: 'network-only',
          })
        )
        if (!valid()) return
        if (
          result.errors?.length ||
          !result.data?.[contract.root] ||
          !Array.isArray(result.data[contract.root][contract.array])
        )
          throw new Error('云端投票响应异常，请重试')
        raw = result.data[contract.root][contract.array]
      }
      const parsed = parseVoteCardData(department, raw, source)
      if (!parsed.entries.length) {
        if (valid()) publish(department, { ...parsed, source, status: 'empty' })
        return
      }
      const loadObjects = department === 'music' ? loadMusicVoteObjects : loadCharacterVoteObjects
      const hadCache =
        (department === 'music' ? musicGroupsRaw.value : characterGroupsRaw.value).length > 0 ||
        sessionStorage.getItem(`voteObjects${department === 'music' ? 'Music' : 'Characters'}:${voteYear}:v2`) !== null
      const entries = await withTimeout(
        (async () => {
          await loadObjects()
          if (!valid()) return []
          try {
            return enrich(department, parsed.entries)
          } catch (error) {
            if (!hadCache) throw error
            await loadObjects(true)
            if (!valid()) return []
            return enrich(department, parsed.entries)
          }
        })()
      )
      if (valid()) publish(department, { ...parsed, entries, source, status: 'ready' })
    } catch (error) {
      if (valid()) publish(department, { ...emptyState(), status: 'error', error: (error as Error).message })
    } finally {
      if (versions[department] === version) pending.delete(department)
    }
  })()
  pending.set(department, promise)
  return promise
}
export async function refreshCardSession(forceAccess = false): Promise<void> {
  await validateCardAccess(forceAccess)
  if (!checkCardTime()) return
  if ((previousAccount && previousAccount !== cardAccess.value.account) || previousYear !== voteYear) {
    clearSharedDrafts()
  }
  previousAccount = cardAccess.value.account
  previousYear = voteYear
  await Promise.all(departments.map((department) => loadCardDepartment(department)))
}
function clearSharedDrafts(): void {
  departments.forEach((department) => localStorage.removeItem(draftKeys[department]))
  clearVoteDraftReaders()
}
function invalidateSession(): void {
  generation++
  pending.clear()
  departments.forEach((department) => {
    versions[department]++
    publish(department, emptyState())
  })
  cardVersion.value++
}
watch(
  [voteToken, sessionToken],
  () => {
    invalidateSession()
    invalidateCardAccess()
    if (!voteToken.value || !sessionToken.value) {
      clearVoteDraftReaders()
      previousAccount = ''
      return
    }
    if (consumers) void refreshCardSession()
  },
  { flush: 'post' }
)
watch(draftRevision, () => {
  if (consumers && checkCardTime()) departments.forEach((department) => void loadCardDepartment(department, true))
})
watch(
  [characterListFromBackend, characterGroupsRaw, musicGroupsRaw, musicFilterMeta],
  () => {
    departments.forEach((department) => {
      const state = cardDepartments[department]
      if (state.status !== 'ready') return
      try {
        publish(department, { ...state, entries: enrich(department, state.entries) })
      } catch {
        /* failed background refresh retains previously usable data */
      }
    })
  },
  { deep: true }
)
function foreground(): void {
  if (document.visibilityState === 'visible') {
    cardVersion.value++
    void refreshCardSession(true)
  }
}
function storageChanged(event: StorageEvent): void {
  if (event.key === 'voteToken' || event.key === 'sessionToken' || event.key === 'user' || event.key === null) {
    invalidateSession()
    pauseCardForExternalCredentials()
    if (!localStorage.getItem('voteToken') || !localStorage.getItem('sessionToken')) clearVoteDraftReaders()
  } else if (Object.values(draftKeys).includes(event.key as (typeof draftKeys)[Department])) {
    clearVoteDraftReaders()
    void refreshCardSession()
  }
}
let timer: ReturnType<typeof setInterval> | undefined
let releaseTimer: ReturnType<typeof setTimeout> | undefined
export function useVoteCardSession() {
  onMounted(() => {
    const handoff = releaseTimer !== undefined
    clearTimeout(releaseTimer)
    releaseTimer = undefined
    consumers++
    if (consumers === 1 && !handoff) {
      document.addEventListener('visibilitychange', foreground)
      window.addEventListener('storage', storageChanged)
      timer = setInterval(() => {
        if (cardAccess.value.status === 'allowed' && !checkCardTime()) invalidateSession()
      }, 1000)
    }
    if (!handoff) void refreshCardSession()
  })
  onBeforeUnmount(() => {
    consumers--
    if (!consumers)
      releaseTimer = setTimeout(() => {
        releaseTimer = undefined
        if (!consumers) {
          document.removeEventListener('visibilitychange', foreground)
          window.removeEventListener('storage', storageChanged)
          clearInterval(timer)
          invalidateSession()
        }
      }, 0)
  })
  return {
    states: cardDepartments,
    access: cardAccess,
    allowed: computed(() => cardAccess.value.status === 'allowed'),
    retry: () => refreshCardSession(true),
  }
}
