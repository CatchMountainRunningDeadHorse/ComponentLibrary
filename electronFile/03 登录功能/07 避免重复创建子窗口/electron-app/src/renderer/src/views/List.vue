<template>
    <div class='list' @mousedown="mousedown">
        这是list页面
        <button @click="close">关闭</button>
    </div>
</template>


<script setup>
const close = ()=>{
    electron.ipcRenderer.invoke('close-list')
}

import { ref } from 'vue'
let isKeyDown = ref(false);
let dinatesX = ref(0);
let dinatesY = ref(0);

const mousedown = ( e )=>{
  isKeyDown.value = true;
  dinatesX.value = e.x;
  dinatesY.value = e.y;

  document.onmousemove = (ev) => {
      if(isKeyDown.value){
        const x = ev.screenX - dinatesX.value;
        const y = ev.screenY - dinatesY.value;
        //给主进程传入坐标
        let data = {
            appX:x,
            appY:y
        }
        electron.ipcRenderer.invoke('custom-list',data);

      }
  };
  document.onmouseup = (ev) => {
      isKeyDown.value = false
  };
  
}
</script>

<style scoped>
.list{
    position: absolute;
    left:0;
    right: 0;
    bottom:0;
    top:0;
}
</style>