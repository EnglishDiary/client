<script setup>
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref } from 'vue'

const parser = new DOMParser();
const editor = ref('')
const revisedVersion = ref('')
const gptFeedback = ref('')
const isLoading = ref(false)

const requestAICorrection = async () => {
    isLoading.value = true
    const htmlString = editor.value
    // const document = parser.parseFromString(htmlString, "text/html")
    // const diaryText = document.body.textContent

    const parameters = {
        diary: htmlString,
    }
    const response = await apiCall(API_LIST.REQUEST_AI_CORRECTION, parameters)
    isLoading.value = false
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
            <div class="row q-col-gutter-md">
                <!-- 원본 일기 작성 -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height">
                        <q-card-section>
                            <q-editor v-model="editor" min-height="250px" :toolbar="[
                                ['bold', 'italic', 'underline'],
                                ['undo', 'redo'],
                            ]" class="full-height" />
                        </q-card-section>
                    </q-card>
                </div>

                <!-- AI 첨삭 -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height">
                        <q-card-section>
                            <div>
                                <q-btn color="primary" label="AI에게 첨삭 요청하기" @click="requestAICorrection"
                                    :loading="isLoading" />
                            </div>
                            <div v-if="revisedVersion" class="q-pa-sm"
                                style="min-height: 250px; border: 1px solid #ccc; border-radius: 4px;">
                                <div v-html="revisedVersion"></div>
                            </div>
                            <div v-else class="text-grey-6 flex flex-center" style="min-height: 250px;">
                                AI 첨삭 결과가 여기에 표시됩니다.
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <div class="q-mt-md q-mb-lg">
                <q-btn color="primary" label="발행" @click="publishDiary" />
            </div>

            <!-- AI 피드백 -->
            <q-card v-if="gptFeedback" class="q-mt-md">
                <q-card-section>
                    <div class="text-h6">AI 피드백</div>
                    <q-separator class="q-my-sm" />
                    <div v-html="gptFeedback"></div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<style scoped>
.full-height {
    height: 100%;
}
</style>
