//路由
import router from '@router'

//store
import { useUserStore } from '@store/useUserStore'
import { useMenuStore } from '@store/useMenuStore'

//element-plus
import { ElMessage } from 'element-plus'

import { ILoginRequest } from '@interface/login'

const useLogin = async ( res:ILoginRequest )=>{
    //判断是否登录成功
    if( res.code != '200' ) return ElMessage.error(res.msg);

    //1. 持久化存储token
    const token = res.data;
    localStorage.setItem('TOKEN', token || '' );

    //2. 获取用户信息
    await useUserStore().getUserInfo();

    //3. 获取路由
    await useMenuStore().getMenu();

    //4. 跳转后台管理系统首页
    router.push( '/' );

    return ;
}

export default useLogin;