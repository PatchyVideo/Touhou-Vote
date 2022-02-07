import { ref, computed } from 'vue'
import { Voter } from '@/graphql/__generated__/graphql'
import { questionnaireData } from '@/questionnaire/lib/questionnaireData'

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
    createdAt: new Date(),
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

export const createdAt = computed(() => {
  const reg = /^\d+-\d+-\d+/
  const createdAt = (String(user.value.createdAt).match(reg) || ['0000-00-00'])[0].split('-')
  const year = createdAt[0] || '0000'
  const month = createdAt[1] || '00'
  const day = createdAt[2] || '00'
  const with9 = (str: string): string =>
    str
      .split('')
      .map((item) => {
        if (item === '9') return '⑨'
        else return item
      })
      .join('')
  const yearWith9 = with9(year)
  const monthWith9 = with9(month)
  const dayWith9 = with9(day)
  return yearWith9 + '年' + monthWith9 + '月' + dayWith9 + '日'
})

export const voteToken = ref<string>('')

export const sessionToken = ref<string>('')

export const isLogin = computed(() => voteToken.value != '')

export const voteCharacterComplete = ref(false)
export const voteMusicComplete = ref(false)
export const voteCoupleComplete = ref(false)
function setVoteStatus(votingStatus = { characters: true, cps: true, musics: true, papers: false }): void {
  voteCharacterComplete.value = votingStatus.characters
  voteMusicComplete.value = votingStatus.musics
  voteCoupleComplete.value = votingStatus.cps
}

export function setUserDataToLocalStorage(user: Voter, token: string, session: string): void {
  if (user.phone != null) user.phone = replacePhoneNum(user.phone)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('voteToken', token)
  localStorage.setItem('sessionToken', session)
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
  localStorage.removeItem('user')
  localStorage.removeItem('voteToken')
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('questionnaireDataLocal')
  user.value = createDefaultVoter()
}

export async function checkLoginStatus(needGetUserDataFromLocalStorage = false): Promise<void> {
  const tokenData = localStorage.getItem('voteToken')
  if (!tokenData) {
    deleteUserData()
    return
  }
  await fetch('/v10-be/user-token-status', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      user_token: localStorage.getItem('sessionToken') || '',
      vote_token: localStorage.getItem('voteToken') || '',
    }),
    credentials: 'include',
  })
    .then((data) => data.json())
    .then((res) => {
      if (res.status === 'valid') {
        if (res.voting_status) setVoteStatus(res.voting_status)
        if (res.papers_json && !localStorage.getItem('questionnaireDataLocal')) {
          localStorage.setItem('questionnaireDataLocal', res.papers_json)
          questionnaireData.value = JSON.parse(res.papers_json)
        }
        if (needGetUserDataFromLocalStorage) {
          getUserDataFromLocalStorage()
        }
      } else {
        deleteUserData()
      }
    })
    .catch((err) => {
      console.log(err)
      if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
      deleteUserData()
    })
}
