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
                if (response.status) {
                    this.login(response.data)
                    return true
                }
                return false
            }
            location.href = '/login'
        },
        async checkUser() {
            const token = localStorage.getItem('access_token')
            if (token) {
                const response = await apiCall(API_LIST.VERIFY_USER)
                if (response.status) {
                    this.login(response.data)
                    return true
                }
            }
        },
        login(userData, token) {
            this.isLoggedIn = true
            this.user = userData
        },
        logout() {
            this.isLoggedIn = false
            this.user = null
            localStorage.removeItem('access_token')
        }
    }
})