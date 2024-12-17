<template>
  <el-breadcrumb separator="/" class="topStyle">
    <el-breadcrumb-item 
      v-for="(item) in breadcrumb" 
      :key="item.path"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
    const props = defineProps({
      breadcrumb: {
            type: Object,
        }
    });
</script>

<style>
.topStyle{
  background-color: #ededed;
  position: fixed;
  top: 0;
  left:0;
  z-index: 1;
  width: 100%;
  padding-left: 200px;
  height: 60px;
  line-height: 60px;
  color: #fff;
}
</style>