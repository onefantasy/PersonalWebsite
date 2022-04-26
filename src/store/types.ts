import { languageEnum } from '@/enums/languageEnum'

// app.ts
export interface appStporeType {
  isMobile: boolean
  isHiddenSider: boolean
  i18n: languageEnum
  siderWidth: number
  headerHeight: number
}

// user.ts
export interface userInfo {
  account?: string
  nick?: string
}
export interface userStoreType {
  userInfo: userInfo
}
