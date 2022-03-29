import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/global.postcss'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory('/nav/'),
  routes,
})
app.use(router)
app.mount('#app')
