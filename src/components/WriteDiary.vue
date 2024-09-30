<!-- TOOD 240906 quasar 에디터 쓰지 말기(카피앤페이스트 불완전함) -->
<!-- TODO 240908 AI 첨삭 데이터를 2번 이상 요청할 수 있는데, 기존 것도 볼 수 있도록 리스트화 시키기-->
<!-- TODO 240915 AI 첨삭 요청 중일 때는 첨삭버튼 비활성화 -->
<script setup>
import { apiCall, apiCallWithFileUpload } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

const MAX_FILE_NUMBER = 1

const router = useRouter()
const $q = useQuasar()

const editor = ref('')
const revisedVersion = ref('')
const gptFeedback = ref('')
const translation = ref('')
const isLoading = ref(false)
const showPublishModal = ref(false)
const showTranslationModal = ref(false)
const categoryOptions = ref([])
const selectedCategory = ref(null)
const diaryTitle = ref('')
const isHorizontalLayout = ref(true)
const selectedImage = ref(null)

const publishSettings = ref({
    isPublic: true,
    categoryId: null,
    showRevisedDiary: true,
    showFeedback: true
})

const openPublishModal = () => {
    showPublishModal.value = true
}

const openTranslationModal = () => {
    showTranslationModal.value = true
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

    const response = await apiCallWithFileUpload(API_LIST.PUBLISH_DIARY, parameters, selectedImage.value)
    if (response.status) {
        alert(response.message)
        router.push(`/diary/official-category/list`)
    }
}

const handleCategoryChange = () => {
    publishSettings.value.categoryId = selectedCategory.value.id
}

const onUploaded = (files) => {
    selectedImage.value = files[0];
}
const onRejected = (rejectedEntries) => {
    console.log('리젝내용 -> ', rejectedEntries)
    const failedEntry = rejectedEntries[0]
    const failReason = failedEntry?.failedPropValidation

    if (failReason == 'max-files') {
        $q.notify({
            type: 'negative',
            message: `${MAX_FILE_NUMBER}개의 이미지 파일만 업로드 할 수 있습니다.`
        })
    }
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
        const korean = response.data.translation
        revisedVersion.value = revisedDiary
        gptFeedback.value = feedback
        translation.value = korean
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
                            <q-btn @click="openTranslationModal" v-if="revisedVersion">해석보기</q-btn>
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

                <q-card-section>
                    <q-uploader accept=".jpg, image/*" label="(선택사항) 썸네일 이미지" multiple :max-files="MAX_FILE_NUMBER"
                        :hide-upload-btn="true" @added="onUploaded" @rejected="onRejected" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="취소" color="primary" v-close-popup />
                    <q-btn flat label="발행" color="primary" @click="publishDiary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- 한국어 해석 모달 -->
        <!-- Translation Modal with Switchable Layout -->
        <q-dialog v-model="showTranslationModal">
            <q-card style="width: 900px; max-width: 90vw;">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">원문과 번역</div>
                    <q-space />
                    <q-btn-group flat>
                        <q-btn icon="view_column" :color="isHorizontalLayout ? 'primary' : 'grey'"
                            @click="isHorizontalLayout = true" />
                        <q-btn icon="view_stream" :color="!isHorizontalLayout ? 'primary' : 'grey'"
                            @click="isHorizontalLayout = false" />
                    </q-btn-group>
                    <q-btn icon="close" flat round dense v-close-popup class="q-ml-sm" />
                </q-card-section>
                <q-card-section :class="{ 'row': isHorizontalLayout, 'column': !isHorizontalLayout }">
                    <!-- Revised Diary -->
                    <div :class="{ 'col-6': isHorizontalLayout, 'q-mb-md': !isHorizontalLayout }">
                        <div class="text-subtitle2">첨삭된 일기</div>
                        <q-separator class="q-my-sm" />
                        <div v-html="revisedVersion" class="text-body2"></div>
                    </div>
                    <!-- Translation -->
                    <div :class="{ 'col-6': isHorizontalLayout, 'q-mt-md': !isHorizontalLayout }">
                        <div class="text-subtitle2">번역</div>
                        <q-separator class="q-my-sm" />
                        <div v-html="translation" class="text-body2 bg-yellow"></div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<style scoped>
.full-height {
    height: 100%
}

.bg-yellow {
    background-color: #fbfbeb
}
</style>
