<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :mask-closable="true"
    :show-icon="false"
    class="w-4/5 max-w-2xl sm:w-3/4 md:w-2/3 lg:w-1/2 icons-edit-dialog"
    @afterEnter="handleAfterEnter"
    @afterLeave="handleAfterLeave"
  >
    <template #header>
      <n-icon size="25px" class="mr-1">
        <SvgIcon icon-class="task-view" class="align-baseline" />
      </n-icon>
      <span> {{ $t('page.iconPreview') }} </span>
    </template>

    <div class="flex flex-col sm:flex-row">
      <!-- icon -->
      <div
        ref="iconWindow"
        class="w-full mb-2 transition-all bg-zinc-50 black-white-lattice"
        :style="`height:${iconWindowHeight}px;`"
      >
        <div
          class="flex items-center justify-center w-full h-full"
          :style="`background:${backgroundColor};border-radius:${radius}%;`"
        >
          <n-icon :size="`${iconSize}px`" :color="iconColor" class="flex transition-all">
            <SvgIcon :icon-class="iconName" />
          </n-icon>
        </div>
      </div>

      <!-- operation -->
      <div class="flex flex-col justify-around w-full ml-0 sm:ml-3">
        <div class="flex flex-row mb-2 sm:flex-col">
          <span class="font-mono text-base font-bold leading-8 w-36">
            {{ $t('page.iconEditIcon') }}
          </span>
          <n-color-picker v-model:value="iconColor" />
        </div>
        <div class="flex flex-row mb-2 sm:flex-col">
          <span class="font-mono text-base font-bold leading-8 w-36">
            {{ $t('page.iconEditBackground') }}
          </span>
          <n-color-picker v-model:value="backgroundColor" />
        </div>
        <div class="flex flex-row sm:flex-col">
          <span class="font-mono text-base font-bold leading-8 w-36">
            {{ $t('page.iconEditRadius') }}
          </span>
          <n-slider
            v-model:value="radius"
            :min="0"
            :max="100"
            :step="1"
            :format-tooltip="formatRadius"
          />
        </div>
        <div class="flex flex-col justify-around sm:flex-row">
          <n-button
            id="copyName"
            type="primary"
            class="mb-2"
            data-clipboard-action="copy"
            :data-clipboard-text="iconName"
            @click.stop="clipboardCopy('#copyName', '.icons-edit-dialog')"
          >
            <template #icon>
              <n-icon>
                <SvgIcon icon-class="copy" />
              </n-icon>
            </template>
            Copy Name
          </n-button>
          <n-button
            id="copyStyle"
            type="warning"
            class="mb-2"
            data-clipboard-action="copy"
            :data-clipboard-text="copyStyle"
            @click.stop="clipboardCopy('#copyStyle', '.icons-edit-dialog')"
          >
            <template #icon>
              <n-icon>
                <SvgIcon icon-class="style" />
              </n-icon>
            </template>
            Copy Style
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { clipboardCopy } from '@/utils/clipboard'

  const showModal = ref<boolean>(false)
  const iconName = ref<string>('icons')
  const iconWindow = ref<HTMLDivElement | null>()
  const iconWindowHeight = ref<number>(0)

  const backgroundColor = ref<string>('#f5f5f5')
  const radius = ref<number>(0)
  const iconColor = ref<string>('#3f3f46')

  const iconSize = computed((): number => (iconWindowHeight.value / 3) * 2)
  const copyStyle = computed((): string => {
    let style = ''
    backgroundColor.value && (style += `background:${backgroundColor.value};`)
    iconColor.value && (style += `color:${iconColor.value};`)
    radius.value && (style += `border-radius:${radius.value}%;`)
    return style
  })

  /** 显示弹窗 */
  function show(value: string): void {
    if (!value) {
      return
    }
    iconName.value = value
    showModal.value = true
  }

  /** 初始化 展示图标 窗口大小 */
  function initIconWindowHeight(): void {
    if (!iconWindow.value) {
      return
    }
    const { clientWidth } = iconWindow.value
    iconWindowHeight.value = clientWidth
  }

  /** 窗口出现回调, 初始化场景信息 */
  function handleAfterEnter(): void {
    initIconWindowHeight()
  }

  /** 窗口关闭回调, 重置场景信息 */
  function handleAfterLeave(): void {
    iconWindowHeight.value = 0
    backgroundColor.value = '#f5f5f5'
    iconColor.value = '#3f3f46'
    radius.value = 0
  }

  /** 窗口大小改变 */
  function resize(): void {
    if (!showModal.value) {
      return
    }
    initIconWindowHeight()
  }

  /** 格式化 format 曲率 tooltip */
  function formatRadius(value: number): string {
    return `${value}%`
  }

  defineExpose({ show, resize })
</script>

<style lang="scss" scoped>
  .icons-edit-dialog {
    .black-white-lattice {
      background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.4) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.4) 75%,
          rgba(0, 0, 0, 0.4) 100%
        ),
        linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.4) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.4) 75%,
          rgba(0, 0, 0, 0.4) 100%
        );
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
  }
</style>
