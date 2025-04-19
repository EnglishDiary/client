<script setup>
import Pagination from './Pagination.vue'
import { ref, onMounted, computed } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { htmlUtils } from '@/utils/htmlUtils'
import { timeUtils } from '@/utils/timeUtils'
import { useRouter } from 'vue-router';
import { eventBus } from '@/utils/eventBus'

const PAGING = {
    size: 10,
    page: 0
}

const categories = ref([])
const currentCategoryId = ref(0)
const posts = ref([])
const router = useRouter()
const totalPages = ref(0)

const categoryOptions = computed(() => {
    return [
        { label: '전체 카테고리', value: 0 },
        ...categories.value.map(category => ({
            label: category.name,
            value: category.id
        }))
    ]
})

const renewData = (newPage) => {
    fetchDiaries(currentCategoryId.value, { ...PAGING, page: newPage - 1 })
}

const fetchCategories = async () => {
    const response = await apiCall(API_LIST.GET_OFFICIAL_DIARY_CATEGORIES)
    if (response.status) {
        categories.value = response.data
    }
}

const fetchDiaries = async (categoryId, pagingData) => {
    currentCategoryId.value = categoryId

    const parameters = {
        ...pagingData
    }

    const response = await apiCall(API_LIST.GET_DIARIES_BY_OFFICIAL_CATEGORY(categoryId), parameters)
    if (response.status) {
        response.data.forEach((item) => {
            item.content = htmlUtils.stripHtml(item.content)
            item.registerTime = timeUtils.formatDate(item.registerTime)
        })

        posts.value = response.data
        totalPages.value = response.pageInfo.totalPages
    }
}

const handleCategoryChange = (categoryId) => {
    fetchDiaries(categoryId, PAGING)
}

const viewDiaryDetail = (diaryId) => {
    router.push(`/diary/${diaryId}/detail`)
}

onMounted(() => {
    eventBus.on('renew-data', renewData)
    fetchCategories()
    fetchDiaries(0, PAGING)
})
</script>

<template>
    <div class="q-pt-md q-pl-md bg-grey-2">
        <q-select v-model="currentCategoryId" :options="categoryOptions" class="category-select q-mb-md" outlined dense
            options-dense emit-value map-options @update:model-value="handleCategoryChange">
            <template v-slot:prepend>
                <q-icon name="format_list_bulleted" />
            </template>
        </q-select>
    </div>

    <q-page class="bg-grey-2">
        <div class="q-pa-md">
            <q-list separator>
                <q-item v-for="(post, index) in posts" :key="index" class="q-mb-md bg-white">
                    <q-item-section>
                        <div class="row items-center q-mb-sm">
                            <q-avatar size="40px" class="q-mr-sm">
                                <img :src="post.memberProfileUrl">
                            </q-avatar>
                            <div>
                                <div class="text-weight-bold">{{ post.memberName }}</div>
                                <div class="text-caption text-grey">{{ post.registerTime }}</div>
                            </div>
                        </div>

                        <q-item-label class="text-h6 q-mb-sm">{{ post.title }}</q-item-label>
                        <q-item-label class="q-mb-sm text-body2 text-grey-8 content"
                            @click="viewDiaryDetail(post.id)">{{
                                post.content }}</q-item-label>

                        <div class="row items-center q-mt-sm">
                            <q-icon name="favorite_border" size="sm" color="grey" />
                            <span class="q-ml-sm text-grey">{{ post.likes }}</span>
                            <q-icon name="chat_bubble_outline" size="sm" class="q-ml-md" color="grey" />
                            <span class="q-ml-sm text-grey">{{ post.comments }}</span>
                        </div>
                    </q-item-section>

                    <q-item-section side top>
                        <q-img :src="post.thumbnailUrl" style="width: 80px; height: 80px; object-fit: cover;" />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </q-page>
    <Pagination :totalPages="totalPages" />
</template>

<style scoped>
.category-select {
    max-width: 200px;
}

.content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>