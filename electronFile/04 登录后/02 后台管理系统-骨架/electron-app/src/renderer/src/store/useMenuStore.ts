import { defineStore } from 'pinia'
import { getUserMenu } from '@api/user'
import { useUserStore } from '@store/useUserStore'
import { Parent } from '@interface/user'
export const useMenuStore = defineStore('menuId', {
  state: ():{
    menu:Parent[]
  } => {
    return {
        menu:[]
    }
  },
  getters:{},
  actions:{
    async getMenu(){
        let res = await getUserMenu( useUserStore().rolePerm  );
        this.menu = res.data;
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['menu']
      }
    ]
  }
})