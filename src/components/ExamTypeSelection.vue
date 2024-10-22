<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 100%; max-width: 600px;">
            <h2 class="text-h4 text-center q-mb-md">영작 연습</h2>

            <div class="q-mb-lg">
                <h3 class="text-h5 q-mb-sm">연습 유형</h3>
                <q-btn-toggle v-model="selectedExamType" :options="examTypeOptions" class="full-width" spread />
            </div>

            <div class="q-mb-lg">
                <h3 class="text-h5 q-mb-sm">문장 개수</h3>
                <q-btn-toggle v-model="selectedSentenceCount" :options="sentenceCountOptions" class="full-width"
                    spread />
            </div>

            <div class="q-mb-lg">
                <!-- <h3 class="text-h5 q-mb-sm">테스트 구성</h3> -->
                <q-btn-toggle v-model="selectedSentenceSet" :options="sentenceSetOptions" class="full-width" spread />
            </div>

            <div class="q-mt-lg">
                <q-btn color="secondary" label="연습 시작" @click="startExam" :disable="!isFormValid" class="full-width" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const selectedExamType = ref(null)
const selectedSentenceCount = ref(null)
const selectedSentenceSet = ref(null)

const examTypeOptions = [
    { label: '단어 배치', value: 'word_placement' },
    // { label: '음성 인식', value: 'voice_recognition' },
    // { label: '타이핑', value: 'typing' },
    // { label: '혼합', value: 'all_together' },
]

const sentenceCountOptions = [
    { label: '10개', value: 10 },
    { label: '20개', value: 20 },
    { label: '30개', value: 30 }
]

const sentenceSetOptions = [
    { label: '기존 SET', value: 'existing' },
    // { label: '새로운 SET', value: 'new' },
]

const isFormValid = computed(() => {
    return selectedExamType.value
        && selectedSentenceCount.value
    // && selectedSentenceSet.value;
})

const emit = defineEmits(['complete-step-two'])

const startExam = () => {
    if (isFormValid.value) {
        const examInfo = {
            examType: selectedExamType.value,
            sentenceCount: selectedSentenceCount.value,
            sentenceSet: selectedSentenceSet.value
        }

        emit('complete-step-two', examInfo);
    }
}
</script>