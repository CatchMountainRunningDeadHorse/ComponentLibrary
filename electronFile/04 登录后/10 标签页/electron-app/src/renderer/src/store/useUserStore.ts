import { defineStore } from 'pinia'
import { getInfo } from '@api/user'
import {  Role } from '@interface/user'
export const useUserStore = defineStore('userId', {
  state: ():{
    roles:Role[]
    rolePerm:string
  } => {
    return {
      roles:[],
      rolePerm:''
    }
  },
  getters:{},
  actions:{
    async getUserInfo(){
      let res = await getInfo();
      let { permissions , roles, units , userInfo } = res.data;

      //角色信息
      this.roles = roles;
      this.rolePerm = roles[0].rolePerm;
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['rolePerm']
      }
    ]
  }
})