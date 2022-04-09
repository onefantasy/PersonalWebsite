import type { mazeCellType, mazeWallType } from './types'
import { mazeCellValue, mazeCellVisit, mazeWallDirection } from './enums'

const mArrayToWalls = (
  m: Array<Array<mazeCellType>>,
  xNumber: number,
  zNumber: number,
  groundX: number,
  groundZ: number,
  roadWidth: number,
  wallWidth: number
): mazeWallType[] => {
  const xWidth = xNumber * 2 + 1
  const zWidth = zNumber * 2 + 1

  const walls: mazeWallType[] = []

  const startCoorX = groundX / 2 - wallWidth / 2
  const startCoorZ = groundZ / 2 - wallWidth / 2
  const roadAndWallWidth = roadWidth + wallWidth

  const getLastCoorX = (iz: number, ix: number): number => {
    const mx = m[iz]
    const mxSubOne = m[iz - 1]
    const mxAddOne = m[iz + 1]
    let lastX = ix
    for (let iw = ix + 1; iw < xWidth; iw++) {
      const target = mx[iw]
      if (target && target.value === mazeCellValue.wall) {
        lastX = iw
        if (
          !(
            (mxSubOne && mxSubOne[iw].value === mazeCellValue.wall) ||
            (mxAddOne && mxAddOne[iw].value === mazeCellValue.wall)
          )
        ) {
          target.value = mazeCellValue.road
        }
      } else {
        break
      }
    }
    return lastX
  }

  const getLastCoorZ = (iz: number, ix: number): number => {
    let lastZ = iz
    for (let iw = iz + 1; iw < zWidth; iw++) {
      const target = m[iw] && m[iw][ix]
      if (target && target.value === mazeCellValue.wall) {
        lastZ = iw
        const targetAddOne = m[iw][ix + 1]
        const targetSubOne = m[iw][ix - 1]
        if (
          !(
            (targetAddOne && targetAddOne.value === mazeCellValue.wall) ||
            (targetSubOne && targetSubOne.value === mazeCellValue.wall)
          )
        ) {
          target.value = mazeCellValue.road
        }
      } else {
        break
      }
    }
    return lastZ
  }

  const caluteCoor = (index: number, startCoor: number): number => {
    return startCoor - Math.floor(index / 2) * roadAndWallWidth
  }

  const caluteWallInfo = (ix: number, iz: number, lastX: number, lastZ: number) => {
    const startX = caluteCoor(ix, startCoorX)
    const startZ = caluteCoor(iz, startCoorZ)
    const endX = caluteCoor(lastX + 1, startCoorX)
    const endZ = caluteCoor(lastZ + 1, startCoorZ)
    let direction = mazeWallDirection.z
    let width = 0
    if (ix === lastX) {
      width = startZ - endZ
    } else {
      direction = mazeWallDirection.x
      width = startX - endX
    }
    walls.push({ x: (startX + endX) / 2, z: (startZ + endZ) / 2, direction, width })
  }

  for (let iz = 0; iz < zWidth; iz++) {
    const mx = m[iz]
    for (let ix = 0; ix < xWidth; void 0) {
      const target = mx[ix]
      if (target.value === mazeCellValue.wall) {
        const newX = getLastCoorX(iz, ix)
        if (newX !== ix) {
          caluteWallInfo(ix, iz, newX, iz)
          ix = newX + 1
        } else {
          const newZ = getLastCoorZ(iz, ix)
          caluteWallInfo(ix, iz, ix, newZ)
          ix++
        }
      } else {
        ix++
      }
    }
  }

  return walls
}

// 创建初始地图数据
const createMazeArray = (
  xNumber: number,
  zNumber: number,
  isEmpty = false
): Array<Array<mazeCellType>> => {
  const xWidth = xNumber * 2 + 1
  const zWidth = zNumber * 2 + 1
  const lastX = xNumber * 2
  const lastZ = zNumber * 2
  const m: Array<Array<mazeCellType>> = []
  for (let i = 0; i < zWidth; i++) {
    const mX: Array<mazeCellType> = []
    for (let j = 0; j < xWidth; j++) {
      const mCell: mazeCellType = { visit: mazeCellVisit.notVisit, value: mazeCellValue.wall }
      if (
        (i % 2 === 1 && j % 2 === 1) ||
        (isEmpty && i !== 0 && j !== 0 && i !== lastZ && j !== lastX)
      ) {
        mCell.value = mazeCellValue.road
      }
      mX.push(mCell)
    }
    m.push(mX)
  }

  // 门
  m[zWidth - 1][1].value = mazeCellValue.road

  return m
}

// 递归回溯算法(深度优先): 本程序使用while代替递归
export const generateMazeRecursiveBacktracker = (
  xNumber: number,
  zNumber: number,
  roadWidth: number,
  wallWidth: number,
  groundX: number,
  groundZ: number
): mazeWallType[] => {
  if (!xNumber || !zNumber || !roadWidth || !wallWidth) {
    return []
  }
  // 创建初始地图
  const m = createMazeArray(xNumber, zNumber)
  // 生成迷宫地图
  const history: Array<{ x: number; z: number }> = [{ x: 1, z: 1 }]
  let len = history.length
  while (len > 0) {
    const coor = history[len - 1]
    const coorX = coor.x
    const coorZ = coor.z
    const target = m[coorZ][coorX]
    // 若目标不存在
    if (!target) {
      history.pop()
      len--
      continue
    }
    // 设置为已访问
    target.visit = mazeCellVisit.visited
    // 检查周围是否存在未访问的road
    const checkRoad: Array<{ x: number; z: number }> = []
    for (let i = 0; i < 4; i++) {
      const x = coorX + (i === 0 ? 2 : i === 1 ? -2 : 0)
      const z = coorZ + (i === 2 ? 2 : i === 3 ? -2 : 0)
      const nearTarget: mazeCellType = m[z] && m[z][x]
      if (nearTarget && nearTarget.visit === mazeCellVisit.notVisit) {
        checkRoad.push({ x, z })
      }
    }
    const checkRoadLen = checkRoad.length
    // 不存未访问
    if (checkRoadLen <= 0) {
      history.pop()
      len--
      continue
    }
    // 存在未访问
    const { x, z } = checkRoad[Math.floor(Math.random() * checkRoadLen)]
    const wall = m[(z + coorZ) / 2][(x + coorX) / 2]
    if (wall.value === mazeCellValue.wall && wall.visit === mazeCellVisit.notVisit) {
      // 拆墙
      wall.visit = mazeCellVisit.visited
      wall.value = mazeCellValue.road
      // 将目的坐标设置为已访问
      m[z][x].visit = mazeCellVisit.visited
      history.push({ x, z })
      len++
      continue
    }
    history.pop()
    len--
  }

  return mArrayToWalls(m, xNumber, zNumber, groundX, groundZ, roadWidth, wallWidth)
}

// 递归分割: 本程序使用while代替递归
export const generateMazeRecursiveDivision = (
  xNumber: number,
  zNumber: number,
  roadWidth: number,
  wallWidth: number,
  groundX: number,
  groundZ: number
): mazeWallType[] => {
  if (!xNumber || !zNumber || !roadWidth || !wallWidth) {
    return []
  }
  // 创建初始地图
  const m = createMazeArray(xNumber, zNumber, true)
  const xWidth = xNumber * 2
  const zWidth = zNumber * 2

  const history: Array<{ x1: number; z1: number; x2: number; z2: number }> = [
    { x1: 0, z1: 0, x2: xWidth, z2: zWidth }
  ]
  let len = history.length

  const getCoor = (num1: number, num2: number): number => {
    const num = Math.floor((num1 + num2) / 2)
    return num % 2 === 0 ? num : num + (Math.random() > 0.5 ? 1 : -1)
  }

  const buildWallX = (x1: number, z1: number, x2: number, z2: number): void => {
    if (x1 !== x2 || x1 <= 0 || x1 > xWidth) {
      return
    }
    for (let i = z1; i <= z2; i++) {
      const wall = m[i] && m[i][x1]
      if (wall) {
        wall.value = mazeCellValue.wall
      }
    }
  }

  const buildWallZ = (x1: number, z1: number, x2: number, z2: number): void => {
    if (z1 !== z2 || z1 <= 0 || z1 > zWidth) {
      return
    }
    const mx = m[z1]
    if (!m[z1]) {
      return
    }
    for (let i = x1; i <= x2; i++) {
      const wall = mx[i]
      if (wall) {
        wall.value = mazeCellValue.wall
      }
    }
  }

  const pushHistoryAndBuilWall = (
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    index: number,
    notBreak: number
  ): void => {
    if (isNaN(x1) || isNaN(z1) || isNaN(x2) || isNaN(z2)) {
      return
    }
    if (x2 - x1 > 2 && z2 - z1 > 2) {
      history.push({ x1, z1, x2, z2 })
      len++
    }
    let wallX = 0
    let wallZ = 0
    let diff = 0
    if (index === 0) {
      wallX = x2
      diff = z2 - z1
      wallZ = z1 + (diff <= 2 ? 1 : Math.floor(Math.random() * (diff / 2)) * 2 + 1)
      buildWallX(wallX, z1, wallX, z2)
    } else if (index === 1) {
      wallZ = z1
      diff = x2 - x1
      wallX = x1 + (diff <= 2 ? 1 : Math.floor(Math.random() * (diff / 2)) * 2 + 1)
      buildWallZ(x1, wallZ, x2, wallZ)
    } else if (index === 2) {
      wallX = x1
      diff = z2 - z1
      wallZ = z1 + (diff <= 2 ? 1 : Math.floor(Math.random() * (diff / 2)) * 2 + 1)
      buildWallX(wallX, z1, wallX, z2)
    } else if (index === 3) {
      wallZ = z2
      diff = x2 - x1
      wallX = x1 + (diff <= 2 ? 1 : Math.floor(Math.random() * (diff / 2)) * 2 + 1)
      buildWallZ(x1, wallZ, x2, wallZ)
    }
    if (index !== notBreak && wallX > 0 && wallZ > 0 && wallX < xWidth && wallZ < zWidth) {
      m[wallZ][wallX].value = mazeCellValue.road
    }
  }

  while (len > 0) {
    const { x1, z1, x2, z2 } = history[len - 1]
    history.pop()
    len--
    const centerX = getCoor(x1, x2)
    const centerZ = getCoor(z1, z2)
    const notBreakIndex = Math.floor(Math.random() * 4)
    pushHistoryAndBuilWall(x1, z1, centerX, centerZ, 0, notBreakIndex)
    pushHistoryAndBuilWall(x1, centerZ, centerX, z2, 1, notBreakIndex)
    pushHistoryAndBuilWall(centerX, centerZ, x2, z2, 2, notBreakIndex)
    pushHistoryAndBuilWall(centerX, z1, x2, centerZ, 3, notBreakIndex)
  }

  return mArrayToWalls(m, xNumber, zNumber, groundX, groundZ, roadWidth, wallWidth)
}

// 随机Prim算法
export const generateMazeRecursivePrim = (
  xNumber: number,
  zNumber: number,
  roadWidth: number,
  wallWidth: number,
  groundX: number,
  groundZ: number
): mazeWallType[] => {
  if (!xNumber || !zNumber || !roadWidth || !wallWidth) {
    return []
  }
  // 创建初始地图
  const m = createMazeArray(xNumber, zNumber)
  const history: Array<{ x: number; z: number }> = []
  let len = history.length
  const xEnd = xNumber * 2
  const zEnd = zNumber * 2

  function checkWallNearRoadVisit(x: number, z: number, isPushHistory = false): number {
    let visit = 0
    let x1 = 0
    let z1 = 0
    let x2 = 0
    let z2 = 0
    const wall = m[z] && m[z][x]
    if (!wall || wall.value !== mazeCellValue.wall) {
      return visit
    }
    if (x % 2 === 1) {
      x1 = x
      z1 = z - 1
      x2 = x
      z2 = z + 1
    } else {
      x1 = x + 1
      z1 = z
      x2 = x - 1
      z2 = z
    }
    const targets = [
      { x: x1, z: z1 },
      { x: x2, z: z2 }
    ]
    for (let i = 0; i < 2; i++) {
      const { x: newX, z: newZ } = targets[i]
      const target = m[newZ][newX]
      if (target.visit === mazeCellVisit.visited) {
        visit++
      } else if (isPushHistory) {
        target.visit = mazeCellVisit.visited
        pushHistory(
          [
            { x: newX + 1, z: newZ },
            { x: newX - 1, z: newZ },
            { x: newX, z: newZ + 1 },
            { x: newX, z: newZ - 1 }
          ],
          x,
          z
        )
      }
    }
    return visit
  }

  function pushHistory(
    coors: { x: number; z: number } | Array<{ x: number; z: number }>,
    targetX = -1,
    targetZ = -1
  ): void {
    const targetCoors: Array<{ x: number; z: number }> = coors instanceof Array ? coors : [coors]
    for (let i = 0, length = targetCoors.length; i < length; i++) {
      const { x, z } = targetCoors[i]
      if (
        !x ||
        !z ||
        x === 0 ||
        z === 0 ||
        x === xEnd ||
        z === zEnd ||
        x === targetX ||
        z === targetZ ||
        checkWallNearRoadVisit(x, z) !== 1
      ) {
        continue
      }
      const target = m[z] && m[z][x]
      if (target && target.value === mazeCellValue.wall) {
        history.push({ x, z })
        len++
      }
    }
  }

  // 随机选择一个路的单元格作为起始
  const startX = Math.floor(Math.random() * xNumber) * 2 + 1
  const startZ = Math.floor(Math.random() * zNumber) * 2 + 1
  m[startZ][startX].visit = mazeCellVisit.visited
  pushHistory([
    { x: startX + 1, z: startZ },
    { x: startX - 1, z: startZ },
    { x: startX, z: startZ + 1 },
    { x: startX, z: startZ - 1 }
  ])
  while (len > 0) {
    const index = Math.floor(Math.random() * len)
    const { x, z } = history[index]
    // 检测墙壁两侧的道路是否符合要求
    const visit = checkWallNearRoadVisit(x, z, true)
    if (visit > 0) {
      visit === 1 && (m[z][x].value = mazeCellValue.road)
      history.splice(index, 1)
      len--
    }
  }

  return mArrayToWalls(m, xNumber, zNumber, groundX, groundZ, roadWidth, wallWidth)
}
