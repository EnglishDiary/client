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
import CategoryManageView from '@/views/CategoryManageView.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn) {
          return next('/')
        }
        return next()
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn) {
          return next('/')
        }
        return next()
      }

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
          component: WordListView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'diary/write',
          name: 'WrtingDiaryPage',
          component: WriteDiaryView,
          meta: {
            requiresAuth: true
          }
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
        },
        {
          path: 'user/manage/category',
          name: 'CategoryManage',
          component: CategoryManageView,
          meta: {
            requiresAuth: true
          }

        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { requiresAuth } = to.meta
  const authStore = useAuthStore()

  const isAuthenticated = await authStore.checkAuth()

  if (!requiresAuth) {
    return next()
  }

  if (isAuthenticated) {
    return next()
  } else {
    return next('/login')
  }
})

export default router
