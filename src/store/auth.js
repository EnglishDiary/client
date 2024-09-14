// stores/auth.js
import { defineStore } from 'pinia'
import { apiCall } from '@/utils/apiCall'
import { API_LIST } from '@/utils/apiList'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null
    }),
    actions: {
        async checkAuth() {
            const token = localStorage.getItem('access_token')
            if (token) {
                const response = await apiCall(API_LIST.VERIFY_USER)

                if (response.status === 401) {
                    alert('checkAuth 인증 실패')
                } else {
                    console.log('유저미 응답 결과 -> ', response)
                    this.isLoggedIn = true
                    this.user = response.data
                }
            }
        },
        login(userData, token) {
            this.isLoggedIn = true
            this.user = userData
            localStorage.setItem('access_token', token)
        },
        logout() {
            this.isLoggedIn = false
            this.user = null
            localStorage.removeItem('access_token')
        }
    }
})