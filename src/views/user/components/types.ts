import type { FormItemRule } from 'naive-ui'

// 验证规则数据类型
export interface rulesType {
  required?: boolean
  trigger?: string | Array<string>
  message?: string
  validator?: (rule: FormItemRule, value: any) => boolean | Error
}

// 登录表单字段
export interface loginFormType {
  account: string
  password: string
}

// 登录表单字段验证规则
export interface loginFormRulesType {
  account: Array<rulesType>
  password: Array<rulesType>
}

// 注册表单字段
export interface registerFormType {
  account: string
  password: string
  confirmPassword: string
}

// 注册表单字段验证规则
export interface registerFormRulesType {
  account: Array<rulesType>
  password: Array<rulesType>
  confirmPassword: Array<rulesType>
}
