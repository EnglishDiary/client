<script setup>
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { ref, onMounted } from 'vue'

const categories = ref([])
const newCategory = ref('')
const deletedCategoryIds = ref([])

const fetchWordCategories = async () => {
    const response = await apiCall(API_LIST.GET_USER_CATEGORIES)
    if (response.status) {
        categories.value = response.data
    }
}

const addCategory = () => {
    if (newCategory.value.trim()) {
        categories.value.push({ name: newCategory.value })
        newCategory.value = ''
    }
}

const deleteCategory = (index) => {
    const deletedItem = categories.value.splice(index, 1)[0]
    if (deletedItem.id) {
        deletedCategoryIds.value.push(deletedItem.id)
    }
}

const updateCategory = async () => {
    const paramters = {
        categories: categories.value,
        deletedCategoryIds: deletedCategoryIds.value
    }
    const response = await apiCall(API_LIST.UPDATE_USER_WORD_CATEGORY, paramters)
    if (response.status) {
        alert(response.message)
        fetchWordCategories()
    }

}

onMounted(() => {
    fetchWordCategories()
})
</script>

<template>
    <q-page padding>
        <q-card flat bordered>
            <q-card-section class="row">
                <div class="text-h6">단어장 카테고리</div>
                &nbsp;&nbsp;<q-btn @click="updateCategory">저장하기</q-btn>
            </q-card-section>

            <q-card-section>
                <q-list bordered>
                    <q-item v-for="(category, index) in categories" :key="index">
                        <q-item-section>
                            <q-input v-model="category.name" dense />
                        </q-item-section>
                        <q-item-section side>
                            <q-btn icon="delete" @click="deleteCategory(index)" color="negative" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-section>
                <div class="row items-center">
                    <q-input v-model="newCategory" label="Add New Category" dense class="col" />
                    <q-btn @click="addCategory" label="추가" color="primary" class="q-ml-sm" />
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>
