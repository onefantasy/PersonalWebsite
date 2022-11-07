import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { setHook } from './hook'

// 自动导入自定义路由
const routeFiles = import.meta.glob('./*/*ts', { eager: true })
const routeArray = Object.keys(routeFiles).reduce(
  (arr: Array<RouteRecordRaw>, name: string): Array<RouteRecordRaw> => {
    const value = routeFiles[name] as { default: RouteRecordRaw }
    if (value && value.default) {
      arr.push(value.default)
    }
    return arr
  },
  []
)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    redirect: '/hello',
    meta: { hidden: true }
  },
  // welcome
  {
    path: '/hello',
    name: 'hello',
    component: Layout,
    redirect: '/hello/index',
    meta: { title: 'route.home', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'helloIndex',
        component: () => import('@/views/home/hello.vue'),
        meta: { title: 'route.homeWelcome', icon: 'welcome' }
      }
    ]
  },

  // 自定义路由
  ...routeArray,

  // user
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/user/account.vue'),
    meta: { hidden: true }
  },
  // 404
  {
    path: '/404',
    name: '404',
    component: Layout,
    meta: { title: 'route.404', icon: '404' },
    redirect: '/404/index',
    children: [
      {
        path: 'index',
        name: '404Index',
        component: () => import('@/views/404/index.vue'),
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '/:catchall(.*)', // catch all route
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

setHook(router)

export default router
