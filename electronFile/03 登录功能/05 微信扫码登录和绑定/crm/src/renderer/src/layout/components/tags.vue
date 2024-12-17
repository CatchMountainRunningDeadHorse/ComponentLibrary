<template>
    <div class="adminui-tags">
        <ul>
            <li 
                v-for="item in tagList" 
                :key="item.path"
            >
                <router-link :to="item.path">
                    <span>{{ item.name }}</span>
                    <i v-if='item.path !="/" ' @click.prevent.stop="delTag(item)"><el-icon><Close /></el-icon></i>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref  , watch , onBeforeMount } from 'vue';

import { useRouter } from 'vue-router';
let router = useRouter();
//标签store
import { useGlobalTagStore } from '@store/TagGolbalStore'
let store = useGlobalTagStore();
//keepStore
import { useKeepAlivetore } from '@store/KeepAlive'
let keepStore = useKeepAlivetore();

//数据
let tagList = ref([]);

onBeforeMount(()=>{
    tagList.value = store.tagsList;
})

//监听路由获取的值，传递给状态管理
const addTag = ( e )=>{
    keepStore.pushKeepAlive( e.name );
    store.pushTags( e );
}

//删除标签
const delTag = ( item )=>{
    store.deleteTags( item );
}

//监听路由
watch(
    ()=>router.currentRoute.value,
    (newValue)=>{
        addTag( newValue );
    },
    { immediate:true}
)
</script>

<style>
.contextmenu {
    position: fixed;
    width: 200px;
    margin:0;
    border-radius: 0px;
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    z-index: 3000;
    list-style-type: none;
    padding: 10px 0;
}
.contextmenu hr {
    margin:5px 0;
    border: none;
    height: 1px;
    font-size: 0px;
    background-color: var(--el-border-color-light);
}
.contextmenu li {
    display: flex;
    align-items: center;
    margin:0;
    cursor: pointer;
    line-height: 30px;
    padding: 0 17px;
    color: #606266;
}
.contextmenu li i {
    font-size: 14px;
    margin-right: 10px;
}
.contextmenu li:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
}
.contextmenu li.disabled {
    cursor: not-allowed;
    color: #bbb;
    background: transparent;
}

.tags-tip {padding:5px;}
.tags-tip p {margin-bottom: 10px;}

.dark .contextmenu li {color: var(--el-text-color-primary);}

</style>