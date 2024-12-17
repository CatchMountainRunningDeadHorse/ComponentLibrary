
import { createRouter,createWebHistory } from "vue-router";

let router = new createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/login',
            name:'login',
            component:() => import('@/view/loginView'),
        },
        {
            path:'/register',
            name:'register',
            component:() => import('@/view/register'),
        },
        {
            path:'/',
            name:'layout',
            component:() => import('@/view/Layout'),
            redirect:'/homepage',
            children:[
                {
                    path:'homepage',
                    name:'homepage',
                    component:() => import('@/components/HomePage/index'),
                    meta:{
                        id:0,
                        title:'首页',
                        icon: 'el-icon-delete-solid',
                    }
                },

                {
                    path:'ScreenPage',
                    name:'screenpage',
                    component:() => import('@/view/ScreenPage'),
                    meta:{
                        id:0,
                        title:'Echarts',
                        icon: 'el-icon-delete-solid',
                    }
                },
                {
                    path:'ShopMall',
                    name:'shopmall',
                    component:() => import('@/components/ShopMall/index'),
                    // redirect:'ShopMall/SystemShopMall',
                    meta:{
                        id:0,
                        title:'3D动画',
                        icon: 'el-icon-delete-solid',
                    },
                    children:[
                        {
                            path:'/SystemShopMall',
                            name:'systemshopmall',
                            component:() => import('@/components/ShopMall/components/SystemShopMall'),
                            meta:{
                                id:1,
                                title:'圣诞贺卡',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'MyShopMall',
                            name:'myshopmall',
                            component:() => import('@/components/ShopMall/components/MyShopMall'),
                            meta:{
                                id:1,
                                title:'汽车模型',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDOne',
                            name:'threedone',
                            component:() => import('@/components/ShopMall/components/ThreeDOne'),
                            meta:{
                                id:1,
                                title:'酷炫球形机器人',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDTwo',
                            name:'threedtwo',
                            component:() => import('@/components/ShopMall/components/ThreeDTwo'),
                            meta:{
                                id:1,
                                title:'工厂模型',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDThree',
                            name:'threedthree',
                            component:() => import('@/components/ShopMall/components/ThreeDThree'),
                            meta:{
                                id:1,
                                title:'星云运动效果',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDFour',
                            name:'threedfour',
                            component:() => import('@/components/ShopMall/components/ThreeDFour'),
                            meta:{
                                id:1,
                                title:'点球小游戏',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDFive',
                            name:'threedfive',
                            component:() => import('@/components/ShopMall/components/ThreeDFive'),
                            meta:{
                                id:1,
                                title:'VR看房',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDSix',
                            name:'threedsix',
                            component:() => import('@/components/ShopMall/components/ThreeDSix'),
                            meta:{
                                id:1,
                                title:'中国地图',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDSeven',
                            name:'threedSeven',
                            component:() => import('@/components/ShopMall/components/ThreeDSeven'),
                            meta:{
                                id:1,
                                title:'城市',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'ThreeDNine',
                            name:'threednine',
                            component:() => import('@/components/ShopMall/components/ThreeDNine'),
                            meta:{
                                id:1,
                                title:'测试websocket',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                    ]
                },
                {
                    path:'selfModel',
                    name:'selfmodel',
                    component:() => import('@/components/selfModelCom/index'),
                    // redirect:'/selfOne',
                    meta:{
                        id:0,
                        title:'自制模型加载速度',
                        icon: 'el-icon-delete-solid',
                    },
                    children:[
                        {
                            path:'selfOne',
                            name:'selfone',
                            component:() => import('@/components/selfModelCom/components/selfOne'),
                            meta:{
                                id:1,
                                title:'模型一(压缩前)',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'selfTwo',
                            name:'selftwo',
                            component:() => import('@/components/selfModelCom/components/selfTwo'),
                            meta:{
                                id:1,
                                title:'模型一(压缩后)',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'selfThree',
                            name:'selfthree',
                            component:() => import('@/components/selfModelCom/components/selfThree'),
                            meta:{
                                id:1,
                                title:'模型二(压缩前)',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'selfFour',
                            name:'selffour',
                            component:() => import('@/components/selfModelCom/components/selfFour'),
                            meta:{
                                id:1,
                                title:'模型二(压缩后)',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'selfFive',
                            name:'selffive',
                            component:() => import('@/components/selfModelCom/components/selfFive'),
                            meta:{
                                id:1,
                                title:'环境纹理（模拟真实环境）',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                    ]
                },
                {
                    path:'officialDemo',
                    name:'officialDemo',
                    component:() => import('@/view/officialDemo/index'),
                    // redirect:'/selfOne',
                    meta:{
                        id:0,
                        title:'threejs官网案例',
                        icon: 'el-icon-delete-solid',
                    },
                    children:[
                        {
                            path:'webglAnimationSkinningBlending',
                            name:'webglAnimationSkinningBlending',
                            component:() => import('@/view/officialDemo/webglAnimationSkinningBlending'),
                            meta:{
                                id:1,
                                title:'走路机器人',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'webglAnimationKeyframes',
                            name:'webglAnimationKeyframes',
                            component:() => import('@/view/officialDemo/webglAnimationKeyframes'),
                            meta:{
                                id:1,
                                title:'社区',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'webglGeometryMinecraft',
                            name:'webglGeometryMinecraft',
                            component:() => import('@/view/officialDemo/webglGeometryMinecraft'),
                            meta:{
                                id:1,
                                title:'我的世界',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                        {
                            path:'webglLoaderIfc',
                            name:'webglLoaderIfc',
                            component:() => import('@/view/officialDemo/webglLoaderIfc'),
                            meta:{
                                id:1,
                                title:'学校',
                                icon: 'el-icon-delete-solid',
                            }
                        },
                    ]
                }
            ]
        },
    ]
})

export default router


