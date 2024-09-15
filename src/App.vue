<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
// import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/store/auth'
import { onMounted, watch } from 'vue';

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

</script>

<template>
  <RouterView />
</template>