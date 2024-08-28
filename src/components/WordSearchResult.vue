<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

// reactive state
const word = ref('')
const wordDetails = ref({})
const audio = ref(new Audio())
const activeTab = ref(0)
const categories = ref([])
const selectedCategory = ref(null)

const findWord = async () => {
    const result = await apiCall(API_LIST.FIND_WORD(word.value))
    if (result.status) {
        activeTab.value = 0
        wordDetails.value = result.data[0]
    }
}

const playAudio = (url) => {
    audio.value.src = url
    audio.value.play()
}

const identifyCountry = (audioUrl) => {
    if (audioUrl.includes('uk.mp3')) {
        return 'uk'
    } else if (audioUrl.includes('us.mp3')) {
        return 'us'
    } else {
        return ''
    }
}

const removeDefinition = (meaning, index) => {
    meaning.definitions.splice(index, 1)
}

const addUserExample = (definition) => {
    console.log('데피니 -> ', definition)
    // userExamples.value.push('')

    if (!definition.userExamples) {
        definition.userExamples = []
    }

    definition.userExamples.push('')
}

const removeUserExample = (definition, index) => {
    definition.userExamples.splice(index, 1)
}

const checkWordDetails = () => {
    console.log(wordDetails.value)
}

const addNewWord = async () => {
    const payload = {
        jsonData: JSON.stringify(wordDetails.value),
        categoryId: selectedCategory.value?.id
    }
    const result = await apiCall(API_LIST.SAVE_WORD(wordDetails.value.word), payload)
    console.log('api 호출 결과 -> ', result)
}

onMounted(async () => {
    const response = await apiCall(API_LIST.GET_USER_CATEGORIES)
    if (response.status) {
        categories.value = response.data
    }
})

</script>

<template>
    <div>
        <div class="q-pa-md" style="max-width: 500px">
            <q-input v-model="word" label="type word you want to search" />
            <q-btn color="primary" label="search" @click="findWord"></q-btn>

            <div class="q-mt-md" v-if="wordDetails.word">
                <div>
                    <span class="text-h4">{{ wordDetails.word }}</span>
                    <span class="text-h6">( {{ wordDetails.phonetic }} )</span>
                </div>
                <div class="row q-col-gutter-sm">
                    <div class="col">
                        <template v-for="phonetic in wordDetails.phonetics" :key="phonetic.audio">
                            <q-btn @click="playAudio(phonetic.audio)" color="primary"
                                v-if="identifyCountry(phonetic.audio)" :label="identifyCountry(phonetic.audio)" />
                        </template>
                    </div>
                    <div class="col">
                        <q-select v-model="selectedCategory" :options="categories" option-value="id" option-label="name"
                            label="단어장 선택" />
                    </div>
                </div>
            </div>

            <div>
                <q-card>
                    <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary"
                        align="justify" narrow-indicator>
                        <!-- TODO 240824 아래처럼 template 굳이 쓸 필요 없고 그냥 v-for를 q-tab안에다 넣으면 됨. 
                         나머지 컴포넌트에서도 쓸 데 없이 반복문 적용할 때 template 태그 쓴 거 찾아서 리팩토링하기-->
                        <template v-for="(meaning, index) in wordDetails.meanings" :key="index">
                            <q-tab :name="index" :label="meaning.partOfSpeech" />
                        </template>
                    </q-tabs>

                    <q-tab-panels v-model="activeTab" animated>
                        <q-tab-panel v-for="(meaning, index) in wordDetails.meanings" :key="index" :name="index">
                            <div class="q-mt-xl" v-for="(item, index) in meaning.definitions" :key="index">
                                <span>뜻{{ index + 1 }}.</span>
                                <q-btn @click="removeDefinition(meaning, index)" flat style="color: #FF0080"
                                    label="삭제" />
                                <q-input v-model="item.definition" :dense="true" autogrow />

                                <span>예문</span>
                                <q-input v-if="item.example" v-model="item.example" :dense="true" autogrow />
                                <template v-for="(el, elIdx) in item.userExamples" :key="elIdx">
                                    <q-input v-model="item.userExamples[elIdx]" :dense="true" autogrow />
                                    <q-btn @click="removeUserExample(item, elIdx)">X</q-btn>
                                </template>
                                <br>
                                <q-btn @click="addUserExample(item)">예문 추가</q-btn>
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>
                </q-card>
            </div>
        </div>
    </div>
    <q-btn @click="checkWordDetails">워드디테일 확인</q-btn>
    <q-btn @click="addNewWord">단어등록</q-btn>
</template>