<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

const wordList = ref([])
const audio = ref(new Audio())

onMounted(async () => {
    const result = await apiCall(API_LIST.GET_USER_WORDS)
    const jsonData = JSON.parse(result.data).list

    jsonData.forEach(element => {
        element.activeTab = 0
    })

    console.log('유저 단어 조회 결과 -> ', jsonData)
    wordList.value = jsonData
})

</script>

<template>
    <div>
        <div class="q-pa-md" style="max-width: 500px">
            <div v-for="(word, wordIdx) in wordList" :key="wordIdx">
                <div class="q-mt-md">
                    <span class="text-h4">{{ word.word }}</span>
                    <span class="text-h6">( {{ word.phonetic }} )</span>
                    <q-btn>수정하기</q-btn>
                    <q-btn>삭제하기</q-btn>
                </div>
                <q-card>
                    <q-tabs v-model="word.activeTab" dense class="text-grey" active-color="primary"
                        indicator-color="primary" align="justify" narrow-indicator>
                        <template v-for="(meaning, index) in word.meanings" :key="index">
                            <q-tab :name="index" :label="meaning.partOfSpeech" />
                        </template>
                    </q-tabs>

                    <q-tab-panels v-model="word.activeTab" animated>
                        <q-tab-panel v-for="(meaning, index) in word.meanings" :key="index" :name="index">
                            <div class="q-mt-xl" v-for="(item, index) in meaning.definitions" :key="index">
                                <span>뜻{{ index + 1 }}.</span>
                                <!-- <q-btn @click="removeDefinition(meaning, index)" flat style="color: #FF0080"
                                    label="삭제" /> -->
                                <!-- <q-input v-model="item.definition" :dense="true" autogrow /> -->
                                <span>{{ item.definition }}</span>

                                <div>예문</div>
                                <!-- <q-input v-if="item.example" v-model="item.example" :dense="true" autogrow />
                                <template v-for="(el, elIdx) in item.userExamples" :key="elIdx">
                                    <q-input v-model="item.userExamples[elIdx]" :dense="true" autogrow />
                                    <q-btn @click="removeUserExample(item, elIdx)">X</q-btn>
                                </template> -->
                                <template v-for="(el, elIdx) in item.examples" :key="elIdx">
                                    <ul>
                                        <li>예문{{ elIdx + 1 }}. {{ el.example }}</li>
                                    </ul>
                                </template>

                                <br>
                                <!-- <q-btn @click="addUserExample(item)">예문 추가</q-btn> -->
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>

                </q-card>
            </div>

        </div>
    </div>
</template>