import type { MeshPhongMaterial, Mesh, BoxGeometry, Sprite } from 'three'
import type { mazeCellVisit, mazeCellValue, mazeWallDirection, skyBoxSenceKeys } from './enums'

// 刚体three对象类型
export type rigidBodyType = Mesh<BoxGeometry, MeshPhongMaterial>

// 迷宫
// 迷宫单元格类型，用于计算
export interface mazeCellType {
  visit: mazeCellVisit
  value: mazeCellValue
}
// 迷宫墙壁类型，用于指定墙壁的位置和方向
export interface mazeWallType {
  x: number
  z: number
  direction: mazeWallDirection
  width: number
}

// 天空盒子
// 信息提示数据
export interface skyBoxTipItemType {
  x: number
  y: number
  z: number
  content: string
  senceInfo?: string
}
// 经历结构体添加字段
export interface skyBoxSpriteType extends Sprite {
  content?: string
  senceInfo?: string
}
// 场景信息
export type skyBoxSenceInfo = {
  [k in skyBoxSenceKeys]: {
    img: string
    tipList: Array<skyBoxTipItemType>
  }
}
