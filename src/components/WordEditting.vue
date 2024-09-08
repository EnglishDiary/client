<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    wordDetail: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
})

const selectedCategory = ref(null)

const handleCategoryChange = () => {
    props.wordDetail.categoryId = selectedCategory.value.id
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

const removeDefinition = (meaning, index) => {
    meaning.definitions.splice(index, 1)
}

onMounted(() => {
    console.log('자식 컴포넌트 마운트 -> ', props.wordDetail)
    const categoryId = props.wordDetail.categoryId
    const originalCategory = props.categories.find((item) => {
        return item.id === categoryId
    })

    selectedCategory.value = originalCategory
})


</script>

<template>
    <q-select v-model="selectedCategory" :options="categories" label="카테고리" option-value="id" option-label="name"
        @update:model-value="handleCategoryChange"></q-select>
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