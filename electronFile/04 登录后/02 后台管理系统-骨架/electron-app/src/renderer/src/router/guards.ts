//前置
export const beforeEach = ( to )=>{

    if( to.path == '/login' ){
        return ;
    }

    if( !localStorage.getItem('TOKEN') ){
        return '/login'
    }

    return true;
}

//后置
export const afterEach = ()=>{
    console.log('后置');
}