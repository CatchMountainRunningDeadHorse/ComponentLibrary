import { useGlobalMenuStore } from '@store/MenuGolbalStore'
import { useGlobalUserStore } from '@store/UserGlobalStore'
import CONFIG from '@config'
import { useRouter } from 'vue-router'
var router = null;
let isGetRouter = false;
//前置导航守卫
export const beforeEach = async ( to )=>{

    router = useRouter();
    
    //修改网页title
    document.title = to.meta.title ? to.meta.title + ' - ' + import.meta.env.RENDERER_VUE_APP_TITLE :  import.meta.env.RENDERER_VUE_APP_TITLE;

    //当前已经在登录页面
    if( to.path =='/login'){
        return ;
    }

    //如果没有token，那么就进入登录页面
    if( !localStorage.getItem("TOKEN")  ){
        return '/login'
    }

    try{
        //进入后台管理系统请求路由
        const userStore = useGlobalUserStore();
        await userStore.initUserinfoAndConfig();
        const menuStore =useGlobalMenuStore();
        //加载动态 & 静态路由
        if( !isGetRouter ){
            initRouter( menuStore.menuList )
            if( to.matched.length == 0 ){
                router.push( to.fullPath );
            }
        }

        //最高权限直接通行
        if( userStore.permissions == CONFIG.PERMISSIONS  ){
            return true;
        }

        //判断此用户没有某权限
        if( !menuStore.menuMap.has(to.path) ){
            ElMessage.error('没有此权限');
            router.replace('/');
            return false;
        }

        return true;
    }catch( e ){
        console.log( e );
        return '/login'
    }

    return true;   
}

//加载动态路由和静态路由
const initRouter = ( menuList )=>{

    const newMenus = menuList || [];
    let menu = [...newMenus];
    //进行数据的重构
    let menuRouter = filterAsyncRouter( menu );
    menuRouter = flatAsyncRoutes( menuRouter );
    menuRouter.forEach(item=>{
        if( item.path !='http://www.xuexiluxian.cn'){
            router.addRoute(item.parentView=='layout' ? 'layout' :'' , item );
        }
        
    })

    isGetRouter = true;
}

//扁平化数据格式
function flatAsyncRoutes(routes, breadcrumb=[]) {
	let res = []
	routes.forEach(route => {
	
    const tmp = {...route}
    if (tmp.children) {
      let childrenBreadcrumb = [...breadcrumb];
      childrenBreadcrumb.push(route);
      let tmpRoute = { ...route };
      tmpRoute.meta.breadcrumb = childrenBreadcrumb;
      delete tmpRoute.children;
      res.push(tmpRoute);
      let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb);
      childrenRoutes.map(item => {
          res.push(item)
      })
    } else {
      let tmpBreadcrumb = [...breadcrumb];
      tmpBreadcrumb.push(tmp);
      tmp.meta.breadcrumb = tmpBreadcrumb;
      res.push(tmp);
    }
  })
  return res;
}

//转换格式
const filterAsyncRouter = ( routerMap )=>{
    const accessedRouters = [];
    routerMap.forEach(item=>{
        let route = {
            parentView:item.parentView,
            path:item.path,
            name:item.name,
            meta:item.meta,
            children:item.children ? filterAsyncRouter(item.children) : null,
            component:loadComponent(item.component),
        }
        accessedRouters.push( route  );
    })
    return accessedRouters;
}

//组件基本路径
const modules = import.meta.glob('@renderer/views/**/*.vue');
const modulesMap = {};
Object.keys(modules).forEach(key=>{
    const componentName = key.replace('/src/views','').replace('.vue','').replace('/index','').replace('/','');
    if( key.includes('index') ){
        modulesMap[`${componentName}/index`] = modules[key];
    }
    modulesMap[ componentName ] = modules[key];
})  


//针对于路由组件的路径进行的调整 
const loadComponent = ( component  )=>{
    if( component ){
        return modulesMap[component]
    }
}

//后置导航守卫
export const afterEach = ( to ,from  )=>{
    //console.log('后置导航守卫');
}
