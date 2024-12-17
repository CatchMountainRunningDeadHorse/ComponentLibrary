
function formatRouterTree (data){
    let parents = data.filter(p => p.pid ===0),
        children = data.filter(c => c.pid !== 0)

    dataToTree(parents,children)

    function dataToTree (parents,children){
        parents.map((p) => {
            children.map((c,i)=> {
                if(c.pid === p.id){
                    let _c = JSON.parse(JSON.stringify(children))
                    _c.splice(i,1)
                    dataToTree([c],_c)

                    if(p.children){
                        p.children.push(c)
                    }else{
                        p.children = [c]
                    }
                }
            })
        })
    }

    return parents
}

function genarateRouter(userRouters){
    const modules = import.meta.glob('@/components/*/*.vue')
    // const url = new URL(`@/components/${link}.vue`,import.meta.url)
    console.log('北京市的八十块那就不教',modules);
    let newRouters = userRouters.map((r) => {
        console.log('就是把VS大江南北架空地板',modules['@/' + r.link]);
        let routes = {
            path:r.path,
            name:r.name,
            // @/components/ShopMall/index',
            // component: () => import('../views/Framework.vue'),
            // component:() => import.meta.globEager(`@/${r.link}`),
            component:modules['@/' + r.link],
            meta:r.meta
        }
        if(r.children){
            routes.children = genarateRouter(r.children)
        }
        console.log('举报SVN是经典款吧',routes);
        return routes
    })
    return newRouters
}
function formatTime (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
  }
  
  function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }

export{
    formatRouterTree,genarateRouter,formatTime
}