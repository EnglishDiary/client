<template>
    <q-page padding>
        <q-card class="q-pa-md">
            <q-card-section>
                <q-input v-model="koreanInput" label="영작하고 싶은 표현 혹은 문장 (한국어로 입력)" filled type="textarea"
                    :rules="[val => !!val || '필수 입력 항목입니다']" rows="3" autogrow />
            </q-card-section>
            <q-card-section>
                <q-input v-model="englishInput" label="당신의 영작 (영어로 입력, 선택사항)" filled type="textarea" rows="3"
                    autogrow />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="물어보기" color="primary" @click="askAI" :loading="loading" />
            </q-card-actions>
        </q-card>

        <q-card v-if="aiResponse" class="q-mt-md">
            <q-card-section>
                <h2 class="text-h6 q-mb-md">AI의 답변</h2>
                <div class="text-body1 q-mb-md">{{ aiResponse.summary }}</div>

                <q-separator class="q-my-md" />

                <div class="text-subtitle1 q-mb-sm">원래 문장:</div>
                <div class="text-body1 q-mb-md">{{ aiResponse.originalSentence }}</div>

                <div class="text-subtitle1 q-mb-sm">번역 결과:</div>
                <q-list bordered separator>
                    <q-item v-for="(translation, index) in aiResponse.translations" :key="index">
                        <q-item-section>
                            <q-item-label class="text-weight-medium">{{ translation.english }}</q-item-label>
                            <q-item-label caption>{{ translation.korean }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { apiCall } from '@/utils/apiCall'
import { API_LIST } from '@/utils/apiList'

const $q = useQuasar()
const koreanInput = ref('')
const englishInput = ref('')
const aiResponse = ref(null)
const loading = ref(false)

const askAI = async () => {
    if (!koreanInput.value) {
        $q.notify({
            color: 'negative',
            message: '한국어 입력은 필수입니다.'
        })
        return
    }

    loading.value = true
    const parameters = {
        koreanSentence: koreanInput.value,
        userEnglishAttempt: englishInput.value
    }

    const response = await apiCall(API_LIST.REQUEST_AI_EXPRESSION, parameters)
    loading.value = false
    if (response.status) {
        aiResponse.value = response.data
    }
}
</script>

<style scoped>
.q-card {
    max-width: 800px;
    margin: 0 auto;
}
</style>