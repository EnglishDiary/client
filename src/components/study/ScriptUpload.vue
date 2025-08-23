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
        <q-input :label="$t('analysisUi.script')" v-model="script" filled type="textarea" 
            :rules="[val => !!val || $t('validation.requiredInput')]" />
        <q-separator class="q-my-sm" />
        <q-input :label="$t('analysisUi.context')" v-model="desc" filled type="textarea" autogrow/>

        <q-btn @click="uploadScript">{{ $t('common.post') }}</q-btn>
    </div>
</template>