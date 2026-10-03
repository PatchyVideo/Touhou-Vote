import { ref } from 'vue'
import { deleteUserData, sessionToken, user, voteToken } from '@/home/lib/user'
import { API_PREFIX } from '@/common/lib/apiPrefix'
import { credentialScope } from './voteDraftBridge'
// The ordinary login flow reloads the app after writing credentials. Only a full
// reload may release an external-window pause and restore its user/token refs.
let externalCredentialsChanged = false
const externalCredentialsMessage = '登录状态已在其他窗口变化，请刷新页面重新验证'
export function pauseCardForExternalCredentials(): void {
  externalCredentialsChanged = true
  invalidateCardAccess()
  cardAccess.value = { ...cardAccess.value, status: 'login', message: externalCredentialsMessage }
}
export const cardAccess = ref({
  status: 'idle' as 'idle' | 'checking' | 'allowed' | 'error' | 'login' | 'ended' | 'early',
  message: '',
  account: '',
  nbf: 0,
  exp: 0,
  sessionExp: 0,
  scope: '',
})
function hasSynchronizedIdentity(): boolean {
  if (externalCredentialsChanged) return false
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    const tokensMatch =
      localStorage.getItem('voteToken') === voteToken.value &&
      localStorage.getItem('sessionToken') === sessionToken.value
    const titleFieldsMatch = ['username', 'phone', 'email'].every(
      (key) => storedUser[key] === user.value[key as 'username' | 'phone' | 'email']
    )
    if (tokensMatch && titleFieldsMatch) return true
  } catch {
    /* Unreadable credentials must not authorize a stale reactive profile. */
  }
  pauseCardForExternalCredentials()
  return false
}
export function decodeToken(token: string): Record<string, unknown> {
  const segment = token.split('.')[1]
  if (!segment) throw new Error('凭证结构异常，请重新登录')
  return JSON.parse(
    decodeURIComponent(
      Array.from(
        atob(segment.replace(/-/g, '+').replace(/_/g, '/')),
        (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
      ).join('')
    )
  )
}
export function acceptedTokenIdentity(session: Record<string, unknown>, vote: Record<string, unknown>) {
  const account = session.user_id || session.sub
  if (typeof account !== 'string' || !account || account !== (vote.user_id || vote.sub))
    throw new Error('会话与投票凭证账号不一致，请重新登录')
  if (
    ![vote.nbf, vote.exp, session.exp].every((value) => typeof value === 'number' && Number.isFinite(value)) ||
    Number(vote.nbf) >= Number(vote.exp)
  )
    throw new Error('凭证时间字段无效，请重新登录')
  return { account, nbf: Number(vote.nbf), exp: Number(vote.exp), sessionExp: Number(session.exp) }
}
export function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('请求超时，请重试')), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}
let pending: { scope: string; promise: Promise<void> } | undefined
export function invalidateCardAccess(): void {
  cardAccess.value = { status: 'idle', message: '', account: '', nbf: 0, exp: 0, sessionExp: 0, scope: '' }
  pending = undefined
}
export function checkCardTime(now = Date.now()): boolean {
  if (!hasSynchronizedIdentity()) return false
  const access = cardAccess.value
  if (access.status !== 'allowed' || access.scope !== credentialScope()) return false
  if (now >= access.exp * 1000) {
    cardAccess.value = { ...access, status: 'ended', message: '投票已结束' }
    return false
  }
  if (now >= access.sessionExp * 1000) {
    cardAccess.value = { ...access, status: 'login', message: '会话已到期，请重新登录' }
    return false
  }
  if (now < access.nbf * 1000) {
    cardAccess.value = { ...access, status: 'early', message: '投票尚未开始' }
    return false
  }
  return true
}
export function validateCardAccess(force = false): Promise<void> {
  if (!hasSynchronizedIdentity()) {
    cardAccess.value = { ...cardAccess.value, status: 'login', message: externalCredentialsMessage }
    return Promise.resolve()
  }
  const scope = credentialScope()
  if (cardAccess.value.scope === scope && cardAccess.value.account && Date.now() >= cardAccess.value.exp * 1000) {
    cardAccess.value = { ...cardAccess.value, status: 'ended', message: '投票已结束' }
    return Promise.resolve()
  }
  if (pending?.scope === scope) return pending.promise
  if (!force && cardAccess.value.scope === scope && checkCardTime()) return Promise.resolve()
  const [sessionToken, voteToken] = scope.split('|')
  cardAccess.value = { ...cardAccess.value, scope, status: 'checking', message: '正在验证投票凭证…' }
  const current = { scope, promise: Promise.resolve() }
  current.promise = (async () => {
    try {
      if (!sessionToken || !voteToken) {
        cardAccess.value = { ...cardAccess.value, status: 'login', message: '请重新登录' }
        return
      }
      const result = await withTimeout(
        (async () => {
          const response = await fetch(`${API_PREFIX}/user-token-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_token: sessionToken, vote_token: voteToken }),
          })
          if (!response.ok) throw new Error('凭证验证服务失败，请重试')
          return await response.json()
        })()
      )
      if (credentialScope() !== scope || pending !== current) return
      if (result.status === 'invalid') {
        deleteUserData()
        invalidateCardAccess()
        return
      }
      if (result.status !== 'valid') throw new Error('凭证验证响应异常，请重试')
      if (result.voting_status == null) {
        cardAccess.value = { ...cardAccess.value, status: 'login', message: '投票凭证不可用，请重新登录' }
        return
      }
      if (
        !['characters', 'musics', 'cps', 'papers', 'dojin'].every(
          (key) => typeof result.voting_status[key] === 'boolean'
        )
      )
        throw new Error('凭证验证响应结构异常，请重试')
      try {
        const identity = acceptedTokenIdentity(decodeToken(sessionToken), decodeToken(voteToken))
        cardAccess.value = { ...identity, scope, status: 'allowed', message: '' }
        checkCardTime()
      } catch (error) {
        cardAccess.value = { ...cardAccess.value, status: 'login', message: String((error as Error).message) }
      }
    } catch (error) {
      if (credentialScope() === scope && pending === current)
        cardAccess.value = { ...cardAccess.value, status: 'error', message: (error as Error).message }
    } finally {
      if (pending === current) pending = undefined
    }
  })()
  pending = current
  return current.promise
}
