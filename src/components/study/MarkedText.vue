<template>
    <div v-html="renderedMarkdown" class="markdown-body"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

const renderedMarkdown = computed(() => marked(props.content))
</script>

<style>
/* 깃허브 스타일 등 마크다운 CSS 필요 시 추가 */
.markdown-body {
    line-height: 1.6;
}
</style>