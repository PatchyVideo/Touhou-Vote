import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/[...all].vue'),
  },
]

export const router = createRouter({
  history: createWebHistory('/nav/'),
  routes,
})
