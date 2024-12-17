<template>
    <!-- <router-view></router-view> -->
     <loginView></loginView>
</template>

<script setup>
import { useRouter,useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue';
import loginView from '@/view/loginView'

//
const router = useRouter()
const route = useRoute()


onMounted(() =>{
  
})

// onUnmounted(() => {
//   localStorage.removeItem('isLogin')
//   console.log('页面被关闭了。。。');
// })
const breadCrumb = computed(() => {
  return route.matched
})
</script>


<style scoped>
  #app {
    height: 100%;
  }
</style>
