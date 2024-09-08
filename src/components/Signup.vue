<script setup>
import { ref } from 'vue'

const userId = ref('')
const nickname = ref('')
const password = ref('')
const profileImage = ref(null)

const testData = false

const onSubmit = () => {
    // 여기서 formData를 처리합니다.
    console.log('회원가입 정보:', '하하')
}
</script>

<template>
    <q-layout view="lHh Lpr lFf" v-if="testData">
        <q-page-container>

            <q-page class="q-pa-md flex flex-center">
                <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 400px;">

                    <!-- 아이디 입력 -->
                    <q-input v-model="formData.username" label="아이디" outlined />

                    <!-- 닉네임 입력 -->
                    <q-input v-model="formData.nickname" label="닉네임" outlined />

                    <!-- 비밀번호 입력 -->
                    <q-input v-model="formData.password" type="password" label="비밀번호" outlined />

                    <!-- 프로필 이미지 입력 -->
                    <q-uploader v-model="formData.profileImage" label="프로필 이미지" />

                    <!-- 회원가입 버튼 -->
                    <q-btn type="submit" label="회원가입" color="primary" class="full-width" />

                </q-form>
            </q-page>
        </q-page-container>
    </q-layout>

    <q-layout view="lHh Lpr lFf">
        <q-page-container>

            <q-page class="flex flex-center">
                <q-card style="width: 400px">
                    <q-card-section>
                        <div class="text-h6">회원가입</div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit="onSubmit" class="q-gutter-md">
                            <q-input v-model="userId" label="아이디" :rules="[val => !!val || '아이디를 입력해주세요']" />

                            <q-input v-model="nickname" label="닉네임" :rules="[val => !!val || '닉네임을 입력해주세요']" />

                            <q-input v-model="password" label="비밀번호" type="password"
                                :rules="[val => !!val || '비밀번호를 입력해주세요']" />

                            <q-file v-model="profileImage" label="프로필 이미지" accept="image/*"
                                :rules="[val => !!val || '프로필 이미지를 선택해주세요']">
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