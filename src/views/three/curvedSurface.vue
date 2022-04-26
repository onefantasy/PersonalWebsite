<template>
  <div
    v-loading:[{opactiyHalf:true}]="isLoading"
    class="absolute top-0 bottom-0 left-0 right-0 flex flex-col bg-slate-600"
  >
    <div
      ref="container"
      class="relative flex-1 w-full curved-surface-container"
      @click="handleContainerClick"
    />

    <div
      class="flex items-center justify-around w-3/4 h-12 px-4 mx-auto mb-3 bg-slate-200/50 rounded-3xl"
    >
      <div class="flex items-center w-2/5 mr-3">
        <n-icon class="mr-1.5 -mt-1" size="30px" color="#475569">
          <SvgIcon icon-class="speed" />
        </n-icon>
        <n-slider
          v-model:value="autoPlaySpeed"
          :step="1"
          :min="-15"
          :max="15"
          @update:value="handleSpeedChange"
        />
      </div>

      <div class="flex items-center w-2/5">
        <n-icon class="mr-1.5 -mt-1" size="30px" color="#475569">
          <SvgIcon icon-class="slide-text" />
        </n-icon>
        <n-slider
          v-model:value="colIndex"
          :step="1"
          :min="0"
          :max="3"
          :format-tooltip="getFormatColTooltip"
          @update:value="handleColIndexChange"
        />
      </div>
    </div>

    <CurvedSurfaceDetail ref="curvedSurfaceDetail" @closed="handleDetailClosed" />
  </div>
</template>

<script setup lang="ts">
  import type { AxiosPromise } from 'axios'
  import type { DefineComponent } from 'vue'

  import CurvedSurfaceDetail from './components/curvedSurfaceDetail.vue'

  import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
  import { apiGetCurvedSurfaceList } from '@/api/three/three'
  import { threeHandlerClass } from './components/curvedSurfaceThree'
  import { useI18n } from 'vue-i18n'
  import { useMessage } from 'naive-ui'
  import { createListener } from '@/utils/listener'

  const container = ref<HTMLElement | null>()
  const curvedSurfaceDetail = ref<DefineComponent | null>()

  const { t } = useI18n()
  const message = useMessage()

  const isLoading = ref<boolean>(false)

  // auto play
  const autoPlaySpeed = ref<number>(0)
  let autoPlayTimer = 0

  // 屏幕信息
  let containerWidth = 0
  let containerHeight = 0
  let removeWindowResize = () => {}
  let windowResizeTimer = 0

  // 列表计算信息
  // 列数
  const colNumList = [8, 12, 16, 20]
  const colIndex = ref<number>(1)
  let colNum = 12
  // 行数
  let rowNum = 0
  // 元素宽度，每个元素宽高相等
  let itemWidth = 0
  // 元素总数量
  let allItemNum = 0

  // three 处理者
  let threeHandler: threeHandlerClass | null = null

  // 获取屏幕信息信息并计算相关数据
  function setContainerInfo(): Promise<void> {
    if (!container.value) {
      return Promise.reject('set container info error !')
    }
    const { clientWidth, clientHeight } = container.value
    containerWidth = clientWidth
    containerHeight = clientHeight
    if (clientWidth === 0 || clientHeight === 0) {
      return Promise.reject('width or height is 0 !')
    }
    // 获取列数
    colNum = colNumList[colIndex.value]
    // 计算每个元素的宽度
    itemWidth = clientWidth / colNum
    // 计算行数
    rowNum = Math.floor(clientHeight / itemWidth)
    allItemNum = colNum * rowNum
    return Promise.resolve()
  }

  function getDataList(): AxiosPromise<any> {
    return apiGetCurvedSurfaceList({ pageSize: allItemNum })
  }

  // 初始化
  function init(): void {
    setContainerInfo()
      .then(() => {
        const taskList: AxiosPromise<any>[] = []
        for (let i = 0; i < 5; i++) {
          taskList.push(getDataList())
        }
        isLoading.value = true
        return Promise.all(taskList)
      })
      .then((res) => {
        if (!container.value) {
          return Promise.reject('Cannot get container element !')
        }
        threeHandler = new threeHandlerClass()
        const list = res.map((item) => {
          return (item.data && item.data.list) || []
        })
        threeHandler.setInfo(
          container.value,
          containerWidth,
          containerHeight,
          colNum,
          rowNum,
          allItemNum,
          itemWidth,
          list
        )
        threeHandler.init()
        threeHandler.createListView()
        threeHandler.execAnimate()
        threeHandler.mountedEvent()
        return Promise.resolve()
      })
      .then(() => {
        setTimeout(() => {
          threeHandler && threeHandler.setAutoPlaySpeed(autoPlaySpeed.value)
        }, 1000)
      })
      .catch((err) => {
        message.warning(err, { closable: true, keepAliveOnHover: true })
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  /**
   * 自动播放速度更改
   * @param { number } value 新的速度值
   */
  function handleSpeedChange(value: number): void {
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer)
    }
    autoPlayTimer = setTimeout(() => {
      threeHandler && threeHandler.setAutoPlaySpeed(value)
      autoPlayTimer = 0
    }, 500) as unknown as number
  }

  /** 更改列数 */
  function handleColIndexChange(value: number): void {
    colIndex.value = value
    resetPage()
  }

  /** 重置页面 */
  function resetPage(): void {
    threeHandler && threeHandler.cancelEvent()
    curvedSurfaceDetail.value && curvedSurfaceDetail.value.close()
    container.value && (container.value.innerHTML = '')
    nextTick((): void => {
      init()
    })
  }

  /** 格式化列数显示表格 */
  function getFormatColTooltip(value: number): string {
    return colNumList[value] + ' ' + t('three.curvedsurfaceUnit')
  }

  /** 窗口大小变化处理 */
  function onWindowResize(): void {
    if (windowResizeTimer) {
      clearTimeout(windowResizeTimer)
    }
    windowResizeTimer = setTimeout(() => {
      windowResizeTimer = 0
      resetPage()
    }, 500) as unknown as number
  }

  /** 点击列表元素 打开详情 */
  function handleContainerClick(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    const target = event.target as unknown as HTMLImageElement
    if (target && target.dataset.isimg === 'true' && curvedSurfaceDetail.value) {
      curvedSurfaceDetail.value.show(target)
      threeHandler && threeHandler.setAutoPlaySpeed(0)
    }
  }

  /** 关闭详情 */
  function handleDetailClosed(): void {
    threeHandler && threeHandler.setAutoPlaySpeed(autoPlaySpeed.value)
  }

  onMounted((): void => {
    removeWindowResize = createListener({ name: 'resize', listener: onWindowResize })
    // 在nextTick获取渲染区域信息
    nextTick((): void => init())
  })

  onBeforeUnmount((): void => {
    removeWindowResize()
    threeHandler && threeHandler.cancelEvent()
  })
</script>

<style lang="scss">
  .curved-surface-container {
    > div {
      overflow: visible !important;
    }
  }
</style>
