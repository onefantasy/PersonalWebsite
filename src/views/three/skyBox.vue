<template>
  <div
    ref="container"
    v-loading="imgLoading"
    class="absolute top-0 bottom-0 left-0 right-0"
    :class="{ 'cursor-pointer': isPointer }"
    @click.stop="handleClick"
  >
    <n-popover ref="tip" :x="popoverX" :y="popoverY" trigger="manual">
      {{ $t(popoverContent) }}
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
  import type {
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
    MeshBasicMaterial,
    Raycaster
  } from 'three'
  import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls'
  import type { skyBoxTipItemType, skyBoxSpriteType, skyBoxSenceInfo } from './components/types'

  import { skyBoxSenceKeys } from './components/enums'

  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { createListener } from '@/utils/listener'
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
  import { getElementOffsetInfo } from '@/utils/tools'

  import imgLivingRoom from '@/assets/images/textures/skyBox_livingRoom.jpg'
  import imgKitchen from '@/assets/images/textures/skyBox_kitchen.jpg'
  import imgTip from '@/assets/images/textures/tip.png'

  // 背景加载标志
  const imgLoading = ref<boolean>(false)

  const container = ref<HTMLElement>()
  let animateTimer = 0
  const isPointer = ref<boolean>(false)
  let removeWindowResize = () => {}
  let removeMouseMove = () => {}

  let camera: PerspectiveCamera
  let scene: Scene
  let renderer: WebGLRenderer
  let controls: OrbitControlsType
  let textureLoader: TextureLoader
  const tipSpriteList: Array<skyBoxSpriteType> = []
  let raycaster: Raycaster

  // 屏幕信息
  let containerWidth = 0
  let containerHeight = 0
  let containerTop = 0
  let containerLeft = 0
  const mouse = new THREE.Vector2()

  // 记录鼠标当前拾取到的下一个场景信息
  let mousePickupSenceInfo: skyBoxSenceKeys | '' = ''

  // 弹出信息
  const tip = ref()
  const popoverX = ref<number>(0)
  const popoverY = ref<number>(0)
  const popoverContent = ref<string>('')
  const livingroomTipInfoList: Array<skyBoxTipItemType> = [
    {
      x: -199,
      y: -24,
      z: -145,
      content: 'three.skyBoxTokitchen',
      senceInfo: skyBoxSenceKeys.kitchen
    },
    { x: 200, y: 0, z: 145, content: 'three.skyBoxTV' },
    { x: -250, y: 0, z: 0, content: 'three.skyBoxWindow' },
    { x: 250, y: 0, z: 0, content: 'three.skyBoxFrenchWindow' },
    { x: 0, y: -250, z: 0, content: 'three.skyBoxFloor' },
    { x: 170, y: -100, z: 140, content: 'three.skyBoxPillow' },
    { x: 20, y: 0, z: -250, content: 'three.skyBoxDoor' },
    { x: 0, y: 0, z: 250, content: 'three.skyBoxPaintings' }
  ]
  const kitchenTipInfoList: Array<skyBoxTipItemType> = [
    {
      x: -200,
      y: -25,
      z: 150,
      content: 'three.skyBoxTolivingroom',
      senceInfo: skyBoxSenceKeys.livingroom
    }
  ]

  // 场景信息
  const senceInfoMap: skyBoxSenceInfo = {
    [skyBoxSenceKeys.livingroom]: { img: imgLivingRoom, tipList: livingroomTipInfoList },
    [skyBoxSenceKeys.kitchen]: { img: imgKitchen, tipList: kitchenTipInfoList }
  }
  // 当前场景信息
  let currentSenceKey = skyBoxSenceKeys.livingroom

  /** 监听窗口到校变化 */
  const onWindowResize = (): void => {
    if (!container.value) {
      return
    }
    setContainerInfo()

    camera.aspect = containerWidth / containerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(containerWidth, containerHeight, true)
  }

  /** 鼠标移动，判断拾取 */
  const onMouseMove = (event: MouseEvent): void => {
    // event中获取到clientX和clientY时相对于窗口的，不是相对于container，所以需要减去container在窗口中的相对位置
    const clientX = event.clientX - containerLeft
    const clientY = event.clientY - containerTop
    // 停止冒泡
    event.preventDefault()
    // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    mouse.set((clientX / containerWidth) * 2 - 1, -(clientY / containerHeight) * 2 + 1)
    raycaster.setFromCamera(mouse, camera)
    // 将精灵列表放进来做视线交互
    const intersects = raycaster.intersectObjects(tipSpriteList, true)
    // 是否改变鼠标样式为pointer
    isPointer.value = intersects.length > 0
    if (isPointer.value) {
      popoverX.value = event.clientX
      popoverY.value = event.clientY
      // @ts-ignore
      popoverContent.value = intersects[0].object.content
      // @ts-ignore
      mousePickupSenceInfo = intersects[0].object.senceInfo || ''
      tip.value.setShow(true)
    } else {
      mousePickupSenceInfo = ''
      tip.value.setShow(false)
    }
  }

  /** 鼠标点击, 判断跳转 */
  const handleClick = (event: MouseEvent): void => {
    if (mousePickupSenceInfo) {
      currentSenceKey = mousePickupSenceInfo
      scene.clear()
      // 清空记录的精灵数组
      tipSpriteList.splice(0)
      // 重新创建场景
      createObjects()
    }
  }

  /**
   * 获取container的信息并将其设置到全局
   */
  const setContainerInfo = (): void => {
    if (!container.value) {
      return
    }
    const { clientWidth, clientHeight } = container.value
    containerWidth = clientWidth
    containerHeight = clientHeight
    // 获取窗口在网页中位置
    const position = getElementOffsetInfo(container.value)
    containerTop = position.top
    containerLeft = position.left
  }

  const onEvents = (): void => {
    // 监听窗口大小变化
    removeWindowResize = createListener({ name: 'resize', listener: onWindowResize })
    // 监听鼠标移动
    removeMouseMove = createListener({
      el: container.value,
      name: 'mousemove',
      // name: 'mousedown',
      listener: onMouseMove
    })
  }

  const initThree = (): void => {
    if (!container.value) {
      return
    }
    setContainerInfo()

    camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000)
    camera.position.set(50, 0, 40)

    scene = new THREE.Scene()
    scene.background = new THREE.Color('#c4b5fd')

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(containerWidth, containerHeight)
    container.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 1
    controls.maxDistance = 60
    controls.enablePan = false

    textureLoader = new THREE.TextureLoader()

    raycaster = new THREE.Raycaster()
  }

  const createObjects = (): void => {
    const senceInfo = senceInfoMap[currentSenceKey]
    const tipList = senceInfo.tipList
    if (!senceInfo) {
      return
    }

    // content
    const boxShape = new THREE.SphereGeometry(16, 50, 50)
    const boxMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial()
    const box = new THREE.Mesh(boxShape, boxMaterial)
    imgLoading.value = true
    textureLoader.load(senceInfo.img, (texture) => {
      imgLoading.value = false
      box.material.map = texture
      box.material.needsUpdate = true
    })
    box.geometry.scale(16, 16, -16)
    scene.add(box)

    // tip
    const tipMaterial = new THREE.SpriteMaterial()
    const sprite: skyBoxSpriteType = new THREE.Sprite(tipMaterial)
    textureLoader.load(imgTip, (texture) => {
      for (let i = 0, len = tipList.length; i < len; i++) {
        const spriteBackup = sprite.clone()
        const { x, y, z, content, senceInfo } = tipList[i]
        spriteBackup.material.map = texture
        spriteBackup.material.needsUpdate = true
        spriteBackup.position.set(x, y, z)
        spriteBackup.scale.set(10, 10, 10)
        spriteBackup.content = content
        spriteBackup.senceInfo = senceInfo || ''
        scene.add(spriteBackup)
        // push tip sprite list array
        tipSpriteList.push(spriteBackup)
      }
    })
  }

  const execRender = (): void => {
    controls.update()
    renderer.render(scene, camera)
  }

  const execAnimate = (): void => {
    animateTimer = requestAnimationFrame(execAnimate)
    execRender()
  }

  onMounted((): void => {
    // 在nextTick中进行初始化，防止刷新页面时，侧边栏未渲染完成影响
    nextTick(() => {
      initThree()
      createObjects()
      execAnimate()
      onEvents()
    })
  })

  onBeforeUnmount((): void => {
    if (animateTimer) {
      cancelAnimationFrame(animateTimer)
    }
    removeWindowResize()
    removeMouseMove()
  })
</script>
