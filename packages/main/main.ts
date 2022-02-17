import { createApp, defineComponent, h } from 'vue'
import { IsQuestionnaireAllDone } from '@/questionnaire/lib/questionnaireData'

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

/* Login authentication & user data filling */
import { checkLoginStatus } from '@/home/lib/user'
const checkLoginStatusPromise = checkLoginStatus(true)
appPromises.push(checkLoginStatusPromise)

/* Vue Router */
import { createRouter, createWebHistory } from 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    requrieQuestionaire?: boolean
    availableAfterVoteEnded?: boolean
  }
}
const router = createRouter({
  history: createWebHistory('/v10/'),
  strict: true,
  routes: [
    {
      path: '/',
      component: () => import('@/home/HomeEntry.vue'),
      meta: { availableAfterVoteEnded: true },
    },
    {
      path: '/user/settings',
      component: () => import('@/home/UserSettings.vue'),
      meta: { availableAfterVoteEnded: true },
    },
    {
      path: '/questionnaire',
      component: () => import('@/questionnaire/Questionnaire.vue'),
    },
    {
      path: '/vote/character',
      component: () => import('@/vote-character/VoteCharacter.vue'),
      meta: { requrieQuestionaire: true },
    },
    {
      path: '/vote/music',
      component: () => import('@/vote-music/VoteMusic.vue'),
      meta: { requrieQuestionaire: true },
    },
    {
      path: '/vote/couple',
      component: () => import('@/vote-couple/VoteCouple.vue'),
      meta: { requrieQuestionaire: true },
    },
    {
      path: '/doujin',
      component: () => import('@/vote-doujin/VoteDoujin.vue'),
      meta: { requrieQuestionaire: true },
    },
    {
      path: '/test',
      component: () => import('@/common/TestPage.vue'),
    },
  ],
})

import { isLogin } from '@/home/lib/user'
import { voteEnded } from '@/end-page/lib/voteEnded'
let pendingNProgress: number | undefined
router.beforeEach(async (to, from, next) => {
  if (pendingNProgress === undefined)
    pendingNProgress = setTimeout(() => {
      if (!NProgress.isStarted()) NProgress.start()
      pendingNProgress = undefined
    }, 150)

  await checkLoginStatusPromise
  if (to.path != '/' && !isLogin.value) next({ path: '/' })
  else if (to.meta.availableAfterVoteEnded && voteEnded()) next()
  else if (voteEnded()) next({ path: '/' })
  else if (to.meta.requrieQuestionaire && !IsQuestionnaireAllDone.value) next({ path: '/' })
  else next()
})
router.afterEach((guard) => {
  incProcess()
  appPromisesFinish.then(() => {
    if (pendingNProgress) {
      clearTimeout(pendingNProgress)
      pendingNProgress = undefined
    }
    if (!guard.meta.holdLoading) {
      if (NProgress.isStarted()) NProgress.done()
    }
  })
})
app.use(router)

/* Vue I18n */
import i18n from '@/locales'
app.use(i18n)

const appPromisesFinish = Promise.allSettled(appPromises.map((v) => v.then(incProcess))).then(() => {
  app.mount('#app')
  incProcess()
})
