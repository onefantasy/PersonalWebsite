import { taskStatusEnum } from './enums'

export interface toDoListItemType {
  id: number
  title: string
  content: string
  createdTime: string
  planStartTime: number | null
  planEndTime: number | null
  actualStartTime: string
  actualEndTime: string
  // 任务类型，0为待处理，1为进行中，2为已完成，3为忽略掉
  status: taskStatusEnum
}

export interface toDoListInfoType {
  title: string
  list: Array<toDoListItemType>
  show: boolean
  icon?: string
}
