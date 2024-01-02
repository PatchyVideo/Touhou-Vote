import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'
import App from './App.vue'

import 'nprogress/css/nprogress.css'
import '@unocss/reset/tailwind.css'
import '@/styles/global.postcss'
import 'uno.css'

NProgress.start()

// create graphql client
const client = createApollo()
// vue app
const app = createApp(
  defineComponent({
    render: () => [h(App)],
    setup() {
      provideClient(client)
    },
  })
)

const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory('/v11/'),
  strict: true,
  routes,
})
app.use(router)
app.mount('#app')

NProgress.done()
