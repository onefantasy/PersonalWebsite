import { defineStore } from 'pinia'
import { userStoreType, userInfo } from '@/store/types'
import { localStorageEnum } from '@/enums/localStorageEnum'

export const useUserStore = defineStore({
  id: 'user',
  state: (): userStoreType => ({
    userInfo: {}
  }),
  getters: {
    isLogin(): boolean {
      return !!(this.userInfo && this.userInfo.account)
    }
  },
  actions: {
    // 设置用户信息
    setUserInfo(info?: userInfo): void {
      if (info) {
        this.userInfo = info
        localStorage.setItem(localStorageEnum.userInfo, JSON.stringify(info))
      } else {
        const localeInfo = localStorage.getItem(localStorageEnum.userInfo)
        this.userInfo = localeInfo ? JSON.parse(localeInfo) : {}
      }
    },
    // 退出登录
    logout(): void {
      this.userInfo = {}
      localStorage.removeItem(localStorageEnum.userInfo)
    }
  }
})
