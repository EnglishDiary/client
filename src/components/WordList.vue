<!-- TODO 241023 데이터 조회 후 없는 거 확인됐을 때만 저장된 단어 없습니다 표출해야 함 -->
<template>
    <div>
        <q-btn @click="getWordsByCategory(0)">
            all
        </q-btn>
        <q-btn @click="getWordsByCategory(category.id)" v-for="category in categories" :key="category.id">
            {{ category.name }}
        </q-btn>
    </div>

    <div class="q-pa-md">
        <div v-for="word in wordList" :key="word.id" class="q-mb-md">
            <q-card class="my-card">
                <q-card-section>
                    <div class="row items-center justify-between">
                        <div>
                            <span class="text-h5">{{ word.word }}</span>
                            <span class="text-subtitle1 q-ml-sm">( {{ word.phonetic }} )</span>
                        </div>
                        <div>
                            <q-btn v-if="word.isEditting" @click="completeEdit(word)" color="positive" label="편집완료" />
                            <q-btn v-else @click="editWord(word)" color="primary" label="수정하기" />
                            <q-btn @click="deleteWord(word)" color="negative" label="삭제하기" class="q-ml-sm" />
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="row q-gutter-sm">
                        <q-btn v-for="phonetic in word.phonetics" :key="phonetic.audio"
                            @click="playAudio(phonetic.audio)" color="secondary"
                            :label="identifyCountry(phonetic.audio)" icon="volume_up" />
                    </div>
                </q-card-section>

                <q-card-section>
                    <WordEditting v-if="word.isEditting" :wordDetail="word" :categories="categories" />
                    <template v-else>
                        <q-tabs v-model="word.activeTab" dense class="text-primary" active-color="primary"
                            indicator-color="primary" align="justify" narrow-indicator>
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
                    </template>
                </q-card-section>
            </q-card>
        </div>

        <div v-if="wordList.length == 0">
            <q-page class="q-pa-md">
                <q-card class="text-center q-pa-lg">
                    <q-icon :name="mdiBookOutline" size="64px" color="grey-7" />
                    <div class="text-h6 q-mt-md">저장된 단어가 없습니다</div>
                    <div class="text-subtitle1 q-mt-sm">단어장을 채워보세요!</div>
                    <div class="q-mt-md">
                        <q-btn color="primary" @click="toPage('/word')">단어 찾아보기</q-btn>
                    </div>
                </q-card>
            </q-page>
        </div>
    </div>
</template>

<script setup>
import WordEditting from './WordEditting.vue'
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { mdiBookOutline } from '@quasar/extras/mdi-v5'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordList = ref([])
const audio = ref(new Audio())
const categories = ref([])
const currentCategoryId = ref(undefined)

onMounted(async () => {
    const categoryRes = await apiCall(API_LIST.GET_USER_CATEGORIES)
    categories.value = categoryRes.data

    const wordRes = await apiCall(API_LIST.GET_USER_WORDS)
    const jsonData = JSON.parse(wordRes.data.jsonString).list

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
        categoryId: word.categoryId,
        word: word.word,
        jsonStr: JSON.stringify(word),
        rawData: word,
    }
    const result = await apiCall(API_LIST.UPDATE_WORD(word.word), payload)
    console.log('결과 -> ', result)
    if (result.status) {
        if (currentCategoryId.value && currentCategoryId.value !== word.categoryId) {
            removeWordFromList(word)
        }
    }
}

const deleteWord = async (word) => {
    const parameters = {
        wordId: word.id
    }
    const result = await apiCall(API_LIST.DELETE_WORD(word.word), parameters)
    console.log('호출 결과 -> ', result);
    if (result.status) {
        removeWordFromList(word)
    }
}

const removeWordFromList = (targetWord) => {
    wordList.value = wordList.value.filter((item) => {
        return item.id !== targetWord.id
    })
}

const getWordsByCategory = async (categoryId) => {
    console.log('카테고리 id -> ', categoryId)
    currentCategoryId.value = categoryId
    const response = await apiCall(API_LIST.GET_USER_WORDS_BY_CATEGORY(categoryId))
    if (response.status) {
        const jsonData = JSON.parse(response.data.jsonString).list

        jsonData.forEach(word => {
            word.activeTab = 0
            word.isEditting = false
        })

        console.log('유저 단어 조회 결과 -> ', jsonData)
        wordList.value = jsonData
    }
}

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

const toPage = (url) => {
    router.push(url)
}
</script>

<style scoped>
.my-card {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

.empty-card {
    width: 100%;
    max-width: 350px;

}
</style>