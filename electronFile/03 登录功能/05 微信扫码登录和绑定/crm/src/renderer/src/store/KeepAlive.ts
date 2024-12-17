import { defineStore } from 'pinia'


export const useKeepAlivetore = defineStore('global-keepAlive', {
  state: () => {
    return {
        keepAliveRoute:[], //标签页的name做为缓存
    }
  },
  actions:{
    pushKeepAlive( name:String ){
        if( !this.keepAliveRoute.includes(name) ){
            this.keepAliveRoute.push( name );
        }
    }
  }

})

