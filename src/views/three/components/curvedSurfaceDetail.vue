<template>
  <div
    ref="container"
    class="absolute top-0 bottom-0 left-0 right-0 curved-surface-detail"
    :class="[
      isShow ? 'block' : 'hidden',
      isAnimate ? 'pointer-events-auto' : 'pointer-events-none'
    ]"
    @click.stop="close"
  >
    <div
      class="absolute overflow-hidden transition-all duration-1000 origin-top-left rounded-md"
      :class="{ 'curved-surface-detail-content': isAnimate }"
      :style="`width:${position.width}px;height:${position.height}px;top:${position.top}px;left:${position.left}px;transform-origin: center center 0%;`"
      @click.stop="() => {}"
    >
      <!-- Part A -->
      <img
        :src="imgUrl"
        class="absolute top-0 left-0 object-cover w-full h-full transition-all duration-1000"
        :class="[isAnimate ? 'opacity-0 z-0' : 'opacity-1']"
      />
      <!-- Part B -->
      <div
        class="absolute top-0 bottom-0 left-0 right-0 flex transition-all duration-1000"
        :class="[isAnimate ? 'opacity-1 z-[1]' : 'opacity-0']"
      >
        <!-- image -->
        <div class="w-1/2 h-full p-5 bg-zinc-100">
          <n-image :src="imgUrl" object-fit="contain" class="w-full h-full bg-white rounded" />
        </div>
        <!-- info -->
        <div class="flex flex-col w-1/2 h-full p-5 pt-2 font-mono bg-zinc-800 text-slate-50">
          <div class="w-full h-6 leading-6">
            <span
              class="float-right w-6 h-6 text-center cursor-pointer rounded-xl bg-zinc-600"
              @click.stop="close"
            >
              X
            </span>
          </div>
          <n-scrollbar class="flex-1">
            <p class="whitespace-pre-line">
              {{ $t('three.curvedSurfaceInfo') }}
            </p>
          </n-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, defineEmits, nextTick } from 'vue'
  import { useAppStore } from '@/store/modules/app'
  import { createListener } from '@/utils/listener'

  const container = ref<HTMLElement | null>()
  const emits = defineEmits(['closed'])

  const isShow = ref<boolean>(false)
  const isAnimate = ref<boolean>(false)
  const appStore = useAppStore()

  const imgUrl = ref<string>('')
  const position = reactive<{ width: number; height: number; top: number; left: number }>({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  })

  let target: HTMLImageElement | null = null
  let closeTimer = 0
  let removeDoucmentKeydown = () => {}

  /**
   * 展示详情
   * @param { HTMLElement } targetNode 展示为大图的元素
   */
  function show(targetNode: HTMLImageElement): boolean {
    checkBeforeShow()
    if (!container.value) {
      return false
    }
    nextTick(() => {
      imgUrl.value = targetNode.src
      target = targetNode
      const targetPosition = targetNode.getBoundingClientRect()

      position.width = targetPosition.width
      position.height = targetPosition.height
      position.top = targetPosition.top - appStore.headerHeight
      position.left =
        targetPosition.left + (appStore.getSidebarOccupancy ? -appStore.siderWidth : 0)

      targetNode.style.opacity = '0'
      isShow.value = true

      removeDoucmentKeydown = createListener({ name: 'keydown', listener: handleKeyDown })

      setTimeout(() => {
        isAnimate.value = true
      }, 50)
    })
    return true
  }

  /** 监听键盘按下, 如果是esc, 则退出全屏 */
  function handleKeyDown(event: KeyboardEvent) {
    event.key === 'Escape' && close()
  }

  /** 展示之前的检查，确认上一个元素是否关闭完毕 */
  function checkBeforeShow() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = 0
    }
    isShow.value = false
    if (target) {
      target.style.opacity = '1'
      target = null
    }
    removeDoucmentKeydown()
  }

  /** 点击内容以外的区域，关闭 */
  function close(): void {
    isAnimate.value = false
    closeTimer && clearTimeout(closeTimer)
    removeDoucmentKeydown()
    closeTimer = setTimeout((): void => {
      isShow.value = false
      closeTimer = 0
      if (target) {
        target.style.opacity = '1'
        target = null
      }
      emits('closed')
    }, 990) as unknown as number
  }

  // 暴露
  defineExpose({ show, close })
</script>

<style lang="scss" scoped>
  .curved-surface-detail {
    .curved-surface-detail-content {
      width: 66% !important;
      height: 50% !important;
      top: 50% !important;
      left: 50% !important;
      border-radius: 16px;
      transform: rotateY(360deg) translate(-50%, -50%);
    }
  }
</style>
