import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/movie/:id',
    component: () => import('../views/MovieDetail.vue'),
    props: true,
  },
  {
    path: '/tv',
    component: () => import('../views/TvHome.vue'),
  },
  {
    path: '/tv/:id',
    component: () => import('../views/TvDetail.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
