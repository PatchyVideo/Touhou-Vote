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

/* Vue Router */
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory('/v10/'),
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
import { isLogin } from '@/home/lib/user'

router.beforeEach(async (to, from, next) => {
  if (!NProgress.isStarted()) NProgress.start()
  await appPromisesFinish
  if (to.path != '/' && !isLogin.value) next({ path: '/' })
  else if (
    (to.path === '/vote/character' || to.path === '/vote/music' || to.path === '/vote/couple') &&
    !IsQuestionnaireAllDone.value
  )
    next({ path: '/' })
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
import { checkLoginStatus } from '@/home/lib/user'
appPromises.push(checkLoginStatus(true))

const appPromisesFinish = Promise.allSettled(appPromises.map((v) => v.then(incProcess))).then(() => {
  app.mount('#app')
  incProcess()
})
