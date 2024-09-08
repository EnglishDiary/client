<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { useRoute } from 'vue-router'

const route = useRoute()
const detail = ref({})

const fetchDiaryDetail = async () => {
    const diaryId = route.params.id
    const response = await apiCall(API_LIST.FETCH_DIARY_DETAIL(diaryId))
    if (response.status) {
        detail.value = response.data
    }

}

onMounted(() => {
    fetchDiaryDetail()
})

</script>

<template>
    <q-page padding>
        <div class="q-pa-md">
            <div class="q-mb-md">
                <q-card label="Diary Title" outlined>
                    <q-card-section>
                        {{ detail.title }}
                    </q-card-section>
                </q-card>
            </div>

            <div class="row q-col-gutter-md">
                <!-- 원본 일기 작성 -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height">
                        <q-card-section>
                            <div class="text-h6">원본</div>
                            <q-separator class="q-my-sm" />
                            <div v-if="detail.content" class="q-pa-sm" style="min-height: 250px;">
                                <div v-html="detail.content"></div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- AI 첨삭 -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height" v-if="detail.aiRevisedDiary">
                        <q-card-section>
                            <div class="text-h6">원본</div>
                            <q-separator class="q-my-sm" />
                            <div class="q-pa-sm" style="min-height: 250px;">
                                <div v-html="detail.aiRevisedDiary"></div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <!-- AI 피드백 -->
            <q-card v-if="detail.aiFeedback" class="q-mt-md">
                <q-card-section>
                    <div class="text-h6">AI 피드백</div>
                    <q-separator class="q-my-sm" />
                    <div v-html="detail.aiFeedback"></div>
                </q-card-section>
            </q-card>

        </div>

    </q-page>

</template>