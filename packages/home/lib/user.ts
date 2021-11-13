import { ref, computed } from 'vue'

export class User {
  userName: string
  image: string
  password: boolean
  phoneNum: string
  email: string
  patchyvideo: boolean
  thbwiki: boolean
  voteToken: string
  constructor(
    userName = 'ERRORUSER',
    image = 'default',
    password = false,
    phoneNum = '',
    email = '',
    patchyvideo = false,
    thbwiki = false,
    voteToken = ''
  ) {
    this.userName = userName
    this.image = image
    this.password = password
    this.phoneNum = phoneNum
    this.email = email
    this.patchyvideo = patchyvideo
    this.thbwiki = thbwiki
    this.voteToken = voteToken
  }
}

export const user = ref<User>(new User())

export const isLogin = computed(() => user.value.voteToken != '')

export function setUserDataToLocalStorage(userData = new User()): void {
  localStorage.setItem('userData', JSON.stringify(userData))
}

export function getUserDataFromLocalStorage(): void {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  if (JSON.stringify(userData) != '{}') {
    user.value = userData
  }
}

export function deleteUserData(): void {
  localStorage.removeItem('userData')
  user.value = new User()
}
