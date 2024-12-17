import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/loginView')
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/layOut/index'),
      redirect: '/homePage',
      children: [
        {
          path: 'homePage',
          name: '首页',
          component: () => import('@/views/HomePage/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-shouye'
          }
        },
        {
          path: 'Approval',
          name: '我的审批',
          component: () => import('@/views/Approval/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-shenpi'
          }
        },
        {
          path: '/AddApply',
          name: '新增审批单',
          component: () => import('@/views/addApply/index'),
          meta: {
            nodeType: 0,
            id: -1
          }
        },
        {
          path: '/CheckApply',
          name: '查看审批单',
          component: () => import('@/views/CheckApply/index'),
          meta: {
            nodeType: 0,
            id: -1
          }
        },
        // {
        //   path: 'Application',
        //   name: '我的申请',
        //   component: () => import('@/views/Application/index'),
        //   meta: {
        //     nodeType: 0,
        //     id: 0,
        //     icon: 'icon-shenqingguanli'
        //   }
        // },
        {
          path: 'sendCopy',
          name: '抄送我的',
          component: () => import('@/views/sendCopy/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-chaosongx'
          }
        },
        {
          path: 'allApply',
          name: '全部申请',
          component: () => import('@/views/allApply/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-wodeshenqing'
          }
        },
        {
          path: 'formSet',
          name: '表单设置',
          component: () => import('@/views/formSet/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-biaodanshezhi'
          }
        },
        {
          path: 'Three3D',
          name: '3D系列开发',
          component: () => import('@/views/Three3D/index'),
          meta: {
            nodeType: 0,
            id: 0,
            icon: 'icon-shouye'
          }
        }
        // {
        //   path: 'Apply',
        //   name: '申请',
        //   component: () => import('@/views/layOut/components/formSet'),
        //   meta: {
        //     nodeType: 1,
        //     id: 0
        //   },

        //   //   // 二级路由
        //   children: [
        //     {
        //       path: '/Apply/Update',
        //       name: '修改',
        //       component: () => import('@/views/layOut/components/allApply'),
        //       meta: {
        //         id: 1,
        //         nodeType: 0
        //       }
        //     }
        //   ]
        // }
      ]
    }
  ]
})

export default router
