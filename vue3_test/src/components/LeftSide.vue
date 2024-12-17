<template>
  <div class="leftside">
    <template v-for="(item,index) in router.getRoutes().filter(item => {
      return item.meta.id === 0
    })" :key="index">
      <MenuItem :item="item"></MenuItem>
    </template>
  </div>
</template>

<script setup>
import MenuItem from './MenuItem.vue';
import { onMounted,ref } from 'vue';
// import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
//模板变量声明


//普通变量声明
const router = useRouter()
// const store = useStore()
// let datalist = ref([])
    
onMounted(() => {
  // setTimeout(() => {
  //   datalist.value = router.getRoutes().filter(item => {
  //     console.log('金卡数据库VS就看见',item);
  //     return item.meta.id === 0
  //   })
  // },2000)
})

</script>

<style>
.leftside{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  background-color: #ededed;
}
</style>