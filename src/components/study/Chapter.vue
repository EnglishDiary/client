<script setup>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, onMounted, reactive } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const $q = useQuasar()
const showPublishModal = ref(false)
const route = useRoute()
const topicId = route.params.topicId
const chapters = ref([])
const chapterSaveForm = reactive({
    name: '',
    desc: ''
})



onMounted(() => {
    fecthChapters();
});

const openPublishModal = () => {
    showPublishModal.value = true
}

const fecthChapters = async () => {
    const response = await apiCall(API_LIST.FETCH_CHAPTERS(topicId))

    if (response.status) {
        chapters.value = response.data
    }
}

const saveTopic = async () => {
    const response = await apiCall(API_LIST.SAVE_CHAPTER(topicId), chapterSaveForm);
    if (response.status) {
        alert(response.message)
        chapters.value.push(response.data)
    }
}

const pageToScript = (chapter) => {
    const scriptUrl = `/study/topic/${topicId}/chapter/${chapter.id}/script`
    const scriptId = chapter.scriptId
        
    if (scriptId) {
        location.href = scriptUrl + `/${scriptId}`
        return
    }

    location.href = scriptUrl + '/upload'
}


</script>

<template>
    <q-dialog v-model="showPublishModal">
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Chapter</div>
            </q-card-section>

            <q-card-section>
                <q-input :label="$t('analysisUi.title')" v-model="chapterSaveForm.name" :rules="[val => !!val || '필수 입력 항목입니다']">
                </q-input>
            </q-card-section>

            <q-card-section>
                <q-input v-model="chapterSaveForm.desc" :label="$t('analysisUi.context')" filled type="textarea" rows="3" autogrow />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat :label="$t('common.cancel')" color="primary" v-close-popup />
                <q-btn flat :label="$t('common.save')" color="primary" @click="saveTopic" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <div class="q-pa-md row items-start q-gutter-md">
        <div>
            <q-btn @click="openPublishModal">{{ $t('analysisUi.addChapter') }}</q-btn>
        </div>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">

        <q-card class="my-card" v-for="(chapter, index) in chapters" :key="chapter.id">
            <q-card-section @click="pageToScript(chapter)">
                <div class="text-h6">{{ chapter.name }}</div>
                <div class="text-subtitle2">{{ chapter.desc }}</div>
            </q-card-section>
        </q-card>

    </div>

</template>