<script setup>
import { ref, onMounted } from 'vue'
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'
import { htmlUtils } from '@/utils/htmlUtils';
import { timeUtils } from '@/utils/timeUtils';
import { useRouter } from 'vue-router';

const categories = ref([])
const posts = ref([])
const router = useRouter()

const fetchCategories = async () => {
    const response = await apiCall(API_LIST.GET_OFFICIAL_DIARY_CATEGORIES)
    if (response.status) {
        categories.value = response.data
    }
}

const fetchDiaries = async (categoryId) => {
    const response = await apiCall(API_LIST.GET_DIARIES_BY_OFFICIAL_CATEGORY(categoryId))
    if (response.status) {
        response.data.forEach((item) => {
            item.content = htmlUtils.stripHtml(item.content)
            item.registerTime = timeUtils.formatDate(item.registerTime)
        })

        posts.value = response.data
    }
}

const viewDiaryDetail = (diaryId) => {
    router.push(`/diary/${diaryId}/detail`)
}

onMounted(() => {
    fetchCategories()
    fetchDiaries(0)
})

</script>

<template>
    <div>
        <q-btn @click="fetchDiaries(0)">
            all
        </q-btn>
        <q-btn @click="fetchDiaries(category.id)" v-for="category in categories" :key="category.id">
            {{ category.name }}
        </q-btn>
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
                            @click="viewDiaryDetail(post.id)">{{ post.content }}</q-item-label>

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
</template>

<style scoped>
.content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>