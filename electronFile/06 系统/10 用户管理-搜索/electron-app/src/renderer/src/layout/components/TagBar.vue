<template>
    <div class="adminui-tags">
      <ul ref="tags">
        <li
            v-for="item in viewTags"
            :key="item.path"
            :class="isActive(item) ? 'active':'' "
        >
          <router-link :to="item.path">
            <!-- 如果标签不是固定标签，则显示关闭图标 -->
            <span>{{ item.name }}</span>
            <el-icon v-if="!item.affix" @click.prevent.stop="closeTag(item)">
              <el-icon-close/>
            </el-icon>
          </router-link>
        </li>
      </ul>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount , watch } from 'vue';
import { ITagRoute } from '@interface/tag'


import { useTagStore } from '@store/useTagStore'
let tagStore = useTagStore();

import { storeToRefs } from 'pinia';
let { viewTags } = storeToRefs(tagStore);

import { useRoute } from 'vue-router';
import { off } from 'process';
import router from '@router';
const route = useRoute();

//高亮tag
const isActive = ( routes:ITagRoute )=>{
    return routes.path == route.path;
}

//删除tag
const closeTag = ( tag:ITagRoute )=>{
    const nowTagIndex:number = viewTags.value.findIndex(item=> item.path == tag.path );
    tagStore.removeViewTags( tag );
    if( isActive( tag ) ){
        const leftView:ITagRoute = viewTags.value[ nowTagIndex - 1 ];
        if( leftView ){
            router.push( leftView.path );
        }else{
            router.push( '/' );
        }
    }
}

watch(route,()=>{
    if( route.name ){
        let currentTag = {
            name:route.name,
            path:route.path,
            affix:route.meta.affix
        } as ITagRoute
        tagStore.pushViewTags( currentTag );
    }
},{immediate:true})
</script>

<style scoped>
.adminui-tags {height:35px;background: #fff;border-bottom: 1px solid #e6e6e6;}
.adminui-tags ul {display: flex;overflow: hidden;}
.adminui-tags li {font-size:12px;cursor: pointer;display: inline-block;float: left;height:34px;line-height: 34px;position: relative;flex-shrink: 0;}
.adminui-tags li::after {content: " ";width:1px;height:100%;position: absolute;right:0px;background-image: linear-gradient(#fff, #e6e6e6);}
.adminui-tags li a {display: inline-block;padding:0 10px;width:100%;height:100%;color: #999;text-decoration:none;display: flex;align-items: center;}
.adminui-tags li i {margin-left:10px;border-radius: 3px;width:18px;height:18px;display: flex;align-items: center;justify-content: center;}
.adminui-tags li i:hover {background: rgba(0,0,0,.2);color: #fff;}
.adminui-tags li:hover {background: #ecf5ff;}
.adminui-tags li.active {background: #409EFF;}
.adminui-tags li.active a {color: #fff;}
</style>