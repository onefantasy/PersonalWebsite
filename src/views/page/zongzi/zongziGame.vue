<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 font-mono bg-orange-300 select-none"
    @click="inputAutoFocus"
  >
    <!-- 顶边栏 -->
    <div
      class="absolute top-0 left-0 right-0 flex justify-around h-5 font-black leading-10 text-amber-800"
    >
      <div> {{ $t('page.zongziRemainingTime') }}: {{ showTime }}'' </div>
      <div> {{ $t('page.zongziCurrentScore') }}: {{ score }} </div>
      <div> {{ $t('page.zongziCurrentWeight') }}: {{ basketWeight }} </div>
    </div>

    <!-- 左边大炮 -->
    <div class="absolute top-[150px] bottom-0 left-0 w-5 bg-amber-800"></div>
    <div class="absolute top-[132px] h-5 w-14 left-0 bg-amber-800 rounded-sm"></div>
    <n-icon class="absolute top-[86px] left-0" size="50px">
      <SvgIcon icon-class="cannon" />
    </n-icon>

    <!-- 右边大炮 -->
    <div class="absolute top-[150px] bottom-0 w-5 right-0 bg-amber-800"></div>
    <div class="absolute top-[132px] h-5 w-14 right-0 bg-amber-800"></div>
    <n-icon class="absolute top-[86px] right-0" style="transform: rotateY(180deg)" size="50px">
      <SvgIcon icon-class="cannon" />
    </n-icon>

    <!-- 底部 -->
    <div ref="floorEl" class="absolute bottom-0 left-0 right-0 h-5 bg-amber-800"></div>
    <n-icon
      ref="basketEl"
      class="absolute text-green-600"
      :style="`top: calc(100% - 63px);left: ${basketLeft}px;`"
      size="50px"
    >
      <SvgIcon icon-class="basket" />
    </n-icon>

    <!-- 输入框: 不可见 -->
    <input ref="actionInputEl" class="absolute top-0 left-0 w-0 h-0 -z-10" />

    <!-- 掉落物体 -->
    <template v-for="(item, index) in droppedObjectList" :key="'droppedObject' + item.id">
      <DroppedObject
        v-if="item"
        :ref="(el: any) => { el && (droppedObjectRefList[index] = el) }"
        :code-id="item.id"
        :object-name="item.objectName"
        :start-position="item.startPosition"
        :end-position="item.endPosition"
      />
    </template>

    <!-- 开始界面 -->
    <div
      class="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-white transition-all bg-slate-700/75"
      :class="{ 'opacity-0 z-[-1]': isGame }"
    >
      <div class="mb-2 text-xl font-extrabold">{{ $t('page.zongziTitle') }}</div>
      <p
        class="relative w-1/2 min-w-full p-6 text-base text-center text-black underline whitespace-pre-line transition-all bg-white underline-offset-4 md:text-left md:min-w-0 rounded-xl decoration-sky-500"
      >
        {{ $t('page.zongziTip') }}
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
      <div class="flex items-center justify-around w-1/2 h-10 mt-2 text-base leading-10 md:min-w-0">
        <div class="flex">
          <span class="mr-2">
            {{ $t('page.zongziCurrentScore') }}
          </span>
          <span>{{ score }}</span>
        </div>
        <div class="flex">
          <span class="mr-2">
            {{ $t('page.zongziCurrentWeight') }}
          </span>
          <span>{{ basketWeight }}</span>
        </div>
      </div>
      <n-button color="#6366f1" size="large" class="mt-2 mr-2" @click="startGame()">
        <template #icon>
          <n-icon class="text-white">
            <SvgIcon icon-class="dot" />
          </n-icon>
        </template>
        {{ $t('page.zongziStart') }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { droppedObjectType, droppedObjectRefType } from './components/types'

  import DroppedObject from './components/droppedObject.vue'

  import { createListener } from '@/utils/listener'
  import { onMounted, onBeforeUnmount, ref, reactive, nextTick, computed } from 'vue'

  const floorEl = ref<HTMLElement>()
  const actionInputEl = ref<HTMLElement>()
  const basketEl = ref<droppedObjectRefType>()

  // 计时器
  const timer = ref<number>(0)
  let lastTime = 0
  const showTime = computed((): number => Math.ceil(timer.value / 1000))

  // 是否正在游戏中
  const isGame = ref<boolean>(false)

  // basket info
  const basketLeft = ref<number>(100)
  const basketMinLeft = 20
  let basketTop = 10000
  let basketMaxLeft = 10000
  let basketHalfMaxLeft = 5000
  const basketWeight = ref<number>(0)

  // basket 判定右侧边界
  let basketLimitRight = basketLeft.value + 30

  // basket speed
  let basketSpeed = 20
  const basketMinSpeed = 10
  // 加速度
  const acceleration = -0.1

  // 得分
  const score = ref<number>(0)

  // 抛落物初始位置
  const startPosition = {
    left: { top: 82, left: 33 },
    right: { top: 82, left: 33 }
  }

  // 抛落物列表
  const droppedObjectList = reactive<Array<droppedObjectType>>([])
  // 抛落物元素列表
  const droppedObjectRefList = reactive<Array<droppedObjectRefType>>([])
  // 抛落物上次创建时间
  let droppedObjectLastCreateTime = 0
  const droppedObjectCreateIntervalTime = 500

  // 抛落物信息
  const droppedObjectInfo = {
    zongzi: { point: 1, weight: 1 },
    watermelon: { point: 0, weight: 10 }
  }

  let animationHandler = 0
  let removeWindowResize = (): void => {}
  let removeKeyPress = (): void => {}

  /** 监听键盘事件 */
  function mountedKeyPress(): void {
    removeKeyPress()

    removeKeyPress = createListener({
      el: actionInputEl.value,
      name: 'keydown',
      listener: (event: KeyboardEvent): void => {
        const directionMap = { KeyA: -1, KeyD: 1 }
        const direction = directionMap[event.code] || 0
        let newLeft = basketLeft.value + direction * basketSpeed
        newLeft < basketMinLeft && (newLeft = basketMinLeft)
        newLeft > basketMaxLeft && (newLeft = basketMaxLeft)
        basketLeft.value = newLeft

        basketLimitRight = basketLeft.value + 30
      }
    })
  }

  /** 从场景中获取所需信息 */
  function getSceneInfo() {
    nextTick((): void => {
      if (!floorEl.value) {
        // 设置移动的最大距离
        basketMaxLeft = 10000
      } else {
        // 设置移动的最大距离
        basketMaxLeft = floorEl.value.clientWidth - 70
        basketLeft.value > basketMaxLeft && (basketLeft.value = basketMaxLeft)

        // 设置右侧大炮炮口位置
        startPosition.right.left = floorEl.value.clientWidth - 58
      }

      if (!basketEl.value) {
        basketTop = 10000
      } else {
        // 获取basket的top值
        basketTop = (basketEl.value.$el as HTMLElement).offsetTop
      }
      // 设置最大可移动距离的一半
      basketHalfMaxLeft = basketMaxLeft / 2
    })
  }

  /** 监听窗口大小变化 */
  function mountedWindowResize(): void {
    removeWindowResize()
    removeWindowResize = createListener({
      name: 'resize',
      listener: () => {
        getSceneInfo()
      }
    })
  }

  /** input 获取焦点 */
  function inputAutoFocus(): boolean {
    nextTick((): void => {
      actionInputEl.value && actionInputEl.value.focus()
    })
    return false
  }

  /**
   * 添加抛落物
   * @param { number } id 将时间戳设置为id
   * */
  function addDroppedObject(id: number): void {
    const direction = Math.random() < 0.5 ? 'left' : 'right'
    const objectName = Math.random() < 0.5 ? 'watermelon' : 'zongzi'
    droppedObjectList.push({
      objectName: objectName,
      startPosition: startPosition[direction],
      endPosition: {
        top: basketTop + 20,
        left:
          direction === 'left'
            ? basketHalfMaxLeft * Math.random() + basketHalfMaxLeft
            : basketHalfMaxLeft * Math.random()
      },
      id
    })
  }

  /** 执行动画 */
  function execAnimation(): void {
    const time = Date.now()
    let allWeight = 0

    // 时间处理
    const isEnd = handleTimer(time)

    // 位置判定及进入basket判定
    for (let i = 0, len = droppedObjectRefList.length; i < len; i++) {
      const target = droppedObjectRefList[i]
      let isIntoBasket = false
      if (target.isShow) {
        const position = target.computeNewPosition && target.computeNewPosition()
        isIntoBasket = checkIntoBasket(position)
      }
      if (isIntoBasket) {
        target.destroyedDroppedObject && target.destroyedDroppedObject()
        const info: { point: number; weight: number } = droppedObjectInfo[target.objectName] || {
          point: 0,
          weight: 0
        }
        basketWeight.value += info.weight
        score.value += info.point
        allWeight += info.weight
      }
    }

    // 速度调整
    if (basketSpeed > basketMinSpeed && allWeight > 0) {
      let newSpeed = basketSpeed + allWeight * acceleration
      newSpeed < basketMinSpeed && (newSpeed = basketMinSpeed)
      basketSpeed = newSpeed
    }

    // 判断是否添加抛落物
    if (time - droppedObjectLastCreateTime >= droppedObjectCreateIntervalTime) {
      droppedObjectLastCreateTime = time
      addDroppedObject(time)
    }
    isEnd || (animationHandler = requestAnimationFrame(execAnimation))
  }

  /** 取消动画 */
  function cancelAnimation(): void {
    cancelAnimationFrame(animationHandler)
  }

  /**
   * 是否进入basket判定
   * @param { Object } position 抛落物坐标
   * @returns { boolean } 是否进入basket
   */
  function checkIntoBasket(position: { top: number; left: number }): boolean {
    const { top, left } = position
    return top >= basketTop && left > basketLeft.value && left < basketLimitRight
  }

  /** 开启计时器 */
  function openTimer() {
    lastTime = Date.now()
    timer.value = 60 * 1000
  }

  /**
   * 计时处理
   * @param { number } currentTime 当前时间
   * @returns { boolean } 游戏时间是否为零
   * */
  function handleTimer(currentTime: number): boolean {
    timer.value = timer.value - (currentTime - lastTime)
    lastTime = currentTime
    timer.value <= 0 && endGame()
    return timer.value <= 0
  }

  /** 开始游戏 */
  function startGame(): void {
    isGame.value = true
    droppedObjectList.splice(0)
    basketLeft.value = 100
    mountedKeyPress()
    inputAutoFocus()
    openTimer()
    setTimeout((): void => {
      execAnimation()
    }, 200)
  }

  /** 结束游戏 */
  function endGame(): void {
    isGame.value = false
    removeKeyPress()
    cancelAnimation()
  }

  onMounted((): void => {
    getSceneInfo()
    mountedWindowResize()
  })

  onBeforeUnmount((): void => {
    removeWindowResize()
    removeKeyPress()
    cancelAnimation()
  })
</script>
