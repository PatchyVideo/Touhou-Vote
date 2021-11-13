import { ref, computed } from 'vue'

export class User {
  userName: string
  image: string
  password: boolean
  phoneNum: string
  email: string
  patchyvideo: boolean
  thbwiki: boolean
  constructor(
    userName = 'ERRORUSER',
    image = 'default',
    password = false,
    phoneNum = '',
    email = '',
    patchyvideo = false,
    thbwiki = false
  ) {
    this.userName = userName
    this.image = image
    this.password = password
    this.phoneNum = phoneNum
    this.email = email
    this.patchyvideo = patchyvideo
    this.thbwiki = thbwiki
  }
}

export const user = ref<User>(new User())

export const voteToken = ref<string>('')

export const isLogin = computed(() => voteToken.value != '')

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
