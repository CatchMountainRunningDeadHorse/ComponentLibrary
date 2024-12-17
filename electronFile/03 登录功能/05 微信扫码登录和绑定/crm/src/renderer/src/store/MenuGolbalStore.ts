import { defineStore } from 'pinia'
import { useGlobalUserStore } from './UserGlobalStore'
import { getRouters } from '@api/login'
export const useGlobalMenuStore = defineStore('global-menu', {
  state: () => {
    return {
        menuList:[], //菜单数据
        menuMap:null, //菜单扁平化数据
        menuIsCollapse:false
    }   
  },
  actions:{
    //获取当前登录用户的路由表
    async loadAuthRouters(){
        const userStore = useGlobalUserStore();
        //请求获取路由
        const res = await getRouters( userStore.currentRolePerm );
        if( res.code == '200' ){
          const menu = normalizeMenu( res.data );
          this.menuList = menu.routers;
          this.menuMap = menu.authMenuMap;
        }
    },
    //折叠二级菜单
    toggle_nextMenu(){
      this.menuIsCollapse = !this.menuIsCollapse;
    }
  }
})

//生成map扁平化格式，方便判断（如果当前用户没有某一个权限那么就不能进入某一个路由中）
function normalizeMenu( routers ){
  const authMap = new Map();
  let router = [
    {
      path:'/',
      name:'首页'
    },
    ...routers
  ]

  const authMenuMap = normalizeMenuItem( router , authMap );
  return {
    routers,
    authMenuMap
  }
}
function normalizeMenuItem( routers , map ){
  routers.forEach(item=>{
    map.set( item.path , item );
    if( item.children ){
      return normalizeMenuItem( item.children , map  );
    }
  })
  return map;
}

