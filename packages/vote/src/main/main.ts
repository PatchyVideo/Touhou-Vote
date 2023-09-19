import { createApp, defineComponent, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import AppRouterView from './components/AppRouterView.vue'
import GlobalMessages from '@/common/components/GlobalMessages.vue'
import { createApollo, provideClient } from '@/graphql'
import { checkLoginStatus, isLogin } from '@/home/lib/user'
import { IsQuestionnaireAllDone } from '@/questionnaire/lib/questionnaireData'
import { voteNotStart } from '@/start-page/lib/voteStart'
import { voteEnded } from '@/end-page/lib/voteEnded'
import 'nprogress/css/nprogress.css'
import '@/tailwindcss'
import '@/darkmode'

// start progress bar
function incProcess() {
  if (NProgress.isStarted()) NProgress.inc()
}
NProgress.start()

// create graphql client
const client = createApollo()
// vue app
const app = createApp(
  defineComponent({
    render: () => [h(AppRouterView), h(GlobalMessages)],
    setup() {
      provideClient(client)
    },
  })
)
const appPromises: Promise<unknown>[] = []

// check login status
const checkLoginStatusPromise = checkLoginStatus(true)
appPromises.push(checkLoginStatusPromise)

// router config
declare module 'vue-router' {
  interface RouteMeta {
    requriequestionnaire?: boolean
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
      meta: { requriequestionnaire: true },
    },
    {
      path: '/vote/music',
      component: () => import('@/vote-music/VoteMusic.vue'),
      meta: { requriequestionnaire: true },
    },
    {
      path: '/vote/couple',
      component: () => import('@/vote-couple/VoteCouple.vue'),
      meta: { requriequestionnaire: true },
    },
    {
      path: '/doujin',
      component: () => import('@/vote-doujin/VoteDoujin.vue'),
      meta: { requriequestionnaire: true },
    },
    {
      path: '/test',
      component: () => import('@/common/TestPage.vue'),
    },
  ],
})
let pendingNProgress: number | undefined
// router.beforeEach(async (to, from, next) => {
//   if (pendingNProgress === undefined)
//     pendingNProgress = setTimeout(() => {
//       if (!NProgress.isStarted()) NProgress.start()
//       pendingNProgress = undefined
//     }, 150)

//   await checkLoginStatusPromise
//   if (to.path != '/' && voteNotStart()) next({ path: '/' })
//   else if (to.path != '/' && !isLogin.value) next({ path: '/' })
//   else if (to.meta.availableAfterVoteEnded && voteEnded()) next()
//   else if (voteEnded()) next({ path: '/' })
//   else if (to.meta.requriequestionnaire && !IsQuestionnaireAllDone.value) next({ path: '/' })
//   else next()
// })
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

const appPromisesFinish = Promise.allSettled(appPromises.map((v) => v.then(incProcess))).then(() => {
  app.mount('#app')
  incProcess()
})
