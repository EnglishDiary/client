<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
// import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/store/auth'
import { onMounted, watch } from 'vue';

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const checkAuthIfRequired = async () => {
  console.log('checkAuthIfRequired -> ', route.meta.requiresAuth && !authStore.isLoggedIn)
  if (route.meta.requiresAuth && !authStore.isLoggedIn) {
    await authStore.checkAuth()
    if (!authStore.isLoggedIn) {
      // 인증이 필요하지만 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/login')
    }
  }
}

onMounted(checkAuthIfRequired)

// 라우트 변경 시 인증 상태 확인
watch(() => route.path, checkAuthIfRequired)

</script>

<template>
  <RouterView />
</template>