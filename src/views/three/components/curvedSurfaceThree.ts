import type { curvedSurfaceListItemType, curvedSurfaceCoordinateType } from './types'
import type { Scene, PerspectiveCamera } from 'three'
import type { CSS3DRenderer as CSS3DRendererType } from 'three-css3d'

import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three-css3d'
import { createListener } from '@/utils/listener'

export class threeHandlerClass {
  // 数据信息
  container: HTMLElement | null = null
  clientWidth = 0
  clientHeight = 0
  colNum = 0
  rowNum = 0
  allItemNum = 0
  itemWidth = 0
  dataList: Array<Array<curvedSurfaceListItemType>> = []
  // 每个页面的角度
  pageDeg = 0
  // 角度转弧度系数，弧度 = 角度 * 系数
  degToRadianConstant = 0.017453293
  // 半径
  radius = 0
  // 单个元素的弧度
  radian = 0
  // 1px 等于的弧度值，默认0.0001
  pxToRadian = 0.0001
  // 自动播放速度
  autoPlaySpeed = 0
  autoPlaySpeedRadian = 0
  // 是否处于拖动中
  isDrag = false
  // 鼠标滚轮每次滚动距离，单位px
  mouseWheelStep = 40

  // 容器元素class
  elementClass = 'box-border p-1'
  // 图片元素class
  imgClass =
    'rounded-md w-full h-full object-contain select-none relative cursor-pointer border-2 border-transparent'
  // 遮罩元素class
  maskClass = 'absolute z-10 top-0 bottom-0 left-0 right-0 cursor-grabbing'
  // 遮罩元素
  maskElement: HTMLElement | null = null

  // three信息
  scene: Scene | null = null
  camera: PerspectiveCamera | null = null
  renderer: CSS3DRendererType | null = null
  animateTimer = 0

  // 删除鼠标事件
  mouseDragRemove = (): void => {}
  mouseWheelWebkitRemove = (): void => {}
  mouseWheelMozRemove = (): void => {}
  mouseMoveRemove = (): void => {}

  /**
   * 设置数据信息
   * @param { HTMLElement } container 容器
   * @param { number } clientWidth 渲染区域宽度
   * @param { number } clientHeight 渲染区域高度
   * @param { number } colNum 列数
   * @param { number } rowNum 行数
   * @param { number } allItemNum 单页元素数量
   * @param { number } itemWidth 元素宽度, 宽高相等
   * @param { Array<Array<curvedSurfaceListItemType>> } dataList 渲染数据
   */
  setInfo(
    container: HTMLElement,
    clientWidth: number,
    clientHeight: number,
    colNum: number,
    rowNum: number,
    allItemNum: number,
    itemWidth: number,
    dataList: Array<Array<curvedSurfaceListItemType>>
  ): void {
    this.container = container
    this.clientWidth = clientWidth
    this.clientHeight = clientHeight
    this.colNum = colNum
    this.rowNum = rowNum
    this.allItemNum = allItemNum
    this.itemWidth = itemWidth
    this.dataList = dataList
    this.pageDeg = 360 / dataList.length
    // 单个元素的弧度
    this.radian = (this.pageDeg / colNum) * this.degToRadianConstant
    // 半径
    this.radius = itemWidth / 2 / Math.tan(this.radian / 2)
    // 1px 等于的弧度值
    this.pxToRadian = (this.pageDeg / clientWidth) * this.degToRadianConstant
  }

  /** 设置自动播放的速度 */
  setAutoPlaySpeed(value = 4): void {
    // 自动播放速度
    this.autoPlaySpeed = value
    this.autoPlaySpeedRadian = (-value * this.pxToRadian) / 5
  }

  /** 初始化 three 工具 */
  init(): void {
    const { container, clientWidth, pageDeg, degToRadianConstant, radian, radius, clientHeight } =
      this
    if (!container || clientHeight === 0 || clientWidth === 0) {
      return
    }
    this.scene = new THREE.Scene()

    // 计算相机视野角度
    const cameraToPlaneDistance = radius * Math.cos((pageDeg * degToRadianConstant - radian) / 2)
    const fov = Math.atan(clientHeight / 2 / cameraToPlaneDistance) * 2 * (180 / Math.PI)
    this.camera = new THREE.PerspectiveCamera(fov, clientWidth / clientHeight, 1, 2000)

    this.renderer = new CSS3DRenderer()
    this.renderer.setSize(clientWidth, clientHeight)
    container.appendChild(this.renderer.domElement)
  }

  /** 执行渲染 */
  execRender(): void {
    const { renderer, scene, camera, autoPlaySpeedRadian } = this
    if (!renderer || !scene || !camera) {
      this.cancelAnimate()
      return
    }
    // 自动播放
    if (autoPlaySpeedRadian !== 0) {
      camera.rotateY(autoPlaySpeedRadian)
    }
    renderer.render(scene, camera)
  }

  /** 循环渲染动画 */
  execAnimate = (): void => {
    this.animateTimer = requestAnimationFrame(this.execAnimate)
    this.execRender()
  }

  /** 关闭循环渲染动画 */
  cancelAnimate = (): void => {
    cancelAnimationFrame(this.animateTimer)
  }

  /**
   * 根据数据列表创建视图
   * @returns { void }
   */
  createListView(): void {
    const { dataList } = this
    const dataLen = dataList.length
    if (dataLen === 0) {
      return
    }

    // 生成元素
    for (let i = 0; i < dataLen; i++) {
      const list = dataList[i]
      const listLen = list.length
      if (listLen <= 0) {
        continue
      }
      const coordiantes: Array<curvedSurfaceCoordinateType | false> = this._computeCoordinate(i)
      // 大图处理
      for (let j = 0; j < listLen; j++) {
        if (list[j].isBig) {
          const coordinate = this._getBigCoordinate(coordiantes)
          coordinate && this._generateElement(list[j], coordinate, 2)
        }
      }
      // 普通图处理
      let coordinateIndex = 0
      const coordinateLen = coordiantes.length - 1
      for (let j = 0; j < listLen; j++) {
        if (!list[j].isBig) {
          const index = this._getNormalCoordinate(coordiantes, coordinateIndex, coordinateLen)
          if (index !== 0 && !index) {
            break
          }
          this._generateElement(list[j], coordiantes[index], 1)
          coordiantes[index] = false
          coordinateIndex = index + 1
        }
      }
    }
  }

  /**
   * 获取大图坐标(随机)
   * @param { Array<curvedSurfaceCoordinateType> } coordinates 做坐标集
   * @returns { curvedSurfaceCoordinateType } 坐标
   */
  _getBigCoordinate(
    coordinates: Array<curvedSurfaceCoordinateType | false>
  ): curvedSurfaceCoordinateType | false {
    const { rowNum, colNum } = this
    const coordinate = { deg: 0, position: { x: 0, y: 0, z: 0 }, lookAt: { x: 0, y: 0, z: 0 } }
    const len = coordinates.length
    if (len <= 0) {
      return false
    }
    let indexLeftTop = Math.floor(Math.random() * len)
    if (indexLeftTop % rowNum === rowNum - 1) {
      indexLeftTop -= 1
    }
    if (Math.ceil(indexLeftTop / rowNum) === colNum) {
      indexLeftTop -= rowNum
    }
    let flag = this._checkBigCoordinate(coordinates, indexLeftTop)
    let isOver = false
    let isSecond = false
    while (!flag && !isOver) {
      indexLeftTop++
      if (indexLeftTop >= len && !isSecond) {
        indexLeftTop = 0
        isSecond = true
      } else if (indexLeftTop >= len) {
        isOver = true
      }
      flag = this._checkBigCoordinate(coordinates, indexLeftTop)
    }
    if (!flag) {
      return false
    }
    const coordianteLeftTop = coordinates[indexLeftTop]
    const coordianteRightBottom = coordinates[indexLeftTop + rowNum + 1]
    if (!coordianteLeftTop || !coordianteRightBottom) {
      return false
    }
    coordinate.deg = (coordianteLeftTop.deg + coordianteRightBottom.deg) / 2
    coordinate.position = {
      x: (coordianteLeftTop.position.x + coordianteRightBottom.position.x) / 2,
      y: (coordianteLeftTop.position.y + coordianteRightBottom.position.y) / 2,
      z: (coordianteLeftTop.position.z + coordianteRightBottom.position.z) / 2
    }
    coordinate.lookAt = {
      x: coordinate.position.x * -2,
      y: coordinate.position.y,
      z: coordinate.position.z * -2
    }
    // 销毁已使用的坐标
    coordinates[indexLeftTop] = false
    coordinates[indexLeftTop + 1] = false
    coordinates[indexLeftTop + rowNum] = false
    coordinates[indexLeftTop + rowNum + 1] = false
    return coordinate
  }

  /**
   * 获取普通图坐标
   * @param { Array<curvedSurfaceCoordinateType> } coordiantes 坐标集
   * @param { number } index 开始检测的坐标索引
   * @param { number } len 坐标集长度
   * @returns { number } 可用坐标做因
   */
  _getNormalCoordinate(
    coordiantes: Array<curvedSurfaceCoordinateType | false>,
    index: number,
    len: number
  ): number | false {
    let flag = coordiantes[index]
    while (!flag && index <= len) {
      index++
      flag = coordiantes[index]
    }
    if (!flag) {
      return false
    }
    return index
  }

  /**
   * 检测给定的坐标是否符合
   * @param coordinates 坐标集
   * @param indexLeftTop 检测的坐标索引
   * @returns { boolean } 是否符合
   */
  _checkBigCoordinate(
    coordinates: Array<curvedSurfaceCoordinateType | false>,
    indexLeftTop: number
  ): boolean {
    const { rowNum, colNum } = this
    // 临界检查
    if (indexLeftTop % rowNum === rowNum - 1 || Math.ceil(indexLeftTop / rowNum) === colNum) {
      return false
    }
    // 分别检测左上角，右上角，左下角，右下角
    const valueList = [0, rowNum, 1, rowNum + 1]
    let index: number = indexLeftTop
    for (let i = 0, len = valueList.length; i < len; i++) {
      index = indexLeftTop + valueList[i]
      if (!coordinates[index]) {
        return false
      }
    }
    return true
  }

  /**
   * 计算曲面坐标
   * @param { number } index 页面索引，代表计算第几页
   * @return { Array<curvedSurfaceCoordinateType> }
   */
  _computeCoordinate(index: number): Array<curvedSurfaceCoordinateType> {
    const coordinates: Array<curvedSurfaceCoordinateType> = []
    const {
      colNum,
      rowNum,
      allItemNum,
      itemWidth,
      pageDeg,
      degToRadianConstant,
      clientHeight,
      clientWidth,
      radian
    } = this
    if (
      colNum === 0 ||
      allItemNum === 0 ||
      itemWidth === 0 ||
      pageDeg === 0 ||
      clientWidth === 0 ||
      clientHeight === 0
    ) {
      return coordinates
    }
    // 半径(取负数)
    const radius = -this.radius
    // 起始角度
    const startDeg = pageDeg * (0.5 - index) * degToRadianConstant - radian / 2
    // 起始坐标y = 容器高度 / 2 - 剩余高度 / 2 - 单个元素高度 / 2, 化简得到以下公式
    const positionY = (clientHeight - (clientHeight % itemWidth) - itemWidth) / 2
    for (let i = 0; i < colNum; i++) {
      const deg = startDeg - (i % colNum) * radian
      const x = radius * Math.sin(deg)
      let y = positionY
      const z = radius * Math.cos(deg)
      for (let j = 0; j < rowNum; j++) {
        y = positionY - j * itemWidth
        coordinates.push({
          position: { x, y, z },
          lookAt: { x: -2 * x, y, z: -2 * z },
          deg
        })
      }
    }

    return coordinates
  }

  /**
   * 创建元素
   * @param { curvedSurfaceListItemType } item 单个元素数据
   * @param { curvedSurfaceCoordinateType } coordiante 坐标
   * @param { number } expand 扩大倍数
   */
  _generateElement(
    item: curvedSurfaceListItemType,
    coordiante: curvedSurfaceCoordinateType | false,
    expand: number
  ): void {
    const { scene, itemWidth, elementClass, imgClass } = this
    if (!scene || itemWidth === 0 || !coordiante) {
      return
    }
    // 创建元素
    const element = document.createElement('div')
    element.className = elementClass
    element.style.cssText = `width:${expand * itemWidth}px;height:${expand * itemWidth}px;`
    element.dataset.stopautoplay = 'true'

    // 创建图片
    const img = document.createElement('img')
    img.className = imgClass
    img.src = item.url
    img.draggable = false
    img.dataset.stopautoplay = 'true'
    img.dataset.isimg = 'true'
    element.appendChild(img)

    const { position, lookAt } = coordiante
    // 创建 CSS3D 对象
    const object = new CSS3DObject(element)
    object.position.set(position.x, position.y, position.z)
    // 元素朝向
    const vector = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)
    object.lookAt(vector)
    scene.add(object)
  }

  /**
   * 摄像机绕y轴旋转
   * @param deg 旋转角度 弧度
   * @returns { void }
   */
  cameraRotateY(deg: number): void {
    const { camera } = this
    if (!camera) {
      return
    }
    camera.rotateY(deg)
  }

  /** 开始事件监功能：鼠标拖动, 鼠标滚轮 */
  mountedEvent(): void {
    // 创建并添加拖动遮罩元素
    if (!this.maskElement) {
      this.maskElement = document.createElement('div')
      this.maskElement.className = this.maskClass
    }

    /** 鼠标拖动处理: 分为按下，移动，抬起，按下事件 */
    this.mouseDragRemove = createListener({
      el: this.container,
      name: 'mousedown',
      listener: this._handleMouseDown()
    })

    /** 鼠标滚轮 */
    this.mouseWheelWebkitRemove = createListener({
      el: this.container,
      name: 'mousewheel',
      listener: this._handleMouseWheelWebkit()
    })
    this.mouseWheelMozRemove = createListener({
      el: this.container,
      name: 'DOMMouseScroll',
      listener: this._handleMouseWheelMoz()
    })

    /** 鼠标移动 */
    this.mouseMoveRemove = createListener({
      name: 'mousemove',
      listener: this._handleMouveMove()
    })
  }

  /** 删除所有事件监听 */
  cancelEvent(): void {
    this.mouseDragRemove()
    this.mouseWheelWebkitRemove()
    this.mouseWheelMozRemove()
    this.mouseMoveRemove()
  }

  /** 鼠标按下事件 */
  _handleMouseDown(): Function {
    const { container, maskElement, pxToRadian } = this
    const _this = this

    return (eventDown: MouseEvent) => {
      // 取消默认事件，此处为拖动图片
      eventDown.preventDefault()
      // 停止冒泡
      eventDown.stopPropagation()

      // 鼠标移动事件
      document.onmousemove = (eventMove: MouseEvent): void => {
        if (!_this.isDrag && maskElement && container) {
          // 添加遮罩
          container.appendChild(maskElement)
          _this.isDrag = true
        }
        const { movementX } = eventMove
        _this.cameraRotateY(movementX * pxToRadian)
      }

      // 鼠标抬起事件
      document.onmouseup = (): void => {
        if (maskElement && container && _this.isDrag) {
          container.removeChild(maskElement)
        }
        _this.isDrag = false
        document.onmouseup = null
        document.onmousemove = null
      }
    }
  }

  /** 鼠标滚轮 webkit */
  _handleMouseWheelWebkit(): Function {
    const { mouseWheelStep, pxToRadian } = this
    return (event: WheelEvent) => {
      this.cameraRotateY((event.deltaY > 0 ? -1 : 1) * mouseWheelStep * pxToRadian)
    }
  }

  /** 鼠标滚轮 moz */
  _handleMouseWheelMoz(): Function {
    const { mouseWheelStep, pxToRadian } = this
    return (event: WheelEvent) => {
      // eslint-disable-next-line no-console
      console.log('event:', event)
      this.cameraRotateY((event.detail > 0 ? -1 : 1) * mouseWheelStep * pxToRadian)
    }
  }

  /** 鼠标移动事件 */
  _handleMouveMove(): Function {
    const _this = this
    return (event: MouseEvent) => {
      const flag = (event.target as HTMLElement).dataset
        ? (event.target as HTMLElement).dataset.stopautoplay === 'true'
        : false
      if (flag || _this.isDrag) {
        _this.autoPlaySpeedRadian = 0
      } else {
        _this.setAutoPlaySpeed(_this.autoPlaySpeed)
      }
    }
  }
}
