<template>
  <el-menu
    active-text-color="#2E83F1"
    background-color="none"
    class="el-menu-vertical-demo"
    text-color="#666666"
    router
    :collapse="isOpen"
    style="border: 0"
  >
    <MenuItem :menuList="customRoutes"></MenuItem>
  </el-menu>
</template>

<script setup>
import MenuItem from './MenuItem.vue'
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue'
// import { useUserRoutersStore } from '@/stores/store'

const customRoutes = JSON.parse(localStorage.getItem('customRoutes'))
// console.log(customRoutes)

import Cookies from 'js-cookie'
const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
// //模板变量声明

// //普通变量声明
defineProps(['isOpen'])
const defaulActive = ref()
onMounted(() => {
  saveDefaulActive()
  bus.on('savePath', saveDefaulActive)
  bus.on('pathBackward', saveDefaulActive)
})

const saveDefaulActive = () => {
  defaulActive.value = Cookies.get('path') || '/homePage'
}
onBeforeUnmount(() => {
  bus.off('savePath')
  bus.off('pathBackward')
})
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical-demo >>> .el-menu-item.is-active {
  background-color: #fff;
  border-radius: 4px;
}

.el-menu-vertical-demo >>> .el-menu-item:hover {
  background: #dbdcdd !important;
  color: #000 !important;
}
.el-menu-vertical-demo >>> .el-sub-menu__title:hover {
  background: #dbdcdd !important;
  color: #000 !important;
}
</style>
