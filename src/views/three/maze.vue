<template>
  <!-- 设置contenteditable为true用于启用keydown事件 -->
  <div
    ref="container"
    class="absolute top-0 bottom-0 left-0 right-0 cursor-default"
    style="font-size: 0"
  >
    <!-- 简介 -->
    <div
      class="absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-full font-serif font-semibold transition-all duration-1000 ease-in-out shadow-md bg-violet-300 text-zinc-600"
      :class="{ 't-go': isStart }"
    >
      <!-- tip -->
      <p
        class="relative w-1/2 min-w-full p-6 text-base text-center underline whitespace-pre-line transition-all bg-white underline-offset-4 md:text-left md:min-w-0 rounded-xl decoration-sky-500"
      >
        {{ $t('three.mazeTip') }}
        <n-icon class="absolute text-green-600 top-2 right-2">
          <SvgIcon icon-class="dot" />
        </n-icon>
        <n-icon class="absolute text-yellow-600 top-2 right-5">
          <SvgIcon icon-class="dot" />
        </n-icon>
        <n-icon class="absolute text-red-600 top-2 right-8">
          <SvgIcon icon-class="dot" />
        </n-icon>
      </p>

      <div
        class="flex items-center justify-around w-1/2 h-10 mt-2 text-base leading-10 md:min-w-0 text-neutral-900"
      >
        <div class="flex">
          <span class="mr-2 underline decoration-sky-500"> {{ $t('three.mazeRow') }} </span>
          <n-input-number v-model:value="xNumber" :min="2" :max="300" :show-button="false" />
        </div>
        <div class="flex">
          <span class="mr-2 underline decoration-sky-500"> {{ $t('three.mazeCol') }} </span>
          <n-input-number v-model:value="zNumber" :min="2" :max="300" :show-button="false" />
        </div>
      </div>

      <!-- buttons -->
      <div>
        <n-button
          color="#6366f1"
          size="large"
          class="mt-2 mr-2"
          @click="handlerStart('generateMazeRecursiveDivision')"
        >
          <template #icon>
            <n-icon class="text-white">
              <SvgIcon icon-class="dot" />
            </n-icon>
          </template>
          {{ $t('three.mazeDivision') }}
        </n-button>
        <n-button
          color="#6366f1"
          size="large"
          class="mt-2 mr-2"
          @click="handlerStart('generateMazeRecursiveBacktracker')"
        >
          <template #icon>
            <n-icon class="text-white">
              <SvgIcon icon-class="dot" />
            </n-icon>
          </template>
          {{ $t('three.mazeBacktracker') }}
        </n-button>
        <n-button
          color="#6366f1"
          size="large"
          class="mt-2 mr-2"
          @click="handlerStart('generateMazeRecursivePrim')"
        >
          <template #icon>
            <n-icon class="text-white">
              <SvgIcon icon-class="dot" />
            </n-icon>
          </template>
          {{ $t('three.mazePrim') }}
        </n-button>
      </div>

      <!-- 输入框: 不可见 -->
      <input ref="actionInput" class="absolute top-0 left-0 w-0 h-0 -z-10" />
    </div>

    <!-- 重新开始 -->
    <n-button
      color="#6366f1"
      size="large"
      class="absolute transition-all duration-500 opacity-0 top-2 right-2 -z-10"
      :class="{ 'z-0 opacity-100': isStart }"
      @click="hanldeRestart"
    >
      <template #icon>
        <n-icon class="text-white">
          <SvgIcon icon-class="dot" />
        </n-icon>
      </template>
      Restart
    </n-button>
  </div>
</template>

<script lang="ts" setup>
  import type {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    TextureLoader,
    Vector3,
    Quaternion,
    MeshPhongMaterial
  } from 'three'
  import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls'
  import type StatsTypes from 'three/examples/jsm/libs/stats.module'
  import type { rigidBodyType, mazeWallType } from './components/types'

  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import Stats from 'three/examples/jsm/libs/stats.module'
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import { createListener } from '@/utils/listener'
  import * as generateMaze from './components/maze'
  import { mazeWallDirection } from './components/enums'

  import imageGrid from '@/assets/images/textures/grid.png'
  import imageCrate from '@/assets/images/textures/crate.gif'
  import imageHardWood from '@/assets/images/textures/hardwood.jpg'

  const isStart = ref<boolean>(false)

  const container = ref<HTMLElement>()
  const actionInput = ref<HTMLElement>()

  let camera: PerspectiveCamera | null
  let scene: Scene | null
  let renderer: WebGLRenderer | null
  let controls: OrbitControlsType | null
  let removeWindowResize = () => {}
  let removeKeyPress = () => {}
  let removeClick = () => {}
  let removePointerLockChange = () => {}
  let removeMouseMove = () => {}
  let requestAnimationFrameHandler = 0
  let stats: StatsTypes | null
  let textureLoader: TextureLoader | null
  const pos = new THREE.Vector3()
  const quat = new THREE.Quaternion()
  const clock = new THREE.Clock()
  const boxName = 'box'
  const groundName = 'ground'
  const walName = 'wall'
  let threeObjects: rigidBodyType[] = []

  let ammoInstnce: any
  let physicsWorld: any
  let transformAux: any
  let softBodyHelpers: any
  // 重力
  const gravityConstant = -9.8
  // 边距
  const margin = 0.05
  // 进行物理计算的 threejs刚体列表
  let rigidBodies: rigidBodyType[] = []
  // 不进行物理计算的removeRigidBody
  const physicsWorldRigidBodies: any[] = []
  // 软体列表
  const softBodies: any[] = []

  // 木箱信息
  let box: rigidBodyType | null
  const boxSpeed = new THREE.Vector3()
  const maxSpeed = 20
  const acceleration = 20 // 加速度
  const tempVec = new THREE.Vector3()
  const moveDir = new THREE.Vector3()
  let boxControlsX = 0
  let boxControlsZ = 0
  const boxSx = 6
  const boxSy = 6
  const boxSz = 6

  // 鼠标是否锁定
  let isMouseLock = false
  // x轴坐标
  const xAxis = new THREE.Vector3(1.0, 0.0, 0.0)
  // y轴坐标
  const yAxis = new THREE.Vector3(0.0, 1.0, 0.0)
  // 鼠标旋转角度
  const angles = new THREE.Euler()
  // x轴变化
  const pitch = new THREE.Quaternion()
  // y轴变化
  const yaw = new THREE.Quaternion()
  // 混合变化
  const rotation = new THREE.Quaternion()
  // 鼠标移动速度
  const mouseSpeed = 0.002

  // 场地信息
  const roadWidth = boxSx * 2
  const wallWidth = 1
  const wallHeight = 10
  // 场地纵横各多少单元格
  const xNumber = ref<number>(20)
  const zNumber = ref<number>(30)
  // 场地的x轴长度
  const groundX = computed<number>(
    (): number => (roadWidth + wallWidth) * xNumber.value + wallWidth
  )
  // 场地y轴长度
  const groundZ = computed<number>(
    (): number => (roadWidth + wallWidth) * zNumber.value + wallWidth
  )

  const initAmmo = async (): Promise<void> => {
    const ammofun = window.Ammo
    if (!ammofun) {
      return
    } else if (!(ammofun instanceof Function)) {
      ammoInstnce = ammofun
      return
    }
    await ammofun().then((libs: any) => {
      ammoInstnce = libs
    })
  }

  const onWindowResize = (): void => {
    if (!camera || !renderer || !container.value) {
      return
    }
    const { clientWidth, clientHeight } = container.value
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()

    renderer.setSize(clientWidth, clientHeight)
  }

  const createRigidBody = (
    threeObject: rigidBodyType,
    physicsShape: any,
    mass: number,
    pos: Vector3,
    quat: Quaternion
  ): void => {
    if (!scene) {
      return
    }
    // 设置可视图形的坐标与旋转
    threeObject.position.copy(pos)
    threeObject.quaternion.copy(quat)

    // 物理变换类
    const transform = new ammoInstnce.btTransform()
    // 将此转换设置为标识。
    transform.setIdentity()
    // 设置原点向量
    transform.setOrigin(new ammoInstnce.btVector3(pos.x, pos.y, pos.z))
    // 设置旋转
    transform.setRotation(new ammoInstnce.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    // 提供了一个通用实现，用于将世界变换与偏移同步
    const motionState = new ammoInstnce.btDefaultMotionState(transform)

    // 惯性坐标
    const localInertia = new ammoInstnce.btVector3(0, 0, 0)
    // 计算惯性，质量(mass)为零时不会受到影响
    physicsShape.calculateLocalInertia(mass, localInertia)

    // 刚体信息
    const rbInfo = new ammoInstnce.btRigidBodyConstructionInfo(
      mass,
      motionState,
      physicsShape,
      localInertia
    )

    // 生成物理刚体
    const body = new ammoInstnce.btRigidBody(rbInfo)

    // 给可视躯体赋予物理刚体
    threeObject.userData.physicsBody = body
    scene.add(threeObject)
    // 记录 three object
    threeObjects.push(threeObject)

    // 质量大于零时，加入刚体列表，用于后续的变换
    if (mass > 0) {
      rigidBodies.push(threeObject)
      body.setActivationState(4)
    }

    physicsWorld.addRigidBody(body)
    // 记录 physics rigid body
    physicsWorldRigidBodies.push(body)
  }

  // 创建平行管
  const createParalellepiped = (
    sx: number, // x轴上的长度
    sy: number, // y轴上的长度
    sz: number, // z轴上的长度
    // 以上三者等同于长宽高
    mass: number, // 质量，该值为零时，不会受到重力影响而下落
    pos: Vector3, // 坐标
    quat: Quaternion, // 旋转
    material: MeshPhongMaterial // 材质，此处指定了材质的类型，有需要可对类型进行更改
  ): rigidBodyType => {
    // 创建网格对象
    const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material)
    // 创建长方体形状，参数半区域
    const shape = new ammoInstnce.btBoxShape(
      new ammoInstnce.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
    )
    // 设置碰撞边距
    shape.setMargin(margin)

    // 创建刚体，并把刚体设置到threeObject.userData中
    createRigidBody(threeObject, shape, mass, pos, quat)

    return threeObject
  }

  const initThree = (): void => {
    if (!container.value) {
      return
    }
    const { clientWidth, clientHeight } = container.value

    // 摄像机
    camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.2, 2000)
    camera.position.set(0, 200, 0)

    // 场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#c4b5fd')

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(clientWidth, clientHeight)
    renderer.shadowMap.enabled = true
    container.value.appendChild(renderer.domElement)

    // 控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 2, 0)
    controls.update()

    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // 平行光
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(10, 10, 5)
    light.castShadow = true
    const d = 20
    light.shadow.camera.left = -d
    light.shadow.camera.right = d
    light.shadow.camera.top = d
    light.shadow.camera.bottom = -d
    light.shadow.camera.near = 2
    light.shadow.camera.far = 50
    light.shadow.mapSize.x = 1024
    light.shadow.mapSize.y = 1024
    scene.add(light)

    // 纹理加载器
    textureLoader = new THREE.TextureLoader()

    // 状态监控
    // @ts-ignore
    stats = new Stats()
    if (stats) {
      stats.domElement.style.position = 'absolute'
      stats.domElement.style.top = '0px'
      container.value.appendChild(stats.domElement)
    }

    // 监听窗口大小变化
    removeWindowResize = createListener({ name: 'resize', listener: onWindowResize })
  }

  const initPhysics = (): void => {
    // 创建物理配置
    // 碰撞配置
    const collisionConfiguration = new ammoInstnce.btSoftBodyRigidBodyCollisionConfiguration()
    // 处理碰撞的调度算法
    const dispatcher = new ammoInstnce.btCollisionDispatcher(collisionConfiguration)
    const broadphase = new ammoInstnce.btDbvtBroadphase()
    const solver = new ammoInstnce.btSequentialImpulseConstraintSolver()
    const softBodySolver = new ammoInstnce.btDefaultSoftBodySolver()
    // 根据上面四项配置创建物理世界
    physicsWorld = new ammoInstnce.btSoftRigidDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration,
      softBodySolver
    )
    // 设置重力
    physicsWorld.setGravity(new ammoInstnce.btVector3(0, gravityConstant, 0))
    physicsWorld.getWorldInfo().set_m_gravity(new ammoInstnce.btVector3(0, gravityConstant, 0))

    // 该类由位置和方向组合而成，用来表示刚体的变换，如平移、旋转等
    transformAux = new ammoInstnce.btTransform()
    // 软体是不同于固定形状的刚体，如绳索，可以实现拉伸、弯曲等不同姿态，如软布可以呈现上下波动。创建软体时必须使用软体帮助类
    softBodyHelpers = new ammoInstnce.btSoftBodyHelpers()
  }

  const buildingWalls = (generateMazeFun: string): void => {
    if (!textureLoader) {
      return
    }

    textureLoader.load(imageHardWood, (texture) => {
      // eslint-disable-next-line no-console
      console.time('maze')
      // 创建迷宫
      const walls: mazeWallType[] = generateMaze[generateMazeFun](
        xNumber.value,
        zNumber.value,
        roadWidth,
        wallWidth,
        groundX.value,
        groundZ.value
      )
      // eslint-disable-next-line no-console
      console.timeEnd('maze')
      const len = walls.length
      const sy = wallHeight / 2 + 0.5
      const repeatY = wallHeight / roadWidth
      for (let i = 0; i < len; i++) {
        const textureCopy = texture.clone()
        textureCopy.wrapS = THREE.RepeatWrapping
        textureCopy.wrapT = THREE.RepeatWrapping

        const wall = walls[i]
        if (!wall) {
          continue
        }
        let sx = 0
        let sz = 0
        if (wall.direction === mazeWallDirection.x) {
          sx = wall.width
          sz = wallWidth
        } else {
          sx = wallWidth
          sz = wall.width
        }
        pos.set(wall.x, sy, wall.z)
        textureCopy.repeat.set(wall.width / roadWidth, repeatY)
        const wallBuild = createParalellepiped(
          sx,
          wallHeight,
          sz,
          0,
          pos,
          quat,
          new THREE.MeshPhongMaterial({ color: '#ffffff' })
        )
        wallBuild.name = walName
        wallBuild.castShadow = true
        wallBuild.receiveShadow = true
        wallBuild.material.map = textureCopy
        wallBuild.material.needsUpdate = true
      }
    })
  }

  const createObjects = (): void => {
    if (!textureLoader) {
      return
    }
    // 创建刚体地板
    pos.set(0, 0, 0) // 坐标
    quat.set(0, 0, 0, 1) // 旋转
    const groundSx = groundX.value
    const groundSz = groundZ.value
    const ground = createParalellepiped(
      groundSx,
      1,
      groundSz,
      0,
      pos,
      quat,
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    ground.name = groundName
    // 地板产生阴影，也可以接受阴影
    ground.castShadow = true
    ground.receiveShadow = true
    // 纹理加载
    textureLoader.load(imageGrid, (texture) => {
      // 纹理填充模式
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      // 平铺时，每行平铺的数量，每列平铺的数量
      texture.repeat.set(groundSx, groundSz)
      ground.material.map = texture
      ground.material.needsUpdate = true
    })

    // 创建木盒
    pos.set(-groundSx / 2 + 1 + boxSx / 2, 4, groundSz / 2 - 1 - boxSz / 2)
    quat.set(0, 0, 0, 1)
    box = createParalellepiped(
      boxSx,
      boxSy,
      boxSz,
      10,
      pos,
      quat,
      new THREE.MeshPhongMaterial({ color: '#ffffff' })
    )
    box.name = boxName
    box.castShadow = true
    box.receiveShadow = true
    textureLoader.load(imageCrate, (texture) => {
      if (box) {
        box.material.map = texture
        box.material.needsUpdate = true
      }
    })
  }

  const controlsBoxMove = (objPhys: any, time: number): void => {
    const direction = moveDir.set(boxControlsZ, 0, boxControlsX).normalize()
    const velocity = objPhys.getLinearVelocity()

    const acc = tempVec.copy(direction).multiplyScalar(acceleration * time)
    acc.length() === 0 ? boxSpeed.copy(acc) : boxSpeed.add(acc)
    boxSpeed.clampLength(0, maxSpeed)

    const moveVector = tempVec.copy(boxSpeed)
    moveVector.applyQuaternion(yaw)

    velocity.setX(moveVector.x)
    velocity.setZ(moveVector.z)

    objPhys.setLinearVelocity(velocity)
    // objPhys.setAngularVelocity(new ammoInstnce.btVector3(0.0, 0.0, 0.0))

    boxControlsX = 0
    boxControlsZ = 0
  }

  const updatePhysics = (deltaTime: number): void => {
    // Step world
    const time = physicsWorld.stepSimulation(deltaTime, 10)

    // Update rigid bodies
    for (let i = 0, il = rigidBodies.length; i < il; i++) {
      const objThree = rigidBodies[i]
      const objPhys = objThree.userData.physicsBody
      objThree.name === boxName && controlsBoxMove(objPhys, time)
      const ms = objPhys.getMotionState()
      if (ms) {
        ms.getWorldTransform(transformAux)
        const p = transformAux.getOrigin()
        const q = transformAux.getRotation()
        objThree.position.set(p.x(), p.y(), p.z())
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
      }
    }
    // 更新相机位置
    updateCamera(true)
  }

  const updateCamera = (isY = false): void => {
    if (camera && box && isMouseLock) {
      const posBox = box.position
      camera.position.setX(posBox.x)
      camera.position.setZ(posBox.z)
      isY && camera.position.setY(posBox.y + 5)
    }
  }

  const updateRotation = (): void => {
    if (!camera) {
      return
    }
    pitch.setFromAxisAngle(xAxis, angles.x)
    yaw.setFromAxisAngle(yAxis, angles.y)
    rotation.multiplyQuaternions(yaw, pitch).normalize()
    camera.quaternion.copy(rotation)
  }

  const onEvent = (): void => {
    if (!container.value) {
      return
    }
    const handlerKeydown = (event: KeyboardEvent): void => {
      // 停止冒泡
      event.stopPropagation()
      const key = event.key
      if (!key || !isMouseLock) {
        return
      }
      switch (key) {
        case 'w':
        case 'W':
          boxControlsX--
          break
        case 's':
        case 'S':
          boxControlsX++
          break
        case 'a':
        case 'A':
          boxControlsZ--
          break
        case 'd':
        case 'D':
          boxControlsZ++
          break
        default:
          break
      }
    }

    const handlerClick = (): void => {
      if (container.value && !isMouseLock && actionInput.value) {
        container.value.requestPointerLock()
        actionInput.value.focus()
      }
    }

    const handlerPointerLockChange = (): void => {
      controls && (controls.enabled = isMouseLock)
      isMouseLock = !isMouseLock
    }

    const handlerMouseMove = (event: MouseEvent): void => {
      if (!isMouseLock) {
        return
      }
      const { movementX, movementY } = event
      angles.y -= movementX * mouseSpeed
      angles.x -= movementY * mouseSpeed
      angles.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angles.x))
      updateRotation()
    }

    removePointerLockChange = createListener({
      el: document,
      name: 'pointerlockchange',
      listener: handlerPointerLockChange
    })

    removeKeyPress = createListener({
      el: actionInput.value,
      name: 'keydown',
      listener: handlerKeydown
    })

    removeClick = createListener({
      el: container.value,
      name: 'dblclick',
      listener: handlerClick
    })

    removeMouseMove = createListener({
      el: container.value,
      name: 'mousemove',
      listener: handlerMouseMove
    })
  }

  const execRender = (): void => {
    if (!renderer || !scene || !camera) {
      return
    }
    const deltaTime = clock.getDelta()
    updatePhysics(deltaTime)
    renderer.render(scene, camera)
  }

  const execAnimate = (): void => {
    requestAnimationFrameHandler = requestAnimationFrame(execAnimate)
    execRender()
    stats && stats.update()
  }

  // 开始操作
  const handlerStart = (generateMazeFun: string): void => {
    if (isNaN(xNumber.value) && xNumber.value < 1) {
      xNumber.value = 20
    }
    if (isNaN(zNumber.value) && zNumber.value < 1) {
      zNumber.value = 20
    }
    // 取整
    xNumber.value = xNumber.value | 0
    zNumber.value = zNumber.value | 0

    isStart.value = true
    createObjects()
    buildingWalls(generateMazeFun)
    onEvent()
  }

  // 重新开始，清除部分监听
  const clearWidthRestart = (): void => {
    removePointerLockChange()
    removeMouseMove()
    removeKeyPress()
    removeClick()
  }

  // 重新开始
  const hanldeRestart = (): void => {
    isStart.value = false
    setTimeout(() => {
      if (scene && camera) {
        for (let i = 0, len = threeObjects.length; i < len; i++) {
          scene.remove(threeObjects[i])
        }
        clearWidthRestart()
        rigidBodies = []
        threeObjects = []
        for (let i = 0, len = physicsWorldRigidBodies.length; i < len; i++) {
          physicsWorld.removeRigidBody(physicsWorldRigidBodies[i])
        }
      }
    }, 500)
  }

  onMounted(async (): Promise<void> => {
    await initAmmo()
    if (!ammoInstnce) {
      return
    }
    initThree()
    initPhysics()
    execAnimate()
  })

  onBeforeUnmount((): void => {
    if (requestAnimationFrameHandler) {
      cancelAnimationFrame(requestAnimationFrameHandler)
    }
    removeWindowResize()
    clearWidthRestart()
  })
</script>

<style lang="scss" scoped>
  .t-go {
    top: -150% !important;
  }
</style>
