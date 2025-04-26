<script setup>
import { useQuasar } from 'quasar'
import { ref, onMounted, reactive } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const $q = useQuasar()
const showPublishModal = ref(false)
const topics = ref([])
const topicSaveForm = reactive({
    name: '',
    desc: ''
})

onMounted(() => {
    fetchTopics();
});

const fetchTopics = async () => {
    const response = await apiCall(API_LIST.FETCH_TOPICS)

    topics.value = response.data
}

const saveTopic = async () => {
    const response = await apiCall(API_LIST.SAVE_TOPIC, topicSaveForm);
    if (response.status) {
        alert(response.message)
    }
}

const pageToChapters = (topicId) => {
    location.href = `/study/topic/${topicId}/chapters`
}

const openPublishModal = () => {
    showPublishModal.value = true
}


</script>

<template>

    <q-dialog v-model="showPublishModal">
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Topic</div>
            </q-card-section>

            <q-card-section>
                <q-input label="학습주제" v-model="topicSaveForm.name" :rules="[val => !!val || '필수 입력 항목입니다']">
                </q-input>
            </q-card-section>

            <q-card-section>
                <q-input v-model="topicSaveForm.desc" label="부연설명" filled type="textarea" rows="3" autogrow />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="취소" color="primary" v-close-popup />
                <q-btn flat label="저장" color="primary" @click="saveTopic" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>


    <div class="q-pa-md row items-start q-gutter-md">
        <div>
            <q-btn @click="openPublishModal">토픽 추가하기</q-btn>
        </div>
    </div>
    
    <div class="q-pa-md row items-start q-gutter-md">

        <template v-if="topics.length == 0">
            <span>등록된 토픽이 없습니다.</span>
        </template>
        <template v-else>
            <q-card class="my-card" v-for="(topic, index) in topics" :key="topic.id">
                <q-card-section @click="pageToChapters(topic.id)">
                    <div class="text-h6">{{ topic.name }}</div>
                    <div class="text-subtitle2">{{ topic.desc }}</div>
                </q-card-section>
            </q-card>

        </template>
    </div>

</template>