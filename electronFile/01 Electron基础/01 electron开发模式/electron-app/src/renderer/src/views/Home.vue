<template>
    <div>
        这是home首页
        
        <button @click="btn">按钮</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
let router = useRouter();
const btn = ()=>{
    router.push('/list');
}
</script>