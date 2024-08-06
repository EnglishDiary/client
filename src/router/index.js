import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import WordView from '../views/WordView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LoginView
    },
    {
      path: '/word',
      name: 'word',
      component: WordView
    }
  ]
})

export default router
