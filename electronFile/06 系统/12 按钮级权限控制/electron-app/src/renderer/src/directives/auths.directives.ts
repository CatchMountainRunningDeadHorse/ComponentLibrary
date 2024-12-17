import { useUserStore } from '@store/useUserStore'
export const AuthDirectives = {
    name:'auths',
    mounted( el:any, binding:any ){

        let permissions = useUserStore().permissions;
        if( permissions.includes("*:*:*") ) return;

        if( !permissions.includes(binding.value) ){
            const parent = el.parentElement;
            parent && parent.removeChild( el );
        }

    }
}