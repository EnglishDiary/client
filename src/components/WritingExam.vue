<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { commonUtils } from '@/utils/commonUtils';

const currentData = ref(null)
const userSentence = ref('')
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
        })

        currentData.value = originalData[currentIndex]
        let clicked = []
        for (let i = 0; i < currentData.value.randomWords.length; i++) {
            clicked.push(false)
        }
        currentData.value.clicked = clicked
    }
}

const toggleWord = (selectedWord, index) => {
    const clicked = currentData.value.clicked
    if (!clicked[index]) {
        countOfClickedWords++
        clicked[index] = true
        if (userSentence.value == '') {
            userSentence.value += selectedWord
            return
        }
        userSentence.value += ' ' + selectedWord
    } else {
        countOfClickedWords--
        clicked[index] = false
    }

    if (currentData.value.totalWordCount == countOfClickedWords) {
        checkUserSentence()
        moveToNextWord()
    }
}

const checkUserSentence = () => {
    if (userSentence.value == currentData.value.sourceSentence) {
        userResult.value = 'Great :)'
        currentData.value.isCorrect = true
    } else {
        userResult.value = 'Wrong :('
        currentData.value.isCorrect = false
    }
}

const moveToNextWord = () => {
    currentData.userSentence = userSentence.value
    totalResult.push(currentData.value)

    currentIndex++
    setTimeout(() => {
        countOfClickedWords = 0
        userSentence.value = ''
        userResult.value = ''

        currentData.value = originalData[currentIndex]
    }, 3000);
}

const reset = () => {
    const clicked = currentData.value.clicked
    userSentence.value = ''
    countOfClickedWords = 0
    for (let i = 0; i < clicked.length; i++) {
        clicked[i] = false
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
            <q-btn @click="toggleWord(word, index)" :color="currentData.clicked[index] ? 'secondary' : 'info'">{{ word
                }}</q-btn>
        </div>

        <q-btn color="primary" @click="reset">Reset</q-btn>
        <br>
        <span>{{ userSentence }}</span>

        <div v-if="userResult">
            <span>{{ userResult }}</span>
        </div>

    </div>
</template>