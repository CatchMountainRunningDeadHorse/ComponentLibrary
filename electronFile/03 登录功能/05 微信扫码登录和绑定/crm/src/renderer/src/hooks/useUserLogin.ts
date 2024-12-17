import Vrouter from "@router"
const route = Vrouter.currentRoute.value;
const router = Vrouter;


import { useGlobalUserStore } from '@store/UserGlobalStore'
let userStore = useGlobalUserStore();

let useUserLogin = async ( res )=>{

    if( res.code != '200' ) return;
    //设置token
    localStorage.setItem('TOKEN',res.data);
    //获取用户信息
    await userStore.initUserinfoAndConfig();
    //进入首页
    router.push('/');
}

export default useUserLogin;
  