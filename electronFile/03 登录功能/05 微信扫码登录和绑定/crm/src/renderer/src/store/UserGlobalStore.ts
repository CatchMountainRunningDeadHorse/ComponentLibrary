import { defineStore } from 'pinia'
import { getInfo } from '@api/login'
import { useGlobalMenuStore } from './MenuGolbalStore'
export const useGlobalUserStore = defineStore('global-user', {
  state: () => {
    return {
        permissions:[],//权限信息（具体权限编码）
        userInfo:null,//用户信息
        roles:[],//当前用户所有的角色信息
        role:{},//当前用户 - 当前角色
        currentRolePerm:'',//角色权限编码
        roleIndex:0,//默认第几个权限
    }
  },
  actions:{
    //获取用户信息
    async initUserinfoAndConfig(){

       
        let res = await getInfo();
        
        console.log( res );

        //之前登录的用户，和 现在登录的用户，是不是同一个
        if( res.data.userInfo?.id  !=  this.userInfo?.id  ){
          this.roleIndex = 0;
        }

        let { permissions  , roles , userInfo } = res.data;
        this.permissions = permissions;
        this.roles = roles;
        this.userInfo = userInfo;
        this.role = roles[this.roleIndex];
        //存储角色权限编码 , 获取路由使用
        this.currentRolePerm = roles[this.roleIndex].rolePerm;
        //获取当前登录用户路由菜单
        await useGlobalMenuStore().loadAuthRouters();
    }
  },
  persist: {
    enabled: true, 	// 开启数据缓存
    strategies:[
      {
        key: 'xiaoluxian_crm',  //在本地存储中显示的key
        storage: localStorage,  //插件默认走session
        paths:['userInfo','currentRolePerm','roles','role','roleIndex'],     //本仓库，要存储哪些值在 本地存储中
      }
    ]
  }
})

