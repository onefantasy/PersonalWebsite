// 迷宫
// 迷宫单元类型枚举，0 为路，1为墙
export enum mazeCellValue {
  road = 0,
  wall = 1,
  wallToRoad = -1
}
// 迷宫单元访问状态
export enum mazeCellVisit {
  notVisit = 0,
  visited = 1
}
// 迷宫墙壁方向，用于建造
export enum mazeWallDirection {
  x = 'x',
  z = 'z'
}

// 天空盒子
export enum skyBoxSenceKeys {
  livingroom = 'livingroom',
  kitchen = 'kitchen'
}
