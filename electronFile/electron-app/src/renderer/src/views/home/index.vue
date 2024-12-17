<template>
  <div>
    <h2>我是home组件</h2>
    <button title="跳转到list" @click="btn">按钮</button>
    <button @click="countAdd">count++</button>
    <h3>{{ setCount.counter }}</h3>
    <button @click="wss" >消息提醒</button>
    <button @click="downLoad">下载任务</button>
  </div>
    
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCount } from '@renderer/stores'
const router = useRouter()
const btn = () => {
  router.push('/list')
}

console.log(window.electron)

const setCount = useCount()
const countAdd = () => {
  setCount.setCount()
}
const wss =() => {
  window.electron.ipcRenderer.invoke('webWss')
}

const downLoad = () =>{
  window.electron.ipcRenderer.invoke('down',{name:'jake'})
}
</script>

<style lang="scss" scoped></style>
