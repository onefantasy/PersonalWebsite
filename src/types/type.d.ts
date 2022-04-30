// 扩展全局对象类型

import type { MessageApi } from 'naive-ui'

// 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中。
// 所以，引入该语句，取消报错
export {}

declare global {
  interface Window {
    Ammo: any
    $message: MessageApi
  }
}
