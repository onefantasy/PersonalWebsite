import { sexEnum } from './enums'

export interface tableItemType {
  id: number
  address: string
  name: string
  birthday: string
  phone: string
  avatar: string
  sex: sexEnum
  age: number
  idNumber: string
}
