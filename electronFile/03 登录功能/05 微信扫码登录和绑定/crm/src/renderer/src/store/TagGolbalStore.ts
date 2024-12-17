import { defineStore } from 'pinia'

export const useGlobalTagStore = defineStore('global-tag', {
  state: () => {
    return {
        tagsList:[
            {name:'首页',path:'/'}
        ]
    }
  },
  actions:{
    //添加标签
    pushTags( route ){
        let { name , path } = route;
        let pathIndex = this.tagsList.findIndex(item=>item.path);
        let target = this.tagsList.find(item=>item.path == route.path);
        let isName = route.name;
       
        if( !target && isName  ){
            if( pathIndex == -1 ){
                this.tagsList.push({  name,  path })
            }else{
                this.tagsList.splice( pathIndex + 1 , 0 , {  name,  path } );
            }
        }
    },
    //删除标签
    deleteTags( route ){
        this.tagsList.forEach((item,index)=>{
            if( item.path == route.path ){
                this.tagsList.splice(index,1);
            }
        })
        
    }
  }
})

