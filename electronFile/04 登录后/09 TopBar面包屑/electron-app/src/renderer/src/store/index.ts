import { defineStore } from 'pinia'

//用户
import { useUserStore } from './useUserStore'
//菜单
import { useMenuStore } from './useMenuStore'

export const useStore = defineStore('storeId', {
  state: () => {
    return {
      user:useUserStore(),//用户
      menu:useMenuStore(),//菜单
    }
  },
  getters:{},
  actions:{}
})