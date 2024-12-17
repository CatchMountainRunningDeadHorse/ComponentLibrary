<template>
    <div>
        我是list组件
        <button title="返回上一页" @click="btn">返回</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const btn = () => {
    router.push('/')
}
</script>

<style lang="scss" scoped>

</style>