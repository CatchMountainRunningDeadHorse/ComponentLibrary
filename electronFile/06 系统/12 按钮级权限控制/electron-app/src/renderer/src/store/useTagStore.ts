import { defineStore } from 'pinia'
import { ITagRoute } from '@interface/tag'
export const useTagStore = defineStore('tagId', {
  state: ():{
    viewTags:ITagRoute[]
  } => {
    return {
        viewTags:[]
    }
  },
  getters:{},
  actions:{
    //添加标签
    pushViewTags( route:ITagRoute ){
        let target = this.viewTags.find(item=> item.path == route.path ) as ITagRoute;
        if( !target ){
            this.viewTags.push( route );
        }
    },
    //删除标签
    removeViewTags( route:ITagRoute ){
        this.viewTags.forEach((item:ITagRoute,index:number)=>{
            if( item.path == route.path ){
                this.viewTags.splice( index, 1 );
            }
        })
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['viewTags']
      }
    ]
  }
})