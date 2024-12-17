<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import {  ref , onBeforeMount } from 'vue';

onBeforeMount(()=>{
  const dark = ref<string | null>( localStorage.getItem('dark') );
  const element = document.querySelector('html') as HTMLElement | null;
  if( element ){
    if( dark.value == 'dark' ){
        element.className = 'dark';
    }else{
        element.className = '';
    }
  }
})
</script>

<style lang="scss">
@import './assets/css/style.scss';
</style>
