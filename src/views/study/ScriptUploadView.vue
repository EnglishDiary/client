<script setup>
    import { ref, onMounted } from 'vue';
    import { apiCall } from '@/utils/apiCall';
    import { API_LIST } from '@/utils/apiList';

    const script = ref('');

    const uploadScript = async () => {
                
        const parameters = {
            "script": processScript(script.value)
        }

        const response = await apiCall(API_LIST.UPLOAD_SCRIPT, parameters)
        if (response.status) {
            console.log(response.data)
        }
    }

    const processScript = (script) => {
        return script.split(/\n+/)            
    }

</script>

<template>
    <div class="q-pa-md" style="max-width: 600px">
        <q-input v-model="script" filled type="textarea" />
        <q-btn @click="uploadScript">스크립트 등록</q-btn>
    </div>
    

</template>