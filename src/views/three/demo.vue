<template>
  <div ref="container" class="absolute top-0 bottom-0 left-0 right-0" />
</template>

<script lang="ts" setup>
  import type {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Points,
    BufferGeometry,
    ShaderMaterial,
    AxesHelper
  } from 'three'
  import * as THREE from 'three'
  import { createListener } from '@/utils/listener'
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  const SEPARATION = 100

  // 渲染定时器句柄
  let requestAnimationFrameHandle = 0

  // 控制x轴波浪的长度
  const amountX = 50
  // 控制y轴波浪的长度
  const amountY = 50
  // 控制点的颜色
  const dotColor = '#1e293b'

  // 容器
  const container = ref<HTMLElement>()
  // 相机
  let camera: PerspectiveCamera | null
  // 场景
  let scene: Scene | null
  // 渲染器
  let renderer: WebGLRenderer | null
  // 点
  let particles: Points<BufferGeometry, ShaderMaterial> | null
  // 坐标系
  let axesHelper: AxesHelper | null
  // 点的位置增量
  let count = 0
  // 鼠标在轴移动的距离
  let mouseX = 0
  let mouseY = 0
  // 可视化窗口大小的一半
  let viewHalfX = 0
  let viewHalfY = 0

  // 取消监听窗口大小
  let removeWindowResize = (): void => {}
  // 取消监听鼠标移动
  let removePointerMove = (): void => {}

  // 监听鼠标移动事件
  const onPointerMove = (event: PointerEvent): void => {
    if (event.isPrimary) {
      mouseX = viewHalfX - event.clientX
      mouseY = event.clientY - viewHalfY
    }
  }

  // 监听窗口大小变化
  const onWindowResize = (): void => {
    if (!container.value || !camera || !renderer) {
      return
    }
    const { clientWidth, clientHeight } = container.value
    viewHalfX = clientWidth / 2
    viewHalfY = clientHeight / 2
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
  }

  const initThree = (): void => {
    if (!container.value) {
      return
    }
    const { clientWidth, clientHeight } = container.value
    viewHalfX = clientWidth / 2
    viewHalfY = clientHeight / 2

    // 创建相机
    camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 1, 10000)
    // 设置相机位置
    camera.position.z = 2000
    camera.position.y = 400

    // 创建场景
    scene = new THREE.Scene()

    const numParticles = amountX * amountY

    const positions = new Float32Array(numParticles * 3)
    const scales = new Float32Array(numParticles)
    let i = 0
    let j = 0
    const dx = (amountX * SEPARATION) / 2
    const dy = (amountY * SEPARATION) / 2
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        // x
        positions[i] = ix * SEPARATION - dx
        // y
        positions[i + 1] = 0
        // z
        positions[i + 2] = iy * SEPARATION - dy
        scales[j] = 1
        i += 3
        j++
      }
    }

    // 是面片、线或点几何体的有效表述。包括顶点位置，面片索引、法相量、颜色值、UV 坐标和自定义缓存属性值。使用 BufferGeometry 可以有效减少向 GPU 传输上述数据所需的开销
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    // 着色器材质，设置球的大小，颜色等
    const material = new THREE.ShaderMaterial({
      // 设置球的颜色
      uniforms: { color: { value: new THREE.Color(dotColor) } },
      // 控制球的大小
      vertexShader:
        'attribute float scale; void main() {vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_PointSize = scale * ( 300.0 / - mvPosition.z );gl_Position = projectionMatrix * mvPosition;}',
      fragmentShader:
        'uniform vec3 color;void main() {if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;gl_FragColor = vec4( color, 1.0 );}'
    })

    // 用于显示点的类
    particles = new THREE.Points(geometry, material)
    // 往场景中添加点
    scene.add(particles)

    // 坐标系
    axesHelper = new THREE.AxesHelper(3000)
    scene.add(axesHelper)

    // alpha - canvas是否包含alpha（透明度）, 默认为false
    // 渲染器的背景色默认为黑色，设置渲染器的背景为透明
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    renderer.setSize(clientWidth, clientHeight)
    container.value.appendChild(renderer.domElement)

    container.value.style.touchAction = 'none'

    // 监听鼠标移动
    removePointerMove = createListener({
      el: container.value,
      name: 'pointermove',
      listener: onPointerMove
    })
    // 开启监听窗口大小变化
    removeWindowResize = createListener({ name: 'resize', listener: onWindowResize })
  }

  // 渲染函数
  const execRender = (): void => {
    if (!camera || !scene || !particles || !renderer) {
      return
    }
    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (mouseY - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    const positions = particles.geometry.attributes.position.array
    const scales = particles.geometry.attributes.scale.array

    // 设置粒子位置和大小
    let i = 1
    let j = 0
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        // @ts-ignore
        positions[i] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) + 50
        // @ts-ignore
        scales[j] =
          (Math.sin((ix + count) * 0.3) + 1) * 10 + (Math.sin((iy + count) * 0.5) + 1) * 10
        i += 3
        j++
      }
    }

    particles.geometry.attributes.position.needsUpdate = true
    particles.geometry.attributes.scale.needsUpdate = true
    renderer.render(scene, camera)

    count += 0.1
  }

  // 执行动画
  const execAnimate = (): void => {
    requestAnimationFrameHandle = requestAnimationFrame(execAnimate)
    execRender()
  }

  // mounted 初始化
  onMounted((): void => {
    initThree()
    execAnimate()
  })

  onBeforeUnmount((): void => {
    // 取消动画
    if (requestAnimationFrameHandle) {
      cancelAnimationFrame(requestAnimationFrameHandle)
    }
    // 取消监听窗口大小变化
    removeWindowResize()
    // 取消监听鼠标移动
    removePointerMove()
  })
</script>
