<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import MarkedText from './MarkedText.vue'

const route = useRoute()
const { topicId, chapterId, scriptId } = route.params

const script = ref('')
const sentences = ref([])
const currentSentenceIndex = ref(0)
const userQuestion = ref('')
const conversations = ref([])
const loading = ref(false)

// Fetch the script sentences
const fetchScriptSentences = async () => {
  const response = await apiCall(API_LIST.FETCH_SCRIPT_SENTENCES(topicId, chapterId, scriptId))
  if (response.status) {
    script.value = response.data.script
    sentences.value = response.data.sentences
    // Initialize the conversations array with empty arrays for each sentence
    conversations.value = sentences.value.map(() => [])
  }
}

// Computed property to get the current sentence
const currentSentence = computed(() => {
  if (sentences.value.length > 0) {
    return sentences.value[currentSentenceIndex.value].passage
  }
  return ''
})

// Function to go to the previous sentence
const goToPrevious = () => {
  if (currentSentenceIndex.value > 0) {
    currentSentenceIndex.value--
  }
}

// Function to go to the next sentence
const goToNext = () => {
  if (currentSentenceIndex.value < sentences.value.length - 1) {
    currentSentenceIndex.value++
  }
}

// Function to ask a question about the current sentence
const askQuestion = async () => {
  if (!userQuestion.value.trim()) return

  loading.value = true
  
  // Create a new conversation entry for the question
  const questionEntry = {
    type: 'question',
    content: userQuestion.value
  }
  
  conversations.value[currentSentenceIndex.value].push(questionEntry)
  
  try {
    const response = await apiCall(API_LIST.ASK_AI_QUESTION, {
      sentenceId: sentences.value[currentSentenceIndex.value].id,
      topicId,
      chapterId,
      scriptId,
      question: userQuestion.value
    })
    
    if (response.status) {
      const answerEntry = {
        type: 'answer',
        content: response.data.answer
      }
      conversations.value[currentSentenceIndex.value].push(answerEntry)
    } else {
      // Handle error
      conversations.value[currentSentenceIndex.value].push({
        type: 'answer',
        content: 'Sorry, I could not get an answer at this time. Please try again.'
      })
    }
  } catch (error) {
    console.error('Error asking question:', error)
    conversations.value[currentSentenceIndex.value].push({
      type: 'answer',
      content: 'An error occurred while processing your question. Please try again.'
    })
  } finally {
    loading.value = false
    userQuestion.value = '' // Clear the input
  }
}

onMounted(() => {
  fetchScriptSentences()
})
</script>

<template>
  <q-page padding>
    <!-- Script title -->
    <h4 class="q-mb-md">{{ script }}</h4>
    
    <!-- Current sentence card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Sentence {{ currentSentenceIndex + 1 }} / {{ sentences.length }}</div>
        <div class="text-h5 q-mt-sm">{{ currentSentence }}</div>
      </q-card-section>
    </q-card>
    
    <!-- Navigation buttons -->
    <div class="row q-mb-md">
      <q-btn 
        color="primary" 
        icon="arrow_back" 
        label="Previous" 
        :disable="currentSentenceIndex === 0"
        @click="goToPrevious" 
        class="q-mr-sm"
      />
      <q-btn 
        color="primary" 
        icon="arrow_forward" 
        label="Next" 
        :disable="currentSentenceIndex === sentences.length - 1"
        @click="goToNext" 
      />
    </div>
    
    <!-- Question input -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Ask a question about this sentence</div>
        <q-input 
          v-model="userQuestion" 
          filled 
          type="textarea" 
          placeholder="Type your question here..." 
          class="q-mt-sm"
          @keyup.enter.ctrl="askQuestion"
        />
        <div class="q-mt-sm">
          <q-btn 
            color="primary" 
            label="Ask" 
            :loading="loading" 
            @click="askQuestion" 
          />
          <small class="q-ml-sm text-grey">Press Ctrl+Enter to send</small>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Conversation history -->
    <q-card v-if="conversations[currentSentenceIndex] && conversations[currentSentenceIndex].length > 0">
      <q-card-section>
        <div class="text-h6">Conversation History</div>
      </q-card-section>
      
      <q-separator />
      
      <q-card-section v-for="(entry, index) in conversations[currentSentenceIndex]" :key="index">
        <div>
          <strong>{{ entry.type === 'question' ? 'You:' : 'AI:' }}</strong>
          <!-- <div v-html="entry.content" class="q-ml-md"></div> -->
          <MarkedText :content="entry.content"/>
        </div>
        <q-separator class="q-my-sm" v-if="index < conversations[currentSentenceIndex].length - 1" />
      </q-card-section>
    </q-card>
    
    <!-- No conversations message -->
    <q-card v-else>
      <q-card-section class="text-center text-grey">
        No conversations yet. Ask a question to start learning!
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
/* You can add custom styles here */
</style>