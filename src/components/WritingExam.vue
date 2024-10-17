<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

const fetchExamSentences = async () => {
    const response = await apiCall(API_LIST.FETCH_EXAM_SENTENCES)
    if (response.status) {

    }
}

onMounted(() => {
    fetchExamSentences()
})

</script>

<template>
    작문 테스트
</template>