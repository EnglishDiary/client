<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const userId = ref('')
const nickname = ref('')
const password = ref('')
const profileImage = ref(null)

const userIdRules = [
    val => !!val || '아이디를 입력해주세요',
    val => /^(?=.*[a-z])(?=.*\d)[a-z0-9]{5,20}$/.test(val) || '아이디는 5자 이상 20자 이하의 영문 소문자와 숫자의 조합이어야 하며, 각각 최소 1개 이상 포함해야 합니다',
]

const nicknameRules = [
    val => !!val || '닉네임을 입력해주세요',
    val => /^[가-힣\u318D\u119E\u11A2\u2022\u2025a-zA-Z0-9]{1,}$/.test(val) || '닉네임은 한 자 이상이어야 합니다',
    val => val.length <= 10 || '닉네임은 10자 이하여야 합니다'
]

const passwordRules = [
    val => !!val || '비밀번호를 입력해주세요',
    val => val.length >= 8 || '비밀번호는 8자 이상이어야 합니다',
    val => val.length <= 20 || '비밀번호는 20자 이하여야 합니다'
]

const onSubmit = async () => {
    const parameters = {
        userId: userId.value,
        nickname: nickname.value,
        password: password.value,
        profileImage: profileImage.value
    }
    const response = await apiCall(API_LIST.SIGNUP, parameters)
    if (response.status) {
        alert(response.message)
    }
}
</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>

            <q-page class="flex flex-center">
                <q-card style="width: 400px">
                    <q-card-section>
                        <div class="text-h6">회원가입</div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit="onSubmit" class="q-gutter-md">
                            <q-input v-model="userId" label="아이디" :rules="userIdRules" />

                            <q-input v-model="nickname" label="닉네임" :rules="nicknameRules" />

                            <q-input v-model="password" label="비밀번호" type="password" :rules="passwordRules" />

                            <q-file v-model="profileImage" label="프로필 이미지" accept="image/*">
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                </template>
                            </q-file>

                            <div>
                                <q-btn label="가입하기" type="submit" color="primary" />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-page>

        </q-page-container>
    </q-layout>

</template>


<style scoped>
.full-width {
    width: 100%;
}
</style>