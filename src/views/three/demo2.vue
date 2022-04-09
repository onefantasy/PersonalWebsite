<template>
  <div ref="container" class="absolute top-0 bottom-0 left-0 right-0" />
</template>

<script lang="ts" setup>
  import type { PerspectiveCamera, Scene, WebGLRenderer, TextureLoader } from 'three'
  import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls'
  import type StatsTypes from 'three/examples/jsm/libs/stats.module'
  import * as THREE from 'three'
  import Stats from 'three/examples/jsm/libs/stats.module'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
  import { onMounted, ref, onUnmounted } from 'vue'
  import { createListener } from '@/utils/listener'
  import gridPng from '@/assets/images/textures/grid.png'
  import colorPng from '@/assets/images/textures/colors.png'
  import imageCrate from '@/assets/images/textures/crate.gif'

  let removeWindowResize = () => {}
  let removePointerdown = () => {}
  let requestAnimationFrameHandle = 0

  // 图形变量
  const container = ref<HTMLElement>()
  let stats: StatsTypes
  let camera: PerspectiveCamera | null
  let controls: OrbitControlsType | null
  let scene: Scene | null
  let renderer: WebGLRenderer | null
  let texttureLoader: TextureLoader | null
  const clock = new THREE.Clock()
  let clickRequest = false
  const mouseCoords = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 })
  const pos = new THREE.Vector3()
  const quat = new THREE.Quaternion()

  // physics variables
  const gravityConstant = -9.8
  let physicsWorld: any
  const rigidBodies: any[] = []
  const softBoides: any[] = []
  const margin = 0.05
  let transformAux1: any
  let softBodyHelpers: any

  let ammoInstnce: any

  async function initammoInstnce(): Promise<void> {
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

  // eslint-disable-next-line max-params
  const createRigidBody = (threeObject: any, physicsShape: any, mass: any, pos: any, quat: any) => {
    if (!scene) {
      return
    }
    // 设置可视图形的信息
    threeObject.position.copy(pos)
    threeObject.quaternion.copy(quat)

    // 创建物理躯体
    const transform = new ammoInstnce.btTransform()
    transform.setIdentity()
    transform.setOrigin(new ammoInstnce.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new ammoInstnce.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new ammoInstnce.btDefaultMotionState(transform)

    const localInertia = new ammoInstnce.btVector3(0, 0, 0)
    physicsShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new ammoInstnce.btRigidBodyConstructionInfo(
      mass,
      motionState,
      physicsShape,
      localInertia
    )
    // 生成物理躯体
    const body = new ammoInstnce.btRigidBody(rbInfo)

    // 给可视图形赋予物理躯体
    threeObject.userData.physicsBody = body
    scene.add(threeObject)

    if (mass > 0) {
      rigidBodies.push(threeObject)
      body.setActivationState(4)
    }

    physicsWorld.addRigidBody(body)

    return body
  }

  const createParalellepiped = (
    sx: any,
    sy: any,
    sz: any,
    mass: any,
    pos: any,
    quat: any,
    material: any
    // eslint-disable-next-line max-params
  ) => {
    // 创建网格对象
    const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material)
    // 创建长方体形状，参数为半区域
    const shape = new ammoInstnce.btBoxShape(
      new ammoInstnce.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
    )
    // 设置碰撞边缘数
    shape.setMargin(margin)

    createRigidBody(threeObject, shape, mass, pos, quat)

    return threeObject
  }

  // eslint-disable-next-line max-params
  const isEqual = (x1: any, y1: any, z1: any, x2: any, y2: any, z2: any) => {
    const delta = 0.000001
    return Math.abs(x2 - x1) < delta && Math.abs(y2 - y1) < delta && Math.abs(z2 - z1) < delta
  }

  const mapIndices = (bufGeometry: any, indexedBufferGeom: any) => {
    // Creates ammoInstnceVertices, ammoInstnceIndices and ammoInstnceIndexAssociation in bufGeometry

    const vertices = bufGeometry.attributes.position.array
    const idxVertices = indexedBufferGeom.attributes.position.array
    const indices = indexedBufferGeom.index.array

    const numIdxVertices = idxVertices.length / 3
    const numVertices = vertices.length / 3

    bufGeometry.ammoInstnceVertices = idxVertices
    bufGeometry.ammoInstnceIndices = indices
    bufGeometry.ammoInstnceIndexAssociation = []

    for (let i = 0; i < numIdxVertices; i++) {
      const association: any[] = []
      bufGeometry.ammoInstnceIndexAssociation.push(association)

      const i3 = i * 3

      for (let j = 0; j < numVertices; j++) {
        const j3 = j * 3
        if (
          isEqual(
            idxVertices[i3],
            idxVertices[i3 + 1],
            idxVertices[i3 + 2],
            vertices[j3],
            vertices[j3 + 1],
            vertices[j3 + 2]
          )
        ) {
          association.push(j3)
        }
      }
    }
  }

  const processGeometry = (bufGeometry: any) => {
    // Ony consider the position values when merging the vertices
    const posOnlyBufGeometry = new THREE.BufferGeometry()
    posOnlyBufGeometry.setAttribute('position', bufGeometry.getAttribute('position'))
    posOnlyBufGeometry.setIndex(bufGeometry.getIndex())

    // Merge the vertices so the triangle soup is converted to indexed triangles
    const indexedBufferGeom = BufferGeometryUtils.mergeVertices(posOnlyBufGeometry)

    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    mapIndices(bufGeometry, indexedBufferGeom)
  }

  const createSoftVolume = (bufferGeom: any, mass: any, pressure: any) => {
    if (!scene || !texttureLoader) {
      return
    }
    processGeometry(bufferGeom)

    const volume = new THREE.Mesh(bufferGeom, new THREE.MeshPhongMaterial({ color: 0xffffff }))
    volume.castShadow = true
    volume.receiveShadow = true
    volume.frustumCulled = false
    scene.add(volume)

    texttureLoader.load(colorPng, function (texture) {
      volume.material.map = texture
      volume.material.needsUpdate = true
    })

    // Volume physic object

    const volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
      physicsWorld.getWorldInfo(),
      bufferGeom.ammoInstnceVertices,
      bufferGeom.ammoInstnceIndices,
      bufferGeom.ammoInstnceIndices.length / 3,
      true
    )

    const sbConfig = volumeSoftBody.get_m_cfg()
    sbConfig.set_viterations(40)
    sbConfig.set_piterations(40)

    // Soft-soft and soft-rigid collisions
    sbConfig.set_collisions(0x11)

    // Friction
    sbConfig.set_kDF(0.1)
    // Damping
    sbConfig.set_kDP(0.01)
    // Pressure
    sbConfig.set_kPR(pressure)
    // Stiffness
    volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9)
    volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9)

    volumeSoftBody.setTotalMass(mass, false)
    ammoInstnce
      .castObject(volumeSoftBody, ammoInstnce.btCollisionObject)
      .getCollisionShape()
      .setMargin(margin)
    physicsWorld.addSoftBody(volumeSoftBody, 1, -1)
    volume.userData.physicsBody = volumeSoftBody
    // Disable deactivation
    volumeSoftBody.setActivationState(4)

    softBoides.push(volume)
  }

  const processClick = () => {
    if (clickRequest && camera) {
      raycaster.setFromCamera(mouseCoords, camera)

      // Creates a ball
      const ballMass = 3
      const ballRadius = 0.4

      const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial)
      ball.castShadow = true
      ball.receiveShadow = true
      const ballShape = new ammoInstnce.btSphereShape(ballRadius)
      ballShape.setMargin(margin)
      pos.copy(raycaster.ray.direction)
      pos.add(raycaster.ray.origin)
      quat.set(0, 0, 0, 1)
      const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat)
      ballBody.setFriction(0.5)

      pos.copy(raycaster.ray.direction)
      pos.multiplyScalar(14)
      ballBody.setLinearVelocity(new ammoInstnce.btVector3(pos.x, pos.y, pos.z))

      clickRequest = false
    }
  }

  const updatePhysics = (deltaTime: any) => {
    // Step world
    physicsWorld.stepSimulation(deltaTime, 10)

    // Update soft volumes
    for (let i = 0, il = softBoides.length; i < il; i++) {
      const volume: any = softBoides[i]
      const geometry = volume.geometry
      const softBody = volume.userData.physicsBody
      const volumePositions = geometry.attributes.position.array
      const volumeNormals = geometry.attributes.normal.array
      const association = geometry.ammoInstnceIndexAssociation
      const numVerts = association.length
      const nodes = softBody.get_m_nodes()
      for (let j = 0; j < numVerts; j++) {
        const node = nodes.at(j)
        const nodePos = node.get_m_x()
        const x = nodePos.x()
        const y = nodePos.y()
        const z = nodePos.z()
        const nodeNormal = node.get_m_n()
        const nx = nodeNormal.x()
        const ny = nodeNormal.y()
        const nz = nodeNormal.z()

        const assocVertex = association[j]

        for (let k = 0, kl = assocVertex.length; k < kl; k++) {
          let indexVertex = assocVertex[k]
          volumePositions[indexVertex] = x
          volumeNormals[indexVertex] = nx
          indexVertex++
          volumePositions[indexVertex] = y
          volumeNormals[indexVertex] = ny
          indexVertex++
          volumePositions[indexVertex] = z
          volumeNormals[indexVertex] = nz
        }
      }

      geometry.attributes.position.needsUpdate = true
      geometry.attributes.normal.needsUpdate = true
    }

    // Update rigid bodies
    for (let i = 0, il = rigidBodies.length; i < il; i++) {
      const objThree = rigidBodies[i]
      const objPhys = objThree.userData.physicsBody
      const ms = objPhys.getMotionState()
      if (ms) {
        ms.getWorldTransform(transformAux1)
        const p = transformAux1.getOrigin()
        const q = transformAux1.getRotation()
        objThree.position.set(p.x(), p.y(), p.z())
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
      }
    }
  }

  const execRender = () => {
    if (!renderer || !scene || !camera) {
      return
    }
    const deltaTime = clock.getDelta()
    updatePhysics(deltaTime)
    processClick()
    renderer.render(scene, camera)
  }

  const animate = () => {
    requestAnimationFrameHandle = requestAnimationFrame(animate)
    execRender()
    stats.update()
  }

  const initGraphics = (): void => {
    if (!container.value) {
      return
    }
    const { clientWidth, clientHeight } = container.value

    // 摄像机
    camera = new THREE.PerspectiveCamera(60, clientWidth / clientHeight, 0.2, 2000)
    camera.position.set(-7, 5, 8)

    // 场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfd1e5)

    // 渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(clientWidth, clientHeight)
    renderer.shadowMap.enabled = true
    container.value.appendChild(renderer.domElement)

    // 控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 2, 0)
    controls.update()

    // 纹理加载器
    texttureLoader = new THREE.TextureLoader()

    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // 平行光
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(-10, 10, 5)
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

    // 状态监控
    // @ts-ignore
    stats = new Stats()
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.top = '0px'
    container.value.appendChild(stats.domElement)

    // 监听窗口大小变化
    removeWindowResize = createListener({ name: 'resize', listener: onWindowResize })
  }

  const initPhysics = (): void => {
    // physics configuration
    const collisionConfiguration = new ammoInstnce.btSoftBodyRigidBodyCollisionConfiguration()
    const dispatcher = new ammoInstnce.btCollisionDispatcher(collisionConfiguration)
    const broadphase = new ammoInstnce.btDbvtBroadphase()
    const solver = new ammoInstnce.btSequentialImpulseConstraintSolver()
    const softBodySolver = new ammoInstnce.btDefaultSoftBodySolver()
    physicsWorld = new ammoInstnce.btSoftRigidDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration,
      softBodySolver
    )
    physicsWorld.setGravity(new ammoInstnce.btVector3(0, gravityConstant, 0))
    physicsWorld.getWorldInfo().set_m_gravity(new ammoInstnce.btVector3(0, gravityConstant, 0))

    transformAux1 = new ammoInstnce.btTransform()
    softBodyHelpers = new ammoInstnce.btSoftBodyHelpers()
  }

  const createObjects = (): void => {
    if (!texttureLoader) {
      return
    }
    // ground
    // 坐标
    pos.set(0, -0.5, 0)
    // 旋转
    quat.set(0, 0, 0, 1)
    // 创建刚体地板
    const ground = createParalellepiped(
      40,
      1,
      40,
      0,
      pos,
      quat,
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    // 可以产生阴影，也可以接收阴影
    ground.castShadow = true
    ground.receiveShadow = true
    // 纹理加载
    texttureLoader.load(gridPng, function (texture) {
      // 纹理填充模式
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      // 平铺时，每行平铺的数量，每列平铺的数量
      texture.repeat.set(40, 40)
      // @ts-ignore
      ground.material.map = texture
      // @ts-ignore
      ground.material.needsUpdate = true
    })

    const volumeMass = 15
    const sphereGeometry = new THREE.SphereGeometry(1.5, 40, 25)
    sphereGeometry.translate(5, 5, 0)
    createSoftVolume(sphereGeometry, volumeMass, 250)

    const boxGemoetry = new THREE.BoxGeometry(1, 1, 5, 4, 4, 20)
    boxGemoetry.translate(-2, 5, 0)
    createSoftVolume(boxGemoetry, volumeMass, 120)

    // Ramp
    // 创建刚体斜板
    pos.set(3, 1, 0)
    quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), (30 * Math.PI) / 180)
    const obstacle = createParalellepiped(
      10,
      1,
      4,
      0,
      pos,
      quat,
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    obstacle.castShadow = true
    obstacle.receiveShadow = true
    texttureLoader.load(gridPng, function (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(10, 4)
      // @ts-ignore
      obstacle.material.map = texture
      // @ts-ignore
      obstacle.material.needsUpdate = true
    })

    // 创建木盒
    pos.set(0, 8, 0)
    quat.set(0, 0, 0, 1)
    const boxSx = 6
    const boxSy = 6
    const boxSz = 6
    const box = createParalellepiped(
      boxSx,
      boxSy,
      boxSz,
      1000,
      pos,
      quat,
      new THREE.MeshPhongMaterial({ color: '#ffffff' })
    )
    texttureLoader.load(imageCrate, (texture) => {
      box.material.map = texture
      box.material.needsUpdate = true
    })
  }

  const initInput = (): void => {
    const handlerListener = (event: any) => {
      if (!clickRequest) {
        mouseCoords.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        )

        clickRequest = true
      }
    }
    removePointerdown = createListener({
      el: container.value,
      name: 'pointerdown',
      listener: handlerListener
    })
  }

  const init = (): void => {
    initGraphics()
    initPhysics()
    createObjects()
    initInput()
  }

  onMounted(async () => {
    await initammoInstnce()
    if (!ammoInstnce) {
      return
    }
    init()
    animate()
  })

  onUnmounted((): void => {
    if (requestAnimationFrameHandle) {
      cancelAnimationFrame(requestAnimationFrameHandle)
    }
    removeWindowResize()
    removePointerdown()
  })
</script>
