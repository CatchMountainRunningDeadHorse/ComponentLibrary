import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getUserRouters } from '@/http/index'
import { formatRouterTree } from '@/utils/util'

export const useUserRoutersStore = defineStore('setRouter', () => {
  const routePamars = reactive({
    uid: 2,
    hasAuth: false,
    userRouters: []
  })

  function setUid(value) {
    routePamars.uid = value
  }

  function setHasAuth(value) {
    routePamars.hasAuth = value
  }

  async function setUserRouters() {
    const data = await getUserRouters(routePamars.uid)
    routePamars.userRouters = formatRouterTree(data)
  }
  return { routePamars, setUid, setUserRouters, setHasAuth }
})
