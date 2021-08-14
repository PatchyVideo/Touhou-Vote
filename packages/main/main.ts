import { createApp, defineComponent, h } from 'vue'

/* Tailwind CSS */
import '@/tailwindcss'

/* Dark Mode */
import '@/darkmode'

/* GraphQL */
// import { createApollo, provideClient } from '@/graphql'
// const client = createApollo()

/* Vue App */
import AppRouterView from './components/AppRouterView.vue'
const app = createApp(
  defineComponent({
    render: () => [h(AppRouterView)],
    setup() {
      // provideClient(client)
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
      component: () => import('@/home/Home.vue'),
    },
  ],
})
app.use(router)

/* Vue I18n */
import i18n from '@/locales'
app.use(i18n)

/* Login authentication & user data filling */
// import { checkLoginStatus } from '@/user'
// appPromises.push(checkLoginStatus(true))

Promise.allSettled(appPromises).then(() => {
  app.mount('#app')
})
