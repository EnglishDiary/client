<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { commonUtils } from '@/utils/commonUtils';

const props = defineProps({
    practiceInfo: Object,
})

const currentData = ref({})
const userResult = ref('')
const finished = ref(false)

const totalResult = []
let originalData = []

let currentIndex = 0
let countOfClickedWords = 0


const fetchExamSentences = async () => {
    const response = await apiCall(API_LIST.FETCH_EXAM_SENTENCES, props.practiceInfo)
    if (response.status) {
        originalData = commonUtils.shuffleArray(response.data)

        originalData.forEach((item) => {
            let words
            words = item.sourceSentence.split(' ')
            if (words.length >= 16) {
                words = commonUtils.combineWords(words, 3)
            } else if (words.length >= 8) {
                words = commonUtils.combineWords(words, 2)
            }

            item.randomWords = commonUtils.shuffleArray(words)
            item.totalWordCount = words.length
            item.wordOrders = []
            item.isWordClicked = Array(words.length).fill(false);
        })

        currentData.value = originalData[currentIndex]
    }
}

const toggleWordSelection = (selectedWord, index) => {
    const { isWordClicked, wordOrders, totalWordCount } = currentData.value;
    if (!isWordClicked[index]) {
        countOfClickedWords++;
        isWordClicked[index] = true;
        wordOrders.push(index);
    } else {
        countOfClickedWords--;
        isWordClicked[index] = false;
        currentData.value.wordOrders = wordOrders.filter(order => order !== index);
    }

    if (totalWordCount == countOfClickedWords) {
        finished.value = true
        checkUserSentence()
        moveToNextWord()
    }
}


const checkUserSentence = () => {
    const correctSentence = currentData.value.sourceSentence
    let userSentence = ''
    currentData.value.wordOrders.forEach((order) => {
        userSentence += currentData.value.randomWords[order] + ' '
    })
    userSentence = userSentence.trim()

    if (userSentence == correctSentence) {
        userResult.value = 'Great :)'
        currentData.value.isCorrect = true
    } else {
        userResult.value = 'Wrong :('
        currentData.value.isCorrect = false
    }

    currentData.userSentence = userSentence
}

const moveToNextWord = () => {
    // 241018 TODO: 문제 끝까지 도달했을 때 통계처리 필요
    totalResult.push(currentData.value)

    currentIndex++
    setTimeout(() => {
        countOfClickedWords = 0
        userResult.value = ''

        currentData.value = originalData[currentIndex]
        finished.value = false
    }, 4000);
}

const reset = () => {
    const clickedArray = currentData.value.isWordClicked
    currentData.value.wordOrders = []
    countOfClickedWords = 0
    for (let i = 0; i < clickedArray.length; i++) {
        clickedArray[i] = false
    }
}

onMounted(() => {
    fetchExamSentences()
})

</script>

<template>
    <q-page class="flex flex-center q-pa-sm">
        <q-card class="word-placement-card q-pa-md">
            <q-card-section>
                <div class="text-subtitle1 text-center q-mb-sm">{{ currentData.translation }}</div>
                <div class="word-groups q-gutter-xs q-mb-md">
                    <q-btn v-for="(word, index) in currentData.randomWords" :key="word.id"
                        @click="toggleWordSelection(word, index)"
                        :color="currentData.isWordClicked[index] ? 'secondary' : 'primary'" :disable="finished" rounded
                        dense unelevated class="text-caption q-pa-sm">
                        {{ word }}
                    </q-btn>
                </div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
                <div class="row items-center q-mb-xs">
                    <div class="text-caption q-mr-sm">Your Answer:</div>
                    <q-btn color="negative" @click="reset" :disable="finished" rounded dense unelevated
                        class="text-caption">
                        Reset
                    </q-btn>
                </div>
                <div class="user-answer q-pa-sm q-mb-md">
                    <span v-for="(order, index) in currentData.wordOrders" :key="index" class="q-mr-xs text-body2">
                        {{ currentData.randomWords[order] }}
                    </span>
                </div>
            </q-card-section>

            <q-card-section v-if="userResult" class="q-pa-sm">
                <div class="result-feedback q-mb-md"
                    :class="{ 'correct': currentData.isCorrect, 'incorrect': !currentData.isCorrect }">
                    <q-icon :name="currentData.isCorrect ? 'check_circle' : 'cancel'" size="28px" class="q-mr-sm" />
                    <span class="text-subtitle1">{{ userResult }}</span>
                </div>
                <div v-if="!currentData.isCorrect" class="correct-answer q-pa-sm q-mb-md">
                    <div class="text-caption q-mb-xs">Correct Answer:</div>
                    <div class="text-body2">{{ currentData.sourceSentence }}</div>
                </div>
            </q-card-section>

        </q-card>
    </q-page>
</template>


<style scoped>
.word-placement-card {
    max-width: 500px;
    width: 100%;
}

.word-groups {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.user-answer {
    background-color: #f0f0f0;
    border-radius: 8px;
    min-height: 40px;
}
</style>
