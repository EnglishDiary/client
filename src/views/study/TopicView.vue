<script setup>
import { ref, onMounted } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const fetchTopics = async () => {
    const response = await apiCall(API_LIST.FETCH_TOPICS);
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
        <q-btn @click="addTopic">토픽 추가하기</q-btn>
    </div>

</template>