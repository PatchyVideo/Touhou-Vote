import { ref, computed } from 'vue'
import { Voter } from '@/graphql/__generated__/graphql'

export function createDefaultVoter(): Voter {
  return {
    username: 'ERRORUSER',
    pfp: 'default',
    password: false,
    phone: '',
    email: '',
    patchyvideo: false,
    thbwiki: false,
    __typename: 'Voter',
  }
}

export const user = ref<Voter>(createDefaultVoter())

export const voteToken = ref<string>('')

export const sessionToken = ref<string>('')

export const isLogin = computed(() => voteToken.value != '')

export function setUserDataToLocalStorage(user: Voter, token: string, session: string): void {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('voteToken', JSON.stringify(token))
  localStorage.setItem('sessionToken', JSON.stringify(session))
}

export function getUserDataFromLocalStorage(): void {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const tokenData = localStorage.getItem('voteToken') || ''
  const sessionData = localStorage.getItem('sessionToken') || ''
  if (JSON.stringify(userData) != '{}') {
    user.value = userData
    voteToken.value = tokenData
    sessionToken.value = sessionData
  }
}

export function deleteUserData(): void {
  localStorage.removeItem('userData')
  localStorage.removeItem('voteToken')
  localStorage.removeItem('sessionToken')
  user.value = createDefaultVoter()
}
