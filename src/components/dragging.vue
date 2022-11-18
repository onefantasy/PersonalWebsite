<template>
  <div
    ref="draggingBoxEl"
    class="dragging-box relative"
    @mousedown="handleMousedown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    }
  })

  const emits = defineEmits(['update:list'])

  // 拖曳父级元素
  const draggingBoxEl = ref<HTMLDivElement>()
  // 原始元素半透明类名
  const opacityClassName = 'opacity-50'
  // 可拖曳元素的数组
  let draggingItems: HTMLCollection | [] = []
  // 被拖曳的元素
  let originTarget: HTMLElement | null = null
  // 被拖曳的元素索引
  let originTargetIndex = 0
  // 展示的拖曳元素
  let cloneTarget: HTMLElement | null = null
  // 克隆元素的上一次位置记录
  let cloneTargetTop = 0
  let cloneTargetLeft = 0
  // 鼠标上一次记录时的值
  let mouseLastX = 0
  let mouseLastY = 0
  // 鼠标在被拖曳元素内部的
  let mouseXInTarget = 0
  let mouseYInTarget = 0

  /** 鼠标按下事件 */
  function handleMousedown(event: MouseEvent): void | boolean {
    let { target } = event
    if (!draggingBoxEl.value || cloneTarget || draggingBoxEl.value === target) {
      event.stopPropagation()
      event.preventDefault()
      return false
    }
    mouseLastX = event.x
    mouseLastY = event.y
    mouseXInTarget = event.offsetX
    mouseYInTarget = event.offsetY
    let isCanMove = false

    // 查找可以拖曳的元素
    while (!isCanMove && target) {
      const parentNode = (target as HTMLElement).parentNode
      isCanMove = parentNode === draggingBoxEl.value
      if (isCanMove) {
        break
      }
      target = parentNode
      // 计算鼠标在拖曳内部的坐标
      if (parentNode instanceof HTMLElement && parentNode.parentNode !== draggingBoxEl.value) {
        mouseXInTarget += parentNode.offsetLeft
        mouseYInTarget += parentNode.offsetTop
      }
    }

    // 数据类型检测
    if (!isCanMove || !target || !(target instanceof HTMLElement)) {
      return false
    }

    // 计算被拖曳元素的索引
    draggingItems = draggingBoxEl.value.children
    for (let i = 0, len = draggingItems.length; i < len; i++) {
      if (draggingItems[i] === target) {
        originTargetIndex = i
        break
      }
    }

    // 记载被拖曳的元素和克隆的元素
    originTarget = target
    cloneTarget = target.cloneNode(true) as HTMLElement
    if (cloneTarget) {
      // 克隆元素处理
      const {
        offsetWidth: targetWidth,
        offsetHeight: targetHeight,
        offsetLeft: targetLeft,
        offsetTop: targetTop
      } = target
      const { marginTop, marginLeft } = getComputedStyle(target)

      cloneTargetTop = targetTop - parseInt(marginTop)
      cloneTargetLeft = targetLeft - parseInt(marginLeft)

      cloneTarget.classList.add(...['absolute', opacityClassName])
      cloneTarget.style.top = cloneTargetTop + 'px'
      cloneTarget.style.left = cloneTargetLeft + 'px'
      cloneTarget.style.height = targetHeight + 'px'
      cloneTarget.style.width = targetWidth + 'px'

      // 原始元素变为半透明
      target.classList.add(opacityClassName)

      event.stopPropagation()
      event.preventDefault()
      return false
    }
  }

  /** 鼠标松开事件 */
  function handleMouseUp(event: MouseEvent): void | boolean {
    if (!cloneTarget || !originTarget || props.list.length <= 0) {
      return false
    }

    originTarget.classList.remove(opacityClassName)
    originTarget = null
    // 鼠标松开时，克隆元素不一定挂载在父级元素上，需要先进行判断
    cloneTarget.parentNode && cloneTarget.parentNode.removeChild(cloneTarget)
    cloneTarget = null

    /** 拖曳放下后的数据处理 */
    // 鼠标在拖曳区域内的坐标
    const mouseY = cloneTargetTop + mouseYInTarget
    const mouseX = cloneTargetLeft + mouseXInTarget
    let movedList = [...props.list]
    // 查询鼠标在可拖曳元素中的位置对应的数据索引
    for (let i = 0, len = draggingItems.length; i < len; i++) {
      const item = draggingItems[i] as HTMLElement
      const { offsetHeight, offsetTop, offsetWidth, offsetLeft } = item
      // 下一个元素
      const nextItem = draggingItems[i + 1] as HTMLElement
      const {
        offsetTop: nextOffsetTop,
        offsetLeft: nextOffsetLeft,
        offsetWidth: nextOffsetWidth
      } = nextItem || {}
      // 不符合条件，直接检测下一个元素
      if (mouseY > offsetHeight + offsetTop || mouseX < offsetLeft) {
        continue
      }

      /** 按顺序判断各种条件，进行处理 */
      // 不存在下一个元素，直接把元素放在最后
      if (!nextItem) {
        const target = movedList[originTargetIndex]
        movedList = exchangeArrayItem(movedList, i + 1, originTargetIndex)
        movedList.push(target)
        break
      }

      // 当前元素和下一个元素不在同一行上
      if (mouseY <= nextOffsetTop && nextOffsetTop > offsetTop) {
        movedList = exchangeArrayItem(
          movedList,
          originTargetIndex > i ? i : i + 1,
          originTargetIndex
        )
        break
      }

      // 鼠标在当前元素的前半部分
      if (mouseX <= offsetLeft + offsetWidth / 2) {
        movedList = exchangeArrayItem(movedList, i, originTargetIndex)
        break
      }

      // 鼠标在当前元素的后半部分，下一个元素的前半部分之间
      if (mouseX < nextOffsetLeft + nextOffsetWidth / 2) {
        movedList = exchangeArrayItem(movedList, i + 1, originTargetIndex)
        break
      }
    }

    // let startIndex = 0
    // let endIndex = movedList.length - 1
    // let middleIndex = Math.floor(endIndex / 2)
    // while (middleIndex >= startIndex && middleIndex <= endIndex && startIndex < endIndex) {
    //   const item = draggingItems[middleIndex] as HTMLElement
    //   const { offsetHeight, offsetTop, offsetWidth, offsetLeft } = item

    //   // y坐标判断 符合情况处理
    //   if (mouseY <= offsetHeight + offsetTop && mouseY >= offsetTop) {
    //     // x坐标判断 符合情况处理
    //     if (mouseX >= offsetLeft) {
    //       if (mouseX <= offsetLeft + offsetWidth / 2) {
    //         movedList = exchangeArrayItem(movedList, middleIndex, originTargetIndex)
    //         break
    //       }
    //       const nextItem = draggingItems[middleIndex + 1] as HTMLElement
    //       if (!nextItem) {
    //         const target = movedList[originTargetIndex]
    //         movedList = exchangeArrayItem(movedList, middleIndex + 1, originTargetIndex)
    //         movedList.push(target)
    //         break
    //       }
    //       const {
    //         offsetTop: nextOffsetTop,
    //         offsetLeft: nextOffsetLeft,
    //         offsetWidth: nextOffsetWidth
    //       } = nextItem
    //       if (mouseY < nextOffsetTop || mouseX < nextOffsetLeft + nextOffsetWidth / 2) {
    //         movedList = exchangeArrayItem(movedList, middleIndex + 1, originTargetIndex)
    //         break
    //       }
    //     }
    //     // x坐标判断 不符合情况处理
    //     endIndex = middleIndex - 1
    //     middleIndex = Math.floor((startIndex + endIndex) / 2)
    //     if (startIndex === endIndex) {
    //       movedList = exchangeArrayItem(movedList, startIndex, originTargetIndex)
    //       break
    //     }
    //     continue
    //   }

    //   // y坐标判断 不符合情况处理
    //   startIndex = middleIndex + 1
    //   middleIndex = Math.floor((startIndex + endIndex) / 2)
    //   if (startIndex === endIndex) {
    //     movedList = exchangeArrayItem(movedList, startIndex, originTargetIndex)
    //     break
    //   }
    // }

    // 列表数据更新
    emits('update:list', movedList)
  }

  /** 鼠标移动处理 */
  function handleMouseMove(event: MouseEvent): void | boolean {
    if (!cloneTarget || !draggingBoxEl.value) {
      return false
    }
    const { x, y } = event

    cloneTarget.parentNode || draggingBoxEl.value.appendChild(cloneTarget)

    cloneTargetTop += y - mouseLastY
    cloneTargetLeft += x - mouseLastX
    mouseLastX = x
    mouseLastY = y

    cloneTarget.style.top = cloneTargetTop + 'px'
    cloneTarget.style.left = cloneTargetLeft + 'px'
  }

  /**
   * 交换数组中指定位置的两个元素
   * @param { Array<any> } originArray 需要交换数据的数组
   * @param { number } wIndex 插入的位置索引
   * @param { number } iIndex 插入的元素索引
   * @returns { Array<any> }
   */
  function exchangeArrayItem(originArray: Array<any>, wIndex: number, iIndex: number): any[] {
    return originArray.reduce((list, item, index) => {
      index === wIndex && list.push(...[originArray[iIndex]])
      const target = index === iIndex ? '' : item
      target && list.push(target)
      return list
    }, [])
  }
</script>

<style lang="scss" scoped>
  .dragging-box {
    :deep(> *) {
      cursor: grab;
    }
  }
</style>
