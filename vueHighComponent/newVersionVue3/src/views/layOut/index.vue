<template>
  <div>
    <div>
      <NavBar :breadcrumb="breadCrumb" @change="changeIsOpen"></NavBar>
    </div>
    <div class="menu">
      <LeftSide :isOpen="isOpen"></LeftSide>
    </div>
    <div class="content" :class="{ active: isOpen }">
      <transition name="bounce">
        <router-view v-slot="{ Component }">
          <!-- <keep-alive> -->
          <component :is="Component" />
          <!-- </keep-alive> -->
        </router-view>
      </transition>
    </div>
  </div>
</template>

<script setup>
import LeftSide from './components/LeftSide'
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const breadCrumb = computed(() => {
  return route.matched.filter((item, index) => {
    return index
  })
})
const isOpen = ref(false)
const changeIsOpen = (val) => {
  isOpen.value = val
}
</script>

<style scoped>
.active {
  padding-left: 64px !important;
}
.content {
  padding-left: 200px;
  transition: padding-left 0.5s;
  overflow: auto;
  height: calc(100% - 60px);
}
.menu {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  background: linear-gradient(#dfeef6, #e0e5f5);
  z-index: 99;
}
/* 下面我们会解释这些 class 是做什么的 */
.bounce-enter-active,
.bounce-leave-active {
  transition: opacity 0.5s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
