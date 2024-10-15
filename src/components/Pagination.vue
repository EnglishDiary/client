<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { eventBus } from '@/utils/eventBus';

const props = defineProps({
    totalPages: Number,
})

const current = ref(1)

const changePage = async (newPage) => {
    eventBus.emit('renew-data', newPage)
}

</script>

<template>
    <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="current" :max="totalPages" max-pages="10" @update:model-value="changePage"
            direction-links boundary-links icon-first="skip_previous" icon-last="skip_next" icon-prev="fast_rewind"
            icon-next="fast_forward" />
    </div>
</template>