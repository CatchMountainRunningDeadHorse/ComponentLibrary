<template>
    <div class="container">
        <!--一级菜单-->
        <div class="slider-split">
            <div class="slider-split-t">
                <router-link to="/">
                    <img src="/images/logo.png" alt="">
                </router-link>
            </div>
            <div class="slider-split-scroll">
                <el-scrollbar>
                    <ul>
                        <li 
                            v-for="item in menu" 
                            :key="item.id"
                            @click="showMenu(item)"
                            :class=" pmenu.path ==item.path?'active':''  "
                        >
                            <span>{{ item.name }}</span>
                            <el-icon>
                                <component :is="item.meta.icon.replace('el-icon-','') || 'user'"></component>
                            </el-icon>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!--二级菜单-->
        <div :class="menuIsCollapse ? 'aminui-side isCollapse':'aminui-side' ">
            <div class="adminui-side-top" v-if="!menuIsCollapse">
                <h2>{{  pmenu.meta.title }}</h2>
            </div>
            <div class="adminui-side-scroll">

                <el-scrollbar>
                    <el-menu router :collapse="menuIsCollapse">
                        <nextMenu :nextMenuList="nextMenuList"></nextMenu>
                    </el-menu>
                </el-scrollbar>

            </div>
            <div class="adminui-side-bottom" @click="menuStore.toggle_nextMenu">
                <el-icon>
                    <Expand v-if="menuIsCollapse"/>    
                    <Fold v-else/>
                </el-icon>
            </div>
        </div>
        <!--主体内容-->
        <div class="main">
            
            <topBar>
                <userBar></userBar>
            </topBar>
            
            <tags></tags>
            
            <router-view v-slot="{ Component }">
                <keep-alive :include="keepAliveRoute">
                    <component :is="Component" :key="route.path"/>
                </keep-alive>
            </router-view>
            
        </div>
    </div>
</template>

<script setup>
import { ref , reactive , onBeforeMount } from 'vue'
import { useGlobalMenuStore } from '@store/MenuGolbalStore'
import nextMenu from './components/nextMenu.vue'
import topBar from './components/topBar.vue'
import userBar from './components/userBar.vue'
import tags from './components/tags.vue'
import { useRouter , useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
let router = useRouter();
let route = useRoute();
let menuStore = useGlobalMenuStore();
let menu = ref([]);
let nextMenuList = ref([]);
let pmenu = ref(null);

//keepStore 
import { useKeepAlivetore } from '@store/KeepAlive'
const keepStore = useKeepAlivetore();
const { keepAliveRoute  } = storeToRefs( keepStore )

//解构pinia数据，并且是响应式
const { menuIsCollapse } = storeToRefs(menuStore);

onBeforeMount(()=>{
    //获取一级菜单
    menu.value = menuStore.menuList;
    showThis();
})

//获取二级路径
const showThis = ()=>{
    pmenu.value = route.meta.breadcrumb ? route.meta.breadcrumb[0] : {};
    nextMenuList.value = pmenu.value.children;
}   

//点击一级菜单
const showMenu = ( item )=>{
    pmenu.value = item;
    nextMenuList.value = pmenu.value.children;
}   
</script>

<style scoped>
.el-container{
    padding-top:20px;
    background-color: #fff;
}
.container{
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
}
.slider-split{
    width:60px;
    height: 100%;
    background: #363B5A;
    cursor: pointer;
}
.slider-split-t{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top:10px;
}
.slider-split-t img{
    width:30px;
    height: 30px;
}
.slider-split-scroll{
    color:#fff;
}
.slider-split-scroll li{
    display: flex;
    flex-direction: column;
    text-align: center;

}
.slider-split-scroll li i{
    font-size:20px;
    margin-top: 6px;
}
.slider-split-scroll ul li{
    display: flex;
    width:60px;
    height: 70px;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.main{
    display: flex;
    flex-direction: column;
    flex:1;
}
.active{
    background-color: blue;
}
</style>