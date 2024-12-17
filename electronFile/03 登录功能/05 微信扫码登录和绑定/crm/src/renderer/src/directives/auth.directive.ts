import { useGlobalUserStore } from '@store/UserGlobalStore'
import CONFIG from '@config'
export const AuthDirectives = {
    name:'auth',
    mounted( el , binding ){
        //el ==> 绑定指令的节点
        //binding ==> v-指令='binding' : 值
        let permissions = useGlobalUserStore().permissions;
        let value = binding.value;

        if( !value ){
            throw '该指令需要传递参数'
        }

        //如果是超级管理员，无需判断 和 有权限
        if( permissions.includes(CONFIG.PERMISSIONS) ) return;
        if( permissions.includes( value ) ) return;

        //没有这个按钮级别权限
        const parent = el.parentElement;
        parent && parent.removeChild( el );
    }
}