import { languageEnum } from '@/enums/languageEnum'

// app.ts
export interface appStporeType {
  isMobile: boolean
  isHiddenSider: boolean
  i18n: languageEnum
}

// user.ts
export interface userInfo {
  account?: string
  nick?: string
}
export interface userStoreType {
  userInfo: userInfo
}
