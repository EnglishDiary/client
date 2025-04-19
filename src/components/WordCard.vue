<template>
    <div class="q-pa-md">
        <q-card class="my-card q-mb-md">
            <q-card-section>
                <div class="text-h5 q-mb-xs">{{ word.word }}</div>
                <div class="text-subtitle2">{{ word.phonetic }}</div>
            </q-card-section>

            <q-separator />

            <q-card-actions vertical>
                <div class="row q-gutter-sm">
                    <q-btn v-for="phonetic in word.phonetics" :key="phonetic.audio" @click="playAudio(phonetic.audio)"
                        color="primary" :label="identifyCountry(phonetic.audio)" icon="volume_up" flat dense />
                </div>
            </q-card-actions>

            <q-tabs v-model="word.activeTab" dense class="text-primary" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab v-for="(meaning, index) in word.meanings" :key="index" :name="index"
                    :label="meaning.partOfSpeech" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="word.activeTab" animated>
                <q-tab-panel v-for="(meaning, index) in word.meanings" :key="index" :name="index">
                    <div v-for="(item, defIndex) in meaning.definitions" :key="defIndex" class="q-mb-md">
                        <div class="text-subtitle1 q-mb-xs">Definition {{ defIndex + 1 }}</div>
                        <div class="q-ml-sm">{{ item.definition }}</div>

                        <div v-if="item.example || item.userExamples.length > 0" class="q-mt-sm">
                            <div class="text-weight-bold">Examples:</div>
                            <q-list dense>
                                <q-item v-if="item.example">
                                    <q-item-section avatar>
                                        <q-icon name="book" color="primary" />
                                    </q-item-section>
                                    <q-item-section>{{ item.example }}</q-item-section>
                                </q-item>
                                <q-item v-for="(ex, exIndex) in item.userExamples" :key="exIndex">
                                    <q-item-section avatar>
                                        <q-icon name="person" color="secondary" />
                                    </q-item-section>
                                    <q-item-section>{{ ex }}</q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                    </div>
                </q-tab-panel>
            </q-tab-panels>

            <q-card-actions align="right">
                <q-btn v-if="word.isEditting" @click="completeEdit(word)" color="positive" label="완료" />
                <q-btn v-else @click="editWord(word)" color="primary" label="수정" />
                <q-btn @click="deleteWord(word)" color="negative" label="삭제" />
            </q-card-actions>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

const props = defineProps({
    word: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
})

const audio = ref(new Audio())

const identifyCountry = (audioUrl) => {
    if (audioUrl.includes('uk.mp3')) {
        return 'UK'
    } else if (audioUrl.includes('us.mp3')) {
        return 'US'
    } else {
        return ''
    }
}

const playAudio = (url) => {
    audio.value.src = url
    audio.value.play()
}

const editWord = (word) => {
    word.isEditting = true
}

const completeEdit = async (word) => {
    word.isEditting = false
    const payload = {
        wordId: word.id,
        categoryId: word.categoryId,
        word: word.word,
        jsonStr: JSON.stringify(word),
        rawData: word,
    }
    const result = await apiCall(API_LIST.UPDATE_WORD(word.word), payload)
    console.log('결과 -> ', result)
    // Add any additional logic here for after the edit is complete
}

const deleteWord = async (word) => {
    const parameters = {
        wordId: word.id
    }
    const result = await apiCall(API_LIST.DELETE_WORD(word.word), parameters)
    console.log('호출 결과 -> ', result)
    // Add any additional logic here for after the word is deleted
}
</script>

<style scoped>
.my-card {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}
</style>