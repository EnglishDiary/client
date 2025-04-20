<script setup>

import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const $q = useQuasar()
const showPublishModal = ref(false)
const topic = ref('')
const description = ref('')

const fetchTopics = async () => {
    const topics = await apiCall(API_LIST.FETCH_TOPICS)
    console.log('토픽목록-> ', topics)



}

const addTopic = () => {

}

const openPublishModal = () => {
    showPublishModal.value = true
}


onMounted(() => {
    fetchTopics();
});


</script>

<template>
    <div>
        등록된 토픽이 없습니다.<br>
        토픽 등록하기
    </div>

    <div>
        <q-btn @click="openPublishModal">토픽 추가하기</q-btn>
    </div>

    <q-dialog v-model="showPublishModal">
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Topic</div>
            </q-card-section>

            <q-card-section>
                <q-input label="학습주제" v-model="topic" :rules="[val => !!val || '필수 입력 항목입니다']">
                </q-input>
            </q-card-section>

            <q-card-section>
                <q-input v-model="description" label="부연설명" filled type="textarea" rows="3" autogrow />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="취소" color="primary" v-close-popup />
                <q-btn flat label="저장" color="primary" @click="saveTopic" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>


</template>