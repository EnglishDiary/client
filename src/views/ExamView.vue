<script setup>
import TopicSelection from '@/components/TopicSelection.vue';
import WritingExam from '@/components/WritingExam.vue';
import ExamTypeSelection from '@/components/ExamTypeSelection.vue';

import { ref, onMounted } from 'vue'

const step = ref(1)
const practiceInfo = ref({});

const handleStepComplete = (selectionInfo) => {
    // 선택 정보를 저장
    practiceInfo.value = { ...practiceInfo.value, ...selectionInfo };

    // 다음 단계로 이동
    step.value += 1;
    console.log('연습정보 -> ', practiceInfo)
};

</script>

<template>
    <TopicSelection v-if="step == 1" @complete-step-one="handleStepComplete"></TopicSelection>
    <ExamTypeSelection v-if="step == 2" @complete-step-two="handleStepComplete"></ExamTypeSelection>
    <WritingExam v-if="step == 3" :practiceInfo="practiceInfo"></WritingExam>
</template>
