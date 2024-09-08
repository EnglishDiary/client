import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import WordView from '@/views/WordView.vue'
import LoginView from '@/views/LoginView.vue'
import Layout from '@/components/Layout.vue'
import WordListView from '@/views/WordListView.vue'
import WriteDiaryView from '@/views/WriteDiaryView.vue'
import DiaryListView from '@/views/DiaryListView.vue'
import DiaryDetailView from '@/views/DiaryDetailView.vue'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupView,
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Home',
          component: MainView
        },
        {
          path: 'word',
          name: 'Word',
          component: WordView
        },
        {
          path: 'word/list/mine',
          name: 'WordList',
          component: WordListView
        },
        {
          path: 'diary/write',
          name: 'WrtingDiaryPage',
          component: WriteDiaryView
        },
        {
          path: 'diary/official-category/list',
          name: 'DiaryList',
          component: DiaryListView
        },
        {
          path: 'diary/:id/detail',
          name: 'DiaryDetail',
          component: DiaryDetailView
        }
      ]
    }
  ]
})

export default router
