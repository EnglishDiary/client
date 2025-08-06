<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import MarkedText from './MarkedText.vue'

const route = useRoute()
const { topicId, chapterId, scriptId } = route.params

const script = ref('')
const chapter = ref({})
const sentences = ref([])
const currentSentenceIndex = ref(0)
const userQuestion = ref('')
const conversations = ref([])
const loading = ref(false)
const showMoveInput = ref(false)
const specificSentenceIndex = ref(0)
const prevSentenceCount = ref(0)
const nextSentenceCount = ref(0)


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

const fetchChapter = async () => {
  const response = await apiCall(API_LIST.FETCH_CHAPTER(chapterId))
  if (response.status) {
    chapter.value = response.data    
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
  if (specificSentenceIndex.value < 0 || specificSentenceIndex.value > sentences.value.length - 1) {
    alert('Invalid Index')
    return
  }

  currentSentenceIndex.value = Number.parseInt(specificSentenceIndex.value)
  showMoveInput.value = !showMoveInput.value
  loadConversation()
}

const goToBookmark = () => {
  currentSentenceIndex.value = Number.parseInt(chapter.value.bookmarkIndex)
  loadConversation()
}

const ttsTest = () => {
  const ACCESS_TOKEN = 'access_token'

  const userToken = localStorage.getItem(ACCESS_TOKEN);

  fetch('http://localhost:8081/study/tts/synthesize', {
      
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
          text: 'Hello, this is a sample text for English learning. I am sanguk choi nice to meet you! Please introduce yourself in front of us. What I like to do is programming.',
          languageCode: 'en-US'
      })
  })
  .then(response => response.blob())
  .then(blob => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
  });
}

// Function to go to the next sentence
const goToNext = () => {
  if (currentSentenceIndex.value < sentences.value.length - 1) {
    currentSentenceIndex.value++
  }
  loadConversation()
}

const InitializeRange = () => {
  prevSentenceCount.value = 0
  nextSentenceCount.value = 0
}

const validateRange = (start, end) => {
  console.log(start, end)
  if (start == 0 && end == 0) {
    return false
  }

  if (start < 0) {
    return false
  }

  if (end > sentences.value.length - 1) {
    return false
  }

  return true
}

const saveBookmark = () => {
  const currentIndex = currentSentenceIndex.value
  console.log('chapter ->', chapter.value.bookmarkIndex)
  if (chapter.value.bookmarkIndex == currentIndex) {
    return
  }
  
  chapter.value.bookmarkIndex = currentIndex
  apiCall(API_LIST.SAVE_BOOKMARK(chapterId, currentIndex))
}

const loadConversation = () => {
  const currentConversations = conversations.value[currentSentenceIndex.value]
  if (currentConversations.length == 0) {
    fetchScriptConversations()
  }
}

// Function to ask a question about the current sentence
const askQuestion = async () => {
  const startIndex = currentSentenceIndex.value - Number.parseInt(prevSentenceCount.value)
  const endIndex = currentSentenceIndex.value + Number.parseInt(nextSentenceCount.value)

  if (!validateRange(startIndex, endIndex)) {
    alert('Invalid Range')
    return
  }

  const linkedSentences = []
  for (let i=0; i<= endIndex - startIndex; i++) {
    const sentenceIndex = startIndex + i
    linkedSentences.push(sentences.value[sentenceIndex].passage)    
  }

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
      question: userQuestion.value,
      linkedSentences,
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
  await fetchChapter()
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
          <q-btn v-if="!showMoveInput" @click="toggleMoveInput">
            <span>move</span>
          </q-btn>
          <q-btn v-else @click="goToSpecific()">
            <span>finished</span>
          </q-btn>
          &nbsp;
          <q-btn 
            :class="{ 
              'bookmark-active': currentSentenceIndex === chapter.bookmarkIndex 
            }"          
            @click="saveBookmark()">
            save bookmark
          </q-btn>
          &nbsp;
          <q-btn @click="goToBookmark()">
            go to bookmark
          </q-btn>

          <q-btn @click="ttsTest()">
            TTS TEST
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

    <q-btn @click="InitializeRange">
      Initialize Range
    </q-btn>          

    <q-input v-model="prevSentenceCount" aria-label="start" type="number"></q-input>
    <q-input v-model="nextSentenceCount" aria-label="end" type="number"></q-input>

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
  .bookmark-active {
    background-color: yellowgreen
  }
</style>
