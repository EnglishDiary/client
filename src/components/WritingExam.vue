<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { commonUtils } from '@/utils/commonUtils';

const currentData = ref(null)
const userResult = ref('')

const totalResult = []
let originalData = []

let currentIndex = 0
let countOfClickedWords = 0


const fetchExamSentences = async () => {
    const response = await apiCall(API_LIST.FETCH_EXAM_SENTENCES)
    if (response.status) {
        originalData = commonUtils.shuffleArray(response.data)

        originalData.forEach((item) => {
            const words = item.sourceSentence.split(' ')
            item.randomWords = commonUtils.shuffleArray(words)
            item.totalWordCount = words.length
            item.wordOrders = []
            item.isWordClicked = Array(words.length).fill(false);
        })

        currentData.value = originalData[currentIndex]
    }
}

const toggleWord = (selectedWord, index) => {
    const clickedArray = currentData.value.isWordClicked

    if (!clickedArray[index]) {
        countOfClickedWords++
        clickedArray[index] = true
        currentData.value.wordOrders.push(index)
    } else {
        countOfClickedWords--
        clickedArray[index] = false
        currentData.value.wordOrders = currentData.value.wordOrders.filter((order) => {
            return order !== index
        })
    }

    if (currentData.value.totalWordCount == countOfClickedWords) {
        checkUserSentence()
        moveToNextWord()
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
        checkUserSentence()
        moveToNextWord()
    }
}


const checkUserSentence = () => {
    const correctSentence = currentData.value.sourceSentence
    const correctWordOrders = correctSentence.split(' ')

    let isCorrect = true
    let userSentence = ''
    currentData.value.wordOrders.forEach((order, index) => {
        userSentence += currentData.value.randomWords[order] + ' '
        if (correctWordOrders[index] != currentData.value.randomWords[order]) {
            isCorrect = false
        }
    })

    if (isCorrect) {
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
    }, 3000);
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
                :color="currentData.isWordClicked[index] ? 'secondary' : 'info'">
                {{ word }}</q-btn>
        </div>

        <q-btn color="primary" @click="reset">Reset</q-btn>
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