<script setup>
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const userId = ref('');
const password = ref('');

const login = async () => {
    const parameters = {
        email: userId.value,
        password: password.value
    }
    const response = await apiCall(API_LIST.MEMBER_LOGIN, parameters)

    if (response.status) {
        const { accessToken } = response.data
        localStorage.setItem('access_token', accessToken)

        await authStore.checkAuth()
        router.push('/')
    } else {
        alert(response.message)
    }

}

</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center bg-grey-2">
                <q-card class="q-pa-md shadow-2 my_card" bordered>
                    <q-card-section class="text-center">
                        <div class="text-grey-9 text-h5 text-weight-bold">Dobi's garden</div>
                        <div class="text-grey-8">회원정보를 입력해주세요</div>
                    </q-card-section>
                    <q-card-section>
                        <q-input dense outlined v-model="userId" label="ID"></q-input>
                        <q-input dense outlined class="q-mt-md" v-model="password" type="password"
                            label="Password"></q-input>
                    </q-card-section>
                    <q-card-section>
                        <q-btn style="
  border-radius: 8px;" color="dark" rounded size="md" label="로그인" no-caps class="full-width" @click="login"></q-btn>
                    </q-card-section>
                    <q-card-section class="text-center q-pt-none">
                        <div class="text-grey-8">계정이 없으신가요?
                            <a href="/signup" class="text-dark text-weight-bold" style="text-decoration: none">회원가입</a>
                        </div>
                    </q-card-section>

                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>

</template>


<style scoped>
.my_card {
    width: 25rem;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
