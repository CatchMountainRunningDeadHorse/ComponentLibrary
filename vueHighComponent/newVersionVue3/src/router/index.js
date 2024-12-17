import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound/index')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/loginView')
    }
  ]
})

export default router
