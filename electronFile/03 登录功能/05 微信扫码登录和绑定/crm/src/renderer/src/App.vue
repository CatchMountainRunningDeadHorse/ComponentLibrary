<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>



<script setup>
import {  getCurrentInstance , computed } from 'vue'
const { proxy } = getCurrentInstance();
let locale = computed(()=>{
  return proxy.$i18n.messages[proxy.$i18n.locale]?.el;
})

//请求所有字典列表
// import { dictTypePage } from '@api/dicts'
// dictTypePage().then(res=>{
//   console.log( res )
// })
</script>



<style lang="scss">
@import '@renderer/assets/css/style.scss';
#app{
  width:100vw;
  height: 100vh;
  overflow: hidden;
}
</style>