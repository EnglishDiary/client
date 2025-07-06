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
const showMoveInput = ref(false)
const specificSentenceIndex = ref(0)

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

const fetchScriptConversations = async () => {
  const sentenceId = sentences.value[currentSentenceIndex.value].id
  const response = await apiCall(API_LIST.FETCH_SENTENCE_CONVERSATIONS(sentenceId))
  if (response.status) {
    conversations.value[currentSentenceIndex.value] = response.data
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

  const currentConversations = conversations.value[currentSentenceIndex.value]
  if (currentConversations.length == 0) {
    fetchScriptConversations()
  }
}

const toggleMoveInput = () => {
  showMoveInput.value = !showMoveInput.value  
}

const goToSpecific = () => {
  console.log(specificSentenceIndex.value)
  currentSentenceIndex.value = Number.parseInt(specificSentenceIndex.value)
  loadConversation()
}

// Function to go to the next sentence
const goToNext = () => {
  if (currentSentenceIndex.value < sentences.value.length - 1) {
    currentSentenceIndex.value++
  }
  loadConversation()
}

const loadConversation = () => {
  const currentConversations = conversations.value[currentSentenceIndex.value]
  if (currentConversations.length == 0) {
    fetchScriptConversations()
  }
}

// Function to ask a question about the current sentence
const askQuestion = async () => {
  if (!userQuestion.value.trim()) {
    return
  }
  loading.value = true

  try {
    const response = await apiCall(API_LIST.ASK_AI_QUESTION, {
      sentenceId: sentences.value[currentSentenceIndex.value].id,
      topicId,
      chapterId,
      scriptId,
      question: userQuestion.value
    })

    if (response.status) {
      const conversation = {
        userQuestion: userQuestion.value,
        aiAnswer: response.data.answer,
      }
      conversations.value[currentSentenceIndex.value].push(conversation)
    } else {
      // Handle error
      conversations.value[currentSentenceIndex.value].push({
        userQuestion: userQuestion.value,
        aiAnswer: 'Sorry, I could not get an answer at this time. Please try again.'
      })
    }
  } catch (error) {
    console.error('Error asking question:', error)
    conversations.value[currentSentenceIndex.value].push({
      userQuestion: userQuestion.value,
      aiAnswer: 'Sorry, I could not get an answer at this time. Please try again.'
    })
  } finally {
    loading.value = false
    userQuestion.value = '' // Clear the input
  }
}

onMounted(async () => {
  await fetchScriptSentences()
  await fetchScriptConversations()
})
</script>

<template>
  <q-page padding>
    <!-- Script title -->
    <h4 class="q-mb-md">{{ script }}</h4>

    <!-- Current sentence card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">
          {{ currentSentenceIndex + 1 }} / {{ sentences.length }}
          <q-btn @click="toggleMoveInput">
            <span v-if="!showMoveInput">move</span>
            <span v-else @click="goToSpecific()">finished</span>
          </q-btn>          
          <q-input v-model="specificSentenceIndex" v-if="showMoveInput" type="number"></q-input>          
        </div>
        <div class="text-h5 q-mt-sm">{{ currentSentence }}</div>
      </q-card-section>
    </q-card>

    <!-- Navigation buttons -->
    <div class="row q-mb-md">
      <q-btn color="primary" icon="arrow_back" label="Previous" :disable="currentSentenceIndex === 0"
        @click="goToPrevious" class="q-mr-sm" />
      <q-btn color="primary" icon="arrow_forward" label="Next" :disable="currentSentenceIndex === sentences.length - 1"
        @click="goToNext" />
    </div>

    <!-- Question input -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Ask a question about this sentence</div>
        <q-input v-model="userQuestion" filled type="textarea" placeholder="Type your question here..." class="q-mt-sm"
          @keyup.enter.ctrl="askQuestion" />
        <div class="q-mt-sm">
          <q-btn color="primary" label="Ask" :loading="loading" @click="askQuestion" />
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
        <strong>{{ '#' + (index + 1) }}</strong>
        <div>
          <strong>You:</strong>
          <!-- <div v-html="entry.content" class="q-ml-md"></div> -->
          <MarkedText :content="entry.userQuestion" />
        </div>
        <q-separator class="q-my-sm" v-if="index < conversations[currentSentenceIndex].length - 1" />
        <div>
          <strong>AI:</strong>
          <MarkedText :content="entry.aiAnswer" />
        </div>

        <q-separator class="q-my-xl" />

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