import type { Router } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

export function setHook(router: Router): void {
  router.beforeEach((to, from, next): void => {
    const userStore = useUserStore()
    // set userInfo
    userStore.setUserInfo()
    // 无登录，跳转到登录
    // if (!userStore.isLogin && to.path !== '/login') {
    //   next('/login')
    //   return
    // }
    // 正常跳转
    next()
  })
  router.afterEach((): void => {})
}
