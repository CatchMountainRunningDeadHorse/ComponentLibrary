<template>
      <LeftSide></LeftSide>
      <NavBar :breadcrumb="breadCrumb"></NavBar>
      <PageBorad></PageBorad>
  </template>
  
  <script setup>
  import LeftSide from '@/components/LeftSide.vue';
  import NavBar from '@/components/NavBar.vue';
  import PageBorad from '@/components/PageBorad.vue';
  import { useRouter,useRoute } from 'vue-router'
  import { computed, onMounted } from 'vue';
  
  //
  const router = useRouter()
  const route = useRoute()
  onMounted(() =>{
      
  })
  const breadCrumb = computed(() => {
    return route.matched
  })
  </script>
  
  
  <style scoped>

  </style>
  