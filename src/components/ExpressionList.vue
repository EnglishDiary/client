<script setup>
import { ref, onMounted } from 'vue';
import { apiCall } from '@/utils/apiCall';
import { API_LIST } from '@/utils/apiList';

const expressions = ref([]);

const fetchExpressions = async () => {
    const response = await apiCall(API_LIST.FETCH_EXPRESSIONS);
    if (response.status) {
        expressions.value = response.data;
    }
};

onMounted(() => {
    fetchExpressions();
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
    </div>
</template>