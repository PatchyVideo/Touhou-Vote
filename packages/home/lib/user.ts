import { ref, computed } from 'vue'
import { Voter } from '@/graphql/__generated__/graphql'

export function createDefaultVoter(): Voter {
  return {
    username: null,
    pfp: 'default',
    password: false,
    phone: null,
    email: null,
    patchyvideo: false,
    thbwiki: false,
    __typename: 'Voter',
  }
}

export const user = ref<Voter>(createDefaultVoter())

export const username = computed(() => {
  const defaultUser = createDefaultVoter()
  if (user.value.username != defaultUser.username) return user.value.username
  else if (user.value.phone != defaultUser.phone) return user.value.phone?.slice(-4)
  else if (user.value.email != defaultUser.email) return user.value.email
  else return defaultUser.username
})

export const voteToken = ref<string>('')

export const sessionToken = ref<string>('')

export const isLogin = computed(() => voteToken.value != '')

export function setUserDataToLocalStorage(user: Voter, token: string, session: string): void {
  if (user.phone != null) user.phone = replacePhoneNum(user.phone)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('voteToken', JSON.stringify(token))
  localStorage.setItem('sessionToken', JSON.stringify(session))
}
function replacePhoneNum(phone: string): string {
  let replacedPhoneNum = ''
  for (let i = 0; i < phone.length - 4; i++) {
    replacedPhoneNum += '*'
  }
  return (replacedPhoneNum += phone.slice(-4))
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
