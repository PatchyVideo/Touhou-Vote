import { createApp, defineComponent, h } from 'vue'

/* Tailwind CSS */
import '@/tailwindcss'

/* Dark Mode */
import '@/darkmode'

/* GraphQL */
import { createApollo, provideClient } from '@/graphql'
const client = createApollo()

/* NProgress */
import NProgress from 'nprogress'
import 'nprogress/css/nprogress.css'
function incProcess() {
  if (NProgress.isStarted()) NProgress.inc()
}
NProgress.start()

/* Vue App */
import AppRouterView from './components/AppRouterView.vue'
const app = createApp(
  defineComponent({
    render: () => [h(AppRouterView)],
    setup() {
      provideClient(client)
    },
  })
)
const appPromises: Promise<unknown>[] = []

/* Vue Router */
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [
    {
      path: '/',
      component: () => import('@/home/HomeEntry.vue'),
    },
    {
      path: '/user/settings',
      component: () => import('@/home/UserSettings.vue'),
    },
    {
      path: '/questionnaire',
      component: () => import('@/questionnaire/Questionnaire.vue'),
    },
    {
      path: '/vote/character',
      component: () => import('@/vote-character/VoteCharacter.vue'),
    },
    {
      path: '/vote/music',
      component: () => import('@/vote-music/VoteMusic.vue'),
    },
    {
      path: '/vote/couple',
      component: () => import('@/vote-couple/VoteCouple.vue'),
    },
    {
      path: '/test',
      component: () => import('@/common/TestPage.vue'),
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (!NProgress.isStarted()) NProgress.start()
  if (to.path != '/' && !isLogin.value) next({ path: '/' })
  else next()
})
router.afterEach((guard) => {
  incProcess()
  appPromisesFinish.then(() => {
    if (!guard.meta.holdLoading && NProgress.isStarted()) {
      NProgress.done()
    }
  })
})
app.use(router)

/* Vue I18n */
import i18n from '@/locales'
app.use(i18n)

/* Login authentication & user data filling */
// import { checkLoginStatus } from '@/home/lib/user'
// appPromises.push(checkLoginStatus(true))

import { getUserDataFromLocalStorage, isLogin } from '@/home/lib/user'
getUserDataFromLocalStorage()

const appPromisesFinish = Promise.allSettled(appPromises.map((v) => v.then(incProcess))).then(() => {
  app.mount('#app')
  incProcess()
})
