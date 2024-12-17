<template>
    <div class="pagination">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    currentPage:{
        type:Number,
        default:1
    },
    pageSize:{
        type:Number,
        default:10
    },
    total:{
        type:Number,
        default:10
    }
})
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);
const emits = defineEmits(['update:currentPage','update:pageSize'])

const handleSizeChange = ( page:number )=>{
    pageSize.value = page;
    emits('update:pageSize',page);
}
const handleCurrentChange = ( page:number )=>{
    currentPage.value = page;
    emits('update:currentPage',page);
}
</script>

<style scoped>
.pagination{
    display: flex;
    justify-content: flex-end;
    margin-top:15px;
}
</style>