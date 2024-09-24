<template>
    <q-page padding>
        <q-card class="q-pa-md">
            <q-card-section>
                <q-input v-model="koreanInput" label="영작하고 싶은 표현 혹은 문장 (한국어로 입력 | 예시: 그건 정말 하늘에 별 따기야)" filled
                    type="textarea" :rules="[val => !!val || '필수 입력 항목입니다']" rows="3" autogrow />
            </q-card-section>
            <q-card-section>
                <q-input v-model="englishInput" label="당신의 영작 (영어로 입력, 선택사항)" filled type="textarea" rows="3"
                    autogrow />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="AI에게 물어보기" color="primary" @click="askAI" :loading="loading" />
            </q-card-actions>
        </q-card>

        <!-- AI Response -->
        <q-card v-if="aiResponse" class="q-mt-md q-pa-md">
            <q-card-section>
                <h2 class="text-h6">AI의 답변</h2>
                <p>{{ aiResponse.summary }}</p>

                <h3 class="text-subtitle1 q-mt-md">영작 결과:</h3>
                <q-list bordered padding>
                    <q-item v-for="(result, index) in aiResponse.translations" :key="index">
                        <q-item-section>
                            <q-item-label>{{ result.english }}</q-item-label>
                            <q-item-label caption>{{ result.korean }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="저장하기" color="primary" @click="askAI" :loading="loading" />
            </q-card-actions>

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