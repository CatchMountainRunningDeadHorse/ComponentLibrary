<template>
    <div v-if="nextMenuList.length <=0 ">
        没有子集菜单
    </div>
    <template v-for="navMenu in nextMenuList" :key="navMenu">
        <el-menu-item v-if='hasChildren(navMenu)' :index="navMenu.path">
            有子
        </el-menu-item>
       


        <el-menu-item v-else :index="navMenu.path">
            
            <el-icon>
                <component :is="navMenu.meta.icon.replace('el-icon-','') || 'user'"></component>
            </el-icon>

            <template #title>
                <span>{{ navMenu.meta.title }}</span>
            </template>

        </el-menu-item>


    </template>
</template>

<script setup lang="ts">
import { ref ,reactive, onBeforeMount } from 'vue'
const props = defineProps({
    nextMenuList:Object
})

onBeforeMount(()=>{
    let nextMenuList = reactive(props.nextMenuList);
})

//判断此二级有没有三级
const hasChildren = ( item )=>{
    return item.children && !item.children.every( item=>item.meta.hidden)
}
</script>