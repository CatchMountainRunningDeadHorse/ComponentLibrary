import { defineStore } from 'pinia'

//用户
import { useGlobalUserStore } from './UserGlobalStore'
//路由
import { useGlobalMenuStore } from './MenuGolbalStore'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      user:useGlobalUserStore(),
      menu:useGlobalMenuStore(),
    }
  }
})

