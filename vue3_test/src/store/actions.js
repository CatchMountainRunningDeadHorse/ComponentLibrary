import { getUserRouters } from "@/http"
import { formatRouterTree } from "@/utils/util"




export async function setUserRouters({commit,state}){
    const userRouters = await getUserRouters(state.uid),
        payload = formatRouterTree(userRouters)

    commit('setUserRouters',payload)
    commit('setAuth',true)
}

export default{ 
    setUserRouters
}