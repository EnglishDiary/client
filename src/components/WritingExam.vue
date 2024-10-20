<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { commonUtils } from '@/utils/commonUtils';

const props = defineProps({
    practiceInfo: Object,
})

const currentData = ref(null)
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
    <div class="q-pa-md" v-if="currentData">
        <span>{{ currentData.translation }}</span>

        <div class="word-groups" v-for="(word, index) in currentData.randomWords" :key="word.id">
            <q-btn @click="toggleWordSelection(word, index)"
                :color="currentData.isWordClicked[index] ? 'secondary' : 'info'" :disable="finished">
                {{ word }}</q-btn>
        </div>

        <q-btn color="primary" @click="reset" :disable="finished">Reset</q-btn>
        <br>

        <div>
            <span v-for="(order, index) in currentData.wordOrders" :key="index">
                {{ currentData.randomWords[order] + ' ' }}
            </span>
        </div>

        <div v-if="userResult">
            <span>{{ userResult }}</span>
            <br>
            <span>정답: {{ currentData.sourceSentence }}</span>
        </div>

    </div>
</template>