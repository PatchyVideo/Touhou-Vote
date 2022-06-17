import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import '@/styles/global.postcss'
import 'uno.css'

const app = createApp(App)
const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory('/v10/'),
  strict: true,
  routes,
})
app.use(router)
app.mount('#app')
