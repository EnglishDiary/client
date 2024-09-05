<script setup>
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref } from 'vue'

const parser = new DOMParser();
const editor = ref('')
const revisedVersion = ref('')
const gptFeedback = ref('')

const requestAICorrection = async () => {
    const htmlString = editor.value
    const document = parser.parseFromString(htmlString, "text/html")
    const diaryText = document.body.textContent

    const parameters = {
        diary: diaryText,
    }
    const response = await apiCall(API_LIST.REQUEST_AI_CORRECTION, parameters)
    if (response.status) {
        const { revisedDiary, feedback } = response.data
        revisedVersion.value = revisedDiary
        gptFeedback.value = feedback
    }
}

</script>

<template>
    <q-page padding>
        <div class="q-pa-md">
            <h4 class="q-mt-none q-mb-md">영어 일기 작성</h4>

            <!-- 1. 텍스트 에디터 -->
            <q-editor v-model="editor" min-height="15rem" :toolbar="[
                ['bold', 'italic', 'underline'],
                ['undo', 'redo'],
            ]" />

            <!-- 2. AI 첨삭 요청 버튼 -->
            <q-btn class="q-mt-md" color="primary" label="AI 첨삭 요청" @click="requestAICorrection" />

            <!-- 3. AI 첨삭 결과 및 피드백 -->
            <div v-if="revisedVersion || gptFeedback" class="q-mt-lg">
                <h5>AI 첨삭 결과</h5>

                <!-- 첨삭된 일기 -->
                <q-card v-if="revisedVersion" class="q-mb-md">
                    <q-card-section>
                        <div class="text-h6">첨삭된 일기</div>
                        <q-separator class="q-my-sm" />
                        <!-- <div v-html="revisedVersion"></div> -->
                        <pre style="white-space: pre-line">{{ revisedVersion }}</pre>
                    </q-card-section>
                </q-card>

                <!-- AI 피드백 -->
                <q-card v-if="gptFeedback">
                    <q-card-section>
                        <div class="text-h6">AI 피드백</div>
                        <q-separator class="q-my-sm" />
                        <div v-html="gptFeedback"></div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>