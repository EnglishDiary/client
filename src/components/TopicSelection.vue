<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const emit = defineEmits(['complete-step-one']);

const selectedlevel = ref(null);
const selectedTopic = ref(null);

const levelOptions = [
    { label: '초급', value: 'LOW' },
    { label: '중급', value: 'MID' },
];

// MEMO - https://fonts.google.com/icons?icon.set=Material+Icons
// 아이콘 클릭해서 상세보기 한 다음에 2번째 거(소문자로 된 글씨) copy code 해서 q-icon 태그 name 속성값으로 넣으면 됨
const topics = [
    { label: '여행', value: '1', icon: 'flight' },
    { label: '음식', value: '2', icon: 'restaurant' },
    { label: '취미', value: '3', icon: 'sports_basketball' },
];

const isFormValid = computed(() => {
    return selectedlevel.value && selectedTopic.value;
});

const startPractice = () => {
    if (isFormValid.value) {
        const selectionInfo = {
            level: selectedlevel.value,
            topicId: selectedTopic.value
        };

        // 부모 컴포넌트로 이벤트 발생 및 데이터 전달
        emit('complete-step-one', selectionInfo);
    }
};

</script>

<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 100%; max-width: 600px;">
            <h2 class="text-h4 text-center q-mb-md">영작 연습</h2>

            <div class="q-mb-lg">
                <h3 class="text-h5 q-mb-sm">난이도 선택</h3>
                <div class="row q-col-gutter-sm">
                    <div v-for="option in levelOptions" :key="option.value" class="col-4">
                        <q-btn :label="option.label" :color="selectedlevel === option.value ? 'primary' : 'grey-3'"
                            :text-color="selectedlevel === option.value ? 'white' : 'black'"
                            @click="selectedlevel = option.value" class="full-width"
                            :outline="selectedlevel !== option.value" />
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-h5 q-mb-sm">주제 선택</h3>
                <div class="row q-col-gutter-md">
                    <div v-for="topic in topics" :key="topic.value" class="col-6 col-sm-4">
                        <q-card clickable v-ripple :class="{ 'bg-primary text-white': selectedTopic === topic.value }"
                            @click="selectedTopic = topic.value">
                            <q-card-section class="text-center">
                                <q-icon :name="topic.icon" size="3rem" />
                                <div class="text-subtitle1 q-mt-sm">{{ topic.label }}</div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>

            <div class="q-mt-lg">
                <q-btn color="secondary" label="다음" @click="startPractice" :disable="!isFormValid" class="full-width" />
            </div>
        </div>
    </q-page>
</template>
