<template>
    <div class="top-bar">
        <div class="left-panel">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="item in matched" :key="item">
                    <el-icon>
                        <component :is="item.meta.icon.replace('el-icon-','') || 'user'"></component>
                    </el-icon>
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="right-panel">
            <slot></slot>
        </div>

    </div>  
</template>


<script lang="ts" setup>
import { onBeforeMount , ref , watch } from 'vue';
import { useRoute , useRouter } from 'vue-router'
let router = useRouter();
let route = useRoute();
import { ArrowRight } from '@element-plus/icons-vue'
let matched = ref([]);
onBeforeMount(()=>{
    getBreadcrumb();
})

const getBreadcrumb = ()=>{
    matched.value = route.meta.breadcrumb;
}

watch(() =>router.currentRoute.value.path,()=> {
    getBreadcrumb();
},{ immediate: true })

</script>

<style scoped>
.top-bar{
    display: flex;
    justify-content:space-between;
    align-items: center;

    height: 50px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-breadcrumb{
    margin-left:15px;    
}
</style>