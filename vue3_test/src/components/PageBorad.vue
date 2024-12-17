<template>
  <div class="pageBorad">
    <router-view></router-view>
  </div>
</template>

<script setup>
    name:'PageBorad'
</script>

<style>
.pageBorad{
  position: fixed;
  top: 60px;
  left: 200px;
  width: calc(100% - 200px);
  height: calc(100% - 60px);
  /* padding: 60px 0 0 200px; */
  background-color: #fff;
}
</style>