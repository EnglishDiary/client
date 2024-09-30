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
import NotFound from '@/components/NotFound.vue'
import { useAuthStore } from '@/store/auth'
import WriteExpressionView from '@/views/WriteExpressionView.vue'
import ExpressionListView from '@/views/ExpressionListView.vue'

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
          component: WordView,
          meta: {
            requiresAuth: true
          }
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
        },
        {
          path: 'expression',
          name: 'WriteExpression',
          component: WriteExpressionView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'expression/list',
          name: 'ExpresionList',
          component: ExpressionListView
        }
      ]
    },
    // 404 페이지를 위한 catch-all 라우트
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
    // MEMO 240928 - 500에러 났을 때도 URL 리다이렉트 시키는 건 유저 편의성을 오히려 해칠 수도 있을 거 같음
    // https://quasar.dev/quasar-cli-webpack/developing-ssr/handling-404-and-500-errors#error-404


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
