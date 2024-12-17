<template>
    <div>首页 仪表盘</div>

    <el-button @click="bindWx">绑定微信号</el-button>

</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { wechatCheck } from '@api/login'

//绑定微信号
const bindWx = ()=>{
    window.electron.ipcRenderer.invoke('renderer-to-main',{
        name:'wx',
        event:'event',
        data : {
            token:localStorage.getItem('TOKEN')
        }
    })
}

onBeforeMount(()=>{
    window.electron.ipcRenderer.once('main-to-renderer',async (e,data)=>{
        if( data.name =='wechat-bind'){
            let res = await wechatCheck();
            console.log( res );
        }
    })
})



</script>
