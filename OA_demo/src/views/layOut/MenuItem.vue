<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 分为两种方式渲染：有子菜单和没有子菜单-->
    <el-sub-menu :index="item.path" v-if="item.meta.nodeType === 1" @click="clickPath">
      <template #title>
        <SvgIcon :iconName="item.meta.icon" className="SvgIcon"></SvgIcon>
        <span>{{ item.name }}</span>
      </template>
      <!-- 有子菜单的继续遍历（递归）-->
      <MenuItem :menuList="item.children"></MenuItem>
    </el-sub-menu>
    <!-- 没有子菜单-->
    <el-menu-item :index="item.path" v-else @click="clickPath">
      <SvgIcon
        :iconName="item.meta.icon"
        className="SvgIcon"
        :color="active === item.path ? '#2e83f1' : ''"
      ></SvgIcon>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue'
import store from '@/store/index'
import Cookies from 'js-cookie'
const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
defineProps({
  menuList: {
    type: Object
  }
})
const active = ref(Cookies.get('path') || '/homePage')
onMounted(() => {
  bus.on('pathBackward', savePath)
})
const savePath = (path) => {
  Cookies.set('path', path)
  active.value = path
}
const clickPath = () => {
  store.commit('setSearchInfo', {})
}
onBeforeUnmount(() => {
  bus.off('pathBackward')
})
</script>

<style scoped>
a:not(router-link-exact-active) {
  color: #fff;
  text-decoration: none;
}

a.router-link-exact-active {
  color: rgb(46, 221, 98);
}
.SvgIcon {
  margin-right: 5px;
  font-size: 10px;
}
</style>
