<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

// reactive state
const word = ref('')
const wordDetails = ref({})
const audio = ref(new Audio())
const activeTab = ref('')

const findWord = async () => {
    const result = await apiCall(API_LIST.FIND_WORD(word.value))
    if (result.status) {
        wordDetails.value = result.data[0]
        activeTab.value = result.data[0].meanings[0].partOfSpeech
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

const removeDefinition = (partOfSpeech, index) => {
    const meanigns = wordDetails.value.meanings
    const definitions = meanigns.find((item) => {
        return item.partOfSpeech === partOfSpeech
    }).definitions

    definitions.splice(index, 1)
}

onMounted(() => {
    console.log(`마운티드~~`)
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
                </div>
            </div>

            <div>
                <q-card>
                    <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary"
                        align="justify" narrow-indicator>
                        <template v-for="(meaning, index) in wordDetails.meanings" :key="index">
                            <q-tab :name="meaning.partOfSpeech" :label="meaning.partOfSpeech" />
                        </template>
                    </q-tabs>

                    <q-tab-panels v-model="activeTab" animated>
                        <q-tab-panel v-for="(meaning, index) in wordDetails.meanings" :key="index"
                            :name="meaning.partOfSpeech">
                            <div v-for="(item, index) in meaning.definitions" :key="index">
                                <span>뜻{{ index + 1 }}.</span>
                                <q-btn @click="removeDefinition(meaning.partOfSpeech, index)" flat
                                    style="color: #FF0080" label="삭제하기" />
                                <q-input v-model="item.definition" :dense="true" autogrow />
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>


                </q-card>

            </div>


        </div>
    </div>
</template>