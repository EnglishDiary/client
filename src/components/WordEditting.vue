<script setup>
const props = defineProps({
    wordDetail: {
        type: Object,
        required: true
    }
})

import { ref, onMounted } from 'vue'

onMounted(() => {
    console.log('자식 컴포넌트 마운트 -> ', props.wordDetail)
})

</script>

<template>
    <q-tab-panels v-model="wordDetail.activeTab" animated>
        <q-tab-panel v-for="(meaning, index) in wordDetail.meanings" :key="index" :name="index">
            <div class="q-mt-xl" v-for="(item, index) in meaning.definitions" :key="index">
                <span>뜻{{ index + 1 }}.</span>
                <q-btn @click="removeDefinition(meaning, index)" flat style="color: #FF0080" label="삭제" />
                <q-input v-model="item.definition" :dense="true" autogrow />

                <div>예문</div>
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

</template>