<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const route = useRoute()
const topicId = route.params.topicId
const chapterId = route.params.chapterId

const script = ref('')
const desc = ref('')

const uploadScript = async () => {

    const parameters = {
        script: script.value,
        desc: desc.value,
        sentences: processScript(script.value)
    }

    const response = await apiCall(API_LIST.UPLOAD_SCRIPT(topicId, chapterId), parameters)
    if (response.status) {
        alert(response.message)
        const scriptId = response.data
        location.href = `/study/topic/${topicId}/chapter/${chapterId}/script/${scriptId}`
    }
}

const processScript = (script) => {
    return script.trim().split(/\n+/)
}

</script>

<template>
    <div class="q-pa-md" style="max-width: 600px">
        <q-input label="공부할 스크립트" v-model="script" filled type="textarea" 
            :rules="[val => !!val || '필수 입력 항목입니다']" />
        <q-separator class="q-my-sm" />
        <q-input label="스크립트 부연설명" v-model="desc" filled type="textarea" />

        <q-btn @click="uploadScript">등록하기</q-btn>
    </div>
</template>