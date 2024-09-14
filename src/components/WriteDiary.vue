<!-- TOOD 240906 quasar 에디터 쓰지 말기(카피앤페이스트 불완전함) -->
<!-- TODO 240908 AI 첨삭 데이터를 2번 이상 요청할 수 있는데, 기존 것도 볼 수 있도록 리스트화 시키기-->
<script setup>
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const editor = ref('')
const revisedVersion = ref('')
const gptFeedback = ref('')
const isLoading = ref(false)
const showPublishModal = ref(false)
const categoryOptions = ref([])
const selectedCategory = ref(null)
const diaryTitle = ref('')

const publishSettings = ref({
    isPublic: true,
    categoryId: null,
    showRevisedDiary: true,
    showFeedback: true
})

const openPublishModal = () => {
    showPublishModal.value = true
}

const publishDiary = async () => {
    console.log('발행 설정:', publishSettings.value)
    const { isPublic, categoryId, showRevisedDiary, showFeedback } = publishSettings.value

    if (diaryTitle.value === '') {
        alert('다이어리 제목을 입력해주세요')
        return
    }

    const parameters = {
        title: diaryTitle.value,
        content: editor.value,
        aiRevisedDiary: revisedVersion.value,
        aiFeedback: gptFeedback.value,
        isPublic,
        isRevisionPublic: showRevisedDiary,
        isFeedbackPublic: showFeedback,
        officialCategoryId: categoryId,
    }
    const response = await apiCall(API_LIST.PUBLISH_DIARY, parameters)
    if (response.status) {
        alert(response.message)
        router.push(`/diary/official-category/list`)
    }
}

const handleCategoryChange = () => {
    publishSettings.value.categoryId = selectedCategory.value.id
}

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

onMounted(async () => {
    const response = await apiCall(API_LIST.GET_OFFICIAL_DIARY_CATEGORIES)
    if (response) {
        categoryOptions.value = response.data
    }

})

</script>

<template>
    <q-page padding>
        <div class="q-pa-md">
            <div class="q-mb-md">
                <q-input v-model="diaryTitle" label="Diary Title" outlined />
            </div>

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

            <!-- AI 피드백 -->
            <q-card v-if="gptFeedback" class="q-mt-md">
                <q-card-section>
                    <div class="text-h6">AI 피드백</div>
                    <q-separator class="q-my-sm" />
                    <div v-html="gptFeedback"></div>
                </q-card-section>
            </q-card>

            <div class="q-mt-md q-mb-lg">
                <q-btn color="primary" label="발행" @click="openPublishModal" />
            </div>

        </div>


        <!-- 발행 모달 -->
        <q-dialog v-model="showPublishModal">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">다이어리 발행</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-radio v-model="publishSettings.isPublic" :val=true label="공개" />
                    <!-- <q-radio v-model="publishSettings.isPublic" :val=false label="비공개" /> -->

                    <q-select v-model="selectedCategory" :options="categoryOptions" label="카테고리"
                        @update:model-value="handleCategoryChange" option-value="id" option-label="name"
                        class="q-mt-md" />

                    <div v-if="publishSettings.isPublic === true" class="q-mt-md">
                        <div class="text-subtitle2">AI 응답 데이터 공개 여부</div>
                        <q-toggle v-model="publishSettings.showRevisedDiary" label="첨삭된 일기 공개" />
                        <q-toggle v-model="publishSettings.showFeedback" label="AI 피드백 공개" />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="취소" color="primary" v-close-popup />
                    <q-btn flat label="발행" color="primary" @click="publishDiary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>


    </q-page>
</template>

<style scoped>
.full-height {
    height: 100%;
}
</style>
