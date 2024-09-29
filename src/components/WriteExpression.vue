<template>
    <q-page padding>
        <q-card class="q-pa-md">
            <q-card-section>
                <q-input v-model="koreanInput" label="영작하고 싶은 표현 혹은 문장 (한국어로 입력 | 예시: 식은 죽 먹기)" filled type="textarea"
                    :rules="[val => !!val || '필수 입력 항목입니다']" rows="3" autogrow />
            </q-card-section>
            <q-card-section>
                <q-input v-model="englishInput" label="선택입력 항목 - 당신의 영작 (영어로 입력 | 예시: piece of cake)" filled
                    type="textarea" rows="3" autogrow />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="AI에게 물어보기" color="primary" @click="askAI" :loading="loading" />
            </q-card-actions>
        </q-card>
        <!-- AI Response -->
        <q-card v-if="aiResponse" class="q-mt-md q-pa-md">
            <q-card-section>
                <!-- <h2 class="text-h6">AI의 답변</h2> -->
                <p>{{ aiResponse.summary }}</p>
                <!-- <h3 class="text-subtitle1 q-mt-md">영작 결과:</h3> -->
                <q-list bordered padding>
                    <q-item v-for="(result, index) in aiResponse.translations" :key="index">
                        <q-item-section avatar>
                            <q-checkbox v-model="result.checked" @update:model-value="updateCheckedState(index)" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ result.english }}</q-item-label>
                            <q-item-label caption>{{ result.korean }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="저장하기" color="primary" @click="openPublishModal" :disable="!canSave" />
            </q-card-actions>
        </q-card>

        <!-- 발행 모달 -->
        <q-dialog v-model="showPublishModal">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">표현집에 저장하기</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-radio v-model="publishSettings.isPublic" :val=true label="공개" />
                    <!-- <q-radio v-model="publishSettings.isPublic" :val=false label="비공개" /> -->

                    <!-- <q-select v-model="selectedCategory" :options="categoryOptions" label="카테고리"
                        @update:model-value="handleCategoryChange" option-value="id" option-label="name"
                        class="q-mt-md" /> -->

                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="취소" color="primary" v-close-popup />
                    <q-btn flat label="저장" color="primary" @click="saveExpression" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>


    </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { apiCall } from '@/utils/apiCall'
import { API_LIST } from '@/utils/apiList'

const $q = useQuasar()
const koreanInput = ref('')
const englishInput = ref('')
const aiResponse = ref(null)
const loading = ref(false)
const canSave = ref(true)
const showPublishModal = ref(false)
const publishSettings = ref({
    isPublic: true,
    categoryId: null,
})

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
        aiResponse.value.translations.forEach(translation => {
            translation.checked = true
        })
    }
}

const updateCheckedState = (index) => {
    console.log(`Translation ${index + 1} checked state updated:`, aiResponse.value.translations[index].checked)

    let checkedItemCount = 0
    aiResponse.value.translations.forEach((item) => {
        if (item.checked) {
            checkedItemCount++
        }
    })
    if (checkedItemCount == 0) {
        canSave.value = false
        return
    }
    canSave.value = true
}

const openPublishModal = () => {
    showPublishModal.value = true
}

const saveExpression = async () => {
    const checkedTranslations = aiResponse.value.translations.filter(t => t.checked)
    const parameters = {
        originalSentence: aiResponse.value.originalSentence,
        userSentence: englishInput.value,
        summary: aiResponse.value.summary,
        translations: checkedTranslations,
    }

    const response = await apiCall(API_LIST.SAVE_EXPRESSION, parameters)
    if (response.status) {
        $q.notify({
            color: 'positive',
            message: response.message
        })
    }
}

// Watch for changes in aiResponse
watch(() => aiResponse.value, (newValue) => {
    if (newValue) {
        newValue.translations.forEach(translation => {
            if (translation.checked === undefined) {
                translation.checked = true
            }
        })
    }
}, { deep: true })
</script>