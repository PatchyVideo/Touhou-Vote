import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
    meta: {
      layout: 'blank',
      navid: 'summary',
    },
  },
  {
    path: '/character',
    component: () => import('@/pages/character.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterDetail',
    component: () => import('@/pages/characterDetail.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterCompare',
    component: () => import('@/pages/characterCompare.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterEvolution',
    component: () => import('@/pages/characterEvolution.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterSingleDetail',
    component: () => import('@/pages/characterSingleDetail.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterConnect',
    component: () => import('@/pages/characterConnect.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/characterReason',
    component: () => import('@/pages/CharacterReason.vue'),
    meta: {
      navid: 'character',
    },
  },
  {
    path: '/music',
    component: () => import('@/pages/Music.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicDetail',
    component: () => import('@/pages/MusicDetail.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicCompare',
    component: () => import('@/pages/MusicCompare.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicEvolution',
    component: () => import('@/pages/MusicEvolution.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicSingleDetail',
    component: () => import('@/pages/MusicSingleDetail.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicConnect',
    component: () => import('@/pages/MusicConnect.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/musicReason',
    component: () => import('@/pages/MusicReason.vue'),
    meta: {
      navid: 'music',
    },
  },
  {
    path: '/couple',
    component: () => import('@/pages/Couple.vue'),
    meta: {
      navid: 'couple',
    },
  },
  {
    path: '/coupleDetail',
    component: () => import('@/pages/CoupleDetail.vue'),
    meta: {
      navid: 'couple',
    },
  },
  {
    path: '/coupleSingleDetail',
    component: () => import('@/pages/CoupleSingleDetail.vue'),
    meta: {
      navid: 'couple',
    },
  },
  {
    path: '/coupleReason',
    component: () => import('@/pages/CoupleReason.vue'),
    meta: {
      navid: 'couple',
    },
  },
  {
    path: '/doujin',
    component: () => import('@/pages/Doujin.vue'),
    meta: {
      navid: 'doujin',
    },
  },
  {
    path: '/questionnaireDetail',
    component: () => import('@/pages/QuestionnaireDetail.vue'),
    meta: {
      navid: 'questionnaire',
    },
  },
  {
    path: '/questionnaireInputDetail',
    component: () => import('@/pages/QuestionnaireInputDetail.vue'),
    meta: {
      navid: 'questionnaire',
    },
  },
  {
    path: '/test',
    component: () => import('@/pages/Test.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/[...all].vue'),
  },
]

export const router = createRouter({
  history: createWebHistory('/v11/'),
  strict: true,
  routes: setupLayouts(routes),
})
