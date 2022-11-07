import { defineStore } from 'pinia'
import i18n from '@/language'
import { languageEnum } from '@/enums/languageEnum'
import { localStorageEnum } from '@/enums/localStorageEnum'
import { appStporeType } from '@/store/types'

export const useAppStore = defineStore({
  id: 'app',
  state: (): appStporeType => ({
    isMobile: true,
    isHiddenSider: true,
    i18n: languageEnum.zh,
    siderWidth: 270,
    headerHeight: 56
  }),
  getters: {
    getIsMove(): boolean {
      return this.isMobile
    },
    getSidebarOccupancy(): boolean {
      return !this.isMobile && !this.isHiddenSider
    }
  },
  actions: {
    setIsMove(isMobile: boolean): void {
      this.isMobile = isMobile
    },
    setIsHiddenSider(isHiddenSider: boolean): void {
      this.isHiddenSider = isHiddenSider
    },
    setI18n(locale: languageEnum): void {
      i18n.global.locale.value = locale
      this.i18n = locale
      localStorage.setItem(localStorageEnum.localLanguage, locale)
    },
    // init locale language
    initI18n(): boolean {
      // localStorege language
      const storageLanguage = localStorage.getItem(localStorageEnum.localLanguage) as
        | languageEnum
        | undefined
      if (storageLanguage) {
        this.setI18n(storageLanguage)
        return true
      }
      // brower language
      const browerLanguage = (navigator.language || 'en').toLowerCase()
      if (browerLanguage) {
        for (const language in languageEnum) {
          if (browerLanguage.includes(language)) {
            this.setI18n(language as languageEnum)
            return true
          }
        }
      }
      // default
      this.setI18n(languageEnum.zh)
      return false
    }
  }
})
