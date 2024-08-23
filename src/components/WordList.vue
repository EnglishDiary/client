<script setup>
import WordEditting from './WordEditting.vue'

import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

const wordList = ref([])
const audio = ref(new Audio())

onMounted(async () => {
    const result = await apiCall(API_LIST.GET_USER_WORDS)
    const jsonData = JSON.parse(result.data).list

    jsonData.forEach(word => {
        word.activeTab = 0
        word.isEditting = false
    })

    console.log('유저 단어 조회 결과 -> ', jsonData)
    wordList.value = jsonData
})

const editWord = (word) => {
    word.isEditting = true
}

const completeEdit = async (word) => {
    word.isEditting = false
    const payload = {
        wordId: word.id,
        word: word.word,
        jsonStr: JSON.stringify(word),
        rawData: word,
    }
    const result = await apiCall(API_LIST.UPDATE_WORD(word.word), payload)
    console.log('결과 -> ', result)
}

const deleteWord = async (word) => {
    const parameters = {
        wordId: word.id
    }
    const result = await apiCall(API_LIST.DELETE_WORD(word.word), parameters)
    console.log('호출 결과 -> ', result);
}

</script>

<template>
    <div>
        <div class="q-pa-md" style="max-width: 500px">
            <div v-for="word in wordList" :key="word.id">
                <div class="q-mt-md">
                    <span class="text-h4">{{ word.word }}</span>
                    <span class="text-h6">( {{ word.phonetic }} )</span>

                    <q-btn v-if="word.isEditting" @click="completeEdit(word)">편집완료</q-btn>
                    <q-btn v-else @click="editWord(word)">수정하기</q-btn>
                    <q-btn @click="deleteWord(word)">삭제하기</q-btn>
                </div>
                <q-card>
                    <q-tabs v-model="word.activeTab" dense class="text-grey" active-color="primary"
                        indicator-color="primary" align="justify" narrow-indicator>
                        <template v-for="(meaning, index) in word.meanings" :key="index">
                            <q-tab :name="index" :label="meaning.partOfSpeech" />
                        </template>
                    </q-tabs>

                    <WordEditting v-if="word.isEditting" :wordDetail="word" />
                    <q-tab-panels v-else v-model="word.activeTab" animated>
                        <q-tab-panel v-for="(meaning, index) in word.meanings" :key="index" :name="index">
                            <div class="q-mt-xl" v-for="(item, index) in meaning.definitions" :key="index">
                                <span>뜻{{ index + 1 }}.</span>
                                <span>{{ item.definition }}</span>
                                <div>Examples</div>
                                <ul>
                                    <li>ex - {{ item.example }}</li>
                                </ul>
                                <template v-for="(el, elIdx) in item.userExamples" :key="elIdx">
                                    <ul>
                                        <li>ex{{ elIdx + 1 }} - {{ el }}</li>
                                    </ul>
                                </template>
                                <br>
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>

                </q-card>
            </div>

        </div>
    </div>
</template>