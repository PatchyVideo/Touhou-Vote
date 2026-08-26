import { createApp, defineComponent, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import AppRouterView from './components/AppRouterView.vue'
import { isBootstrapping } from './lib/appBootstrap'
import GlobalMessages from '@/common/components/GlobalMessages.vue'
import { createApollo, provideClient } from '@/graphql'
import { checkLoginStatus, isLogin } from '@/home/lib/user'
import {
  isQuestionnaireAllDoneV2,
  structureError,
} from '@/questionnaire/lib/questionnaireStateV2'
import { voteNotStart } from '@/start-page/lib/voteStart'
import { voteEnded } from '@/end-page/lib/voteEnded'
import 'nprogress/css/nprogress.css'
import '@/tailwindcss'
import '@/darkmode'

// 在开发环境加载测试工具
if (import.meta.env.DEV) {
  import('@/common/lib/testHelper')
  import('@/common/lib/testErrorHandling')
}

function incProcess() {
  if (NProgress.isStarted()) NProgress.inc()
}

// create graphql client
const client = createApollo()
// vue app
const app = createApp(
  defineComponent({
    render: () => [h(AppRouterView, { bootstrapping: isBootstrapping.value }), h(GlobalMessages)],
    setup() {
      provideClient(client)
    },
  })
)

// 有本地凭据时，路由内容会被启动加载状态遮蔽，直到会话和问卷恢复完成。
const checkLoginStatusPromise = checkLoginStatus(true).finally(() => {
  isBootstrapping.value = false
})

// router config
declare module 'vue-router' {
  interface RouteMeta {
    requriequestionnaire?: boolean
    availableAfterVoteEnded?: boolean
  }
}
const router = createRouter({
  history: createWebHistory('/v11/'),
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
let pendingNProgress: ReturnType<typeof setTimeout> | undefined
router.beforeEach(async (to, from, next) => {
  const isInitialNavigation = from.matched.length === 0 && from.path === '/'
  if (!isInitialNavigation && !isBootstrapping.value && pendingNProgress === undefined)
    pendingNProgress = setTimeout(() => {
      if (!NProgress.isStarted()) NProgress.start()
      pendingNProgress = undefined
    }, 150)

  await checkLoginStatusPromise
  if (to.path != '/' && voteNotStart()) next({ path: '/' })
  else if (to.path != '/' && !isLogin.value) next({ path: '/' })
  else if (to.meta.availableAfterVoteEnded && voteEnded()) next()
  else if (voteEnded()) next({ path: '/' })
  else if (to.meta.requriequestionnaire && !structureError.value && !isQuestionnaireAllDoneV2.value)
    next({ path: '/' })
  else next()
})
router.afterEach((guard) => {
  incProcess()
  if (pendingNProgress) {
    clearTimeout(pendingNProgress)
    pendingNProgress = undefined
  }
  if (!guard.meta.holdLoading) {
    if (NProgress.isStarted()) NProgress.done()
  }
})
app.use(router)
app.mount('#app')
