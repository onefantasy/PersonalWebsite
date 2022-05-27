<template>
  <n-icon
    class="absolute"
    :style="`top: ${top}px;left: ${left}px;`"
    size="25px"
    :class="{ hidden: !isShow }"
  >
    <SvgIcon :icon-class="objectName" />
  </n-icon>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'

  const top = ref<number>(82)
  const left = ref<number>(33)

  const isShow = ref<boolean>(true)

  // 抛物线公式系数
  const a = 0.001
  let b = 0

  // 步数
  let stepNum = 500

  // 步长
  let stepWidth = 10

  const props = defineProps({
    objectName: { type: String, default: 'game' },
    startPosition: {
      type: Object,
      default() {
        return {
          top: 82,
          left: 33
        }
      }
    },
    endPosition: {
      type: Object,
      default() {
        return {
          top: 82,
          left: 33
        }
      }
    },
    codeId: {
      type: Number,
      default: 0
    }
  })

  /** 获取新的坐标 */
  function computeNewPosition(): { top: number; left: number } {
    const position = { top: top.value, left: left.value }
    if (stepNum === 0) {
      destroyedDroppedObject()
      return position
    }
    stepNum--
    left.value += stepWidth
    const x = left.value - props.startPosition.left
    top.value = props.startPosition.top + a * x * x + b * x
    return position
  }

  /** 计算抛物线公式相关信息 */
  function computeInfo(startTop: number, startLeft: number, endTop: number, endLeft: number): void {
    // 计算系数b
    const relativeLeft = endLeft - startLeft
    b = (endTop - startTop - a * relativeLeft * relativeLeft) / relativeLeft

    // 计算步长
    stepWidth = relativeLeft / stepNum
  }

  // 销毁抛落物
  function destroyedDroppedObject(): void {
    isShow.value = false
  }

  onMounted((): void => {
    top.value = props.startPosition.top
    left.value = props.startPosition.left
    isShow.value = true

    computeInfo(top.value, left.value, props.endPosition.top, props.endPosition.left)
  })

  defineExpose({
    computeNewPosition,
    isShow: isShow,
    destroyedDroppedObject,
    objectName: props.objectName
  })
</script>
