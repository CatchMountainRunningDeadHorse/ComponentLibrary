import { defineStore } from 'pinia'

//用户
import { useUserStore } from './useUserStore'
//菜单
import { useMenuStore } from './useMenuStore'
//标签
import { useTagStore } from './useTagStore'

export const useStore = defineStore('storeId', {
  state: () => {
    return {
      user:useUserStore(),//用户
      menu:useMenuStore(),//菜单
      tag:useTagStore(),//标签
    }
  },
  getters:{},
  actions:{}
})