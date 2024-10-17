<script setup>

import { ref, computed } from 'vue'

const props = defineProps({
    revisedVersion: String,
    translation: String,
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const isHorizontalLayout = ref(true)
const showTranslationModal = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

</script>

<template>
    <!-- 한국어 해석 모달 -->
    <!-- Translation Modal with Switchable Layout -->
    <q-dialog v-model="showTranslationModal">
        <q-card style="width: 900px; max-width: 90vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">첨삭된 일기 번역</div>
                <q-space />
                <q-btn-group flat>
                    <q-btn icon="view_column" :color="isHorizontalLayout ? 'primary' : 'grey'"
                        @click="isHorizontalLayout = true" />
                    <q-btn icon="view_stream" :color="!isHorizontalLayout ? 'primary' : 'grey'"
                        @click="isHorizontalLayout = false" />
                </q-btn-group>
                <q-btn icon="close" flat round dense v-close-popup class="q-ml-sm" />
            </q-card-section>
            <q-card-section :class="{ 'row': isHorizontalLayout, 'column': !isHorizontalLayout }">
                <!-- Revised Diary -->
                <div :class="{ 'col-6': isHorizontalLayout, 'q-mb-md': !isHorizontalLayout }">
                    <div class="text-subtitle2">첨삭된 일기</div>
                    <q-separator class="q-my-sm" />
                    <div v-html="props.revisedVersion" class="text-body2"></div>
                </div>
                <!-- Translation -->
                <div :class="{ 'col-6': isHorizontalLayout, 'q-mt-md': !isHorizontalLayout }">
                    <div class="text-subtitle2">번역</div>
                    <q-separator class="q-my-sm" />
                    <div v-html="props.translation" class="text-body2 bg-yellow"></div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

</template>