<script setup>
import { API_LIST } from '@/utils/apiList'
import { apiCall } from '@/utils/apiCall'

const testApi = async () => {
    console.log('api list -> ', API_LIST);
    const result = await apiCall(API_LIST.TEST_EP);
    console.log('결과 -> ', result);


}

</script>

<template>
    <div>
        메인뷰
    </div>
    <button @click="testApi">버튼</button>
</template>