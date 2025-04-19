<script setup>
import Pagination from './Pagination.vue';
import { ref, onMounted } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';
import { eventBus } from '@/utils/eventBus'

const totalPages = ref(0)

const PAGING = {
    size: 10,
    page: 0
}

const expressions = ref([]);

const fetchExpressions = async (pagingData) => {
    const parameters = {
        categoryId: 1,
        ...pagingData
    }

    const response = await apiCall(API_LIST.FETCH_EXPRESSIONS, parameters);
    if (response.status) {
        expressions.value = response.data
        totalPages.value = response.pageInfo.totalPages
        console.log('토페 -> ', totalPages)
    }
};

const renewData = (newPage) => {
    fetchExpressions({ ...PAGING, page: newPage - 1 })
}

onMounted(() => {
    eventBus.on('renew-data', renewData)
    fetchExpressions({ ...PAGING });
});
</script>

<template>
    <div class="q-pa-md">
        <q-card v-for="expression in expressions" :key="expression.id" class="q-mb-md">
            <q-card-section>
                <div class="row items-center q-mb-md">
                    <q-avatar>
                        <img :src="expression.user.profileImgUrl" />
                    </q-avatar>
                    <div class="text-h6 q-ml-md">{{ expression.user.name }}</div>
                </div>
                <div class="text-subtitle1 q-mb-sm">궁금한 표현: {{ expression.originalSentence }}</div>
                <div v-if="expression.userSentence" class="text-subtitle1 q-mb-sm">
                    유저의 영작: {{ expression.userSentence }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-h6 q-mb-sm">AI의 제안</div>
                <q-expansion-item v-for="composition in expression.compositions" :key="composition.id"
                    :label="composition.resultSentence" caption="해석을 보려면 클릭하세요">
                    <q-card-section>
                        <div>{{ composition.translation }}</div>
                    </q-card-section>
                </q-expansion-item>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-h6 q-mb-sm">해설</div>
                <div>{{ expression.summary }}</div>
            </q-card-section>
        </q-card>
        <Pagination :totalPages="totalPages" />
    </div>
</template>