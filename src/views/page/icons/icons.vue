<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col font-serif icons-page">
    <!-- input -->
    <div class="flex items-center justify-center h-12 shadow-md">
      <div class="flex w-2/3">
        <n-input
          v-model:value="searchKey"
          :clearable="true"
          @keydown.enter="handleSearch"
          @input="handleInputChange"
        />
        <n-button type="primary" class="ml-1" @click="handleSearch">
          <n-icon size="20px" class="-mt-0.5">
            <SvgIcon icon-class="search" />
          </n-icon>
        </n-button>
      </div>
    </div>

    <!-- icons -->
    <n-scrollbar class="flex-1 p-3">
      <n-grid v-if="showGrid" x-gap="10" y-gap="10" :cols="isMobile ? 4 : 10">
        <n-grid-item v-for="(item, index) in iconShowList" :key="'icon_' + item">
          <n-card :embedded="true" :hoverable="true" class="p-1">
            <!-- icon view -->
            <n-icon
              :ref="getIconElements"
              :data-refindex="index"
              :size="iconSize + 'px'"
              class="block w-full h-0 pb-[100%] md:pb-[50%] transition-all cursor-pointer"
              @click.stop="handleIconEdit(item)"
            >
              <SvgIcon :icon-class="item" />
            </n-icon>

            <!-- footer -->
            <div class="flex items-center p-4 pt-6 text-sm text-zinc-600 h-7">
              <span class="flex-1 font-black underline truncate">
                {{ item }}
              </span>

              <n-tooltip>
                <template #trigger>
                  <n-icon
                    size="20px"
                    color="#a16207"
                    data-clipboard-action="copy"
                    :data-clipboard-text="item"
                    class="cursor-pointer"
                    :class="[`icons-copy-btn-${index}`]"
                    @click.stop="clipboardCopy(`.icons-copy-btn-${index}`)"
                  >
                    <SvgIcon icon-class="copy" />
                  </n-icon>
                </template>
                <span> {{ $t('page.iconCopy') }} </span>
              </n-tooltip>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <Empty v-else />
    </n-scrollbar>

    <IconEdit ref="iconEditEl" />
  </div>
</template>

<script lang="ts" setup>
  import type { DefineComponent } from 'vue'

  import Empty from '@/components/empty.vue'
  import IconEdit from './components/iconEdit.vue'

  import { getAllIcons } from '@/assets/icons'
  import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
  import { useAppStore } from '@/store/modules/app'
  import { createListener } from '@/utils/listener'
  import { clipboardCopy } from '@/utils/clipboard'

  const appStore = useAppStore()

  const silderBarOccupany = computed((): boolean => appStore.getSidebarOccupancy)
  const isMobile = computed((): boolean => appStore.isMobile)
  const showGrid = computed((): boolean => iconShowList.length > 0)

  const searchKey = ref<string>('')
  const iconList = reactive<Array<string>>([])
  const iconShowList = reactive<Array<string>>([])
  const iconSize = ref<number>(30)
  const iconEditEl = ref<DefineComponent | null>()

  let removeWindowResize = () => {}
  let iconElement0: HTMLElement | null = null

  let watchSilderTimer = 0
  let inputTimer = 0

  /** 获取所有icon列表 */
  function getIconList(): void {
    iconList.push(...getAllIcons())
    iconShowList.push(...getAllIcons())
  }

  /** 获取v-for之后的icon元素 */
  function getIconElements(el: any): void {
    const target = el && el.$el
    if (target && target.dataset && target.dataset.refindex === '0') {
      // eslint-disable-next-line no-console
      iconElement0 = target
      setIconSize()
    }
  }

  /**  设置图标大小*/
  function setIconSize(): void {
    if (!iconElement0) {
      return
    }
    const { clientHeight, clientWidth } = iconElement0
    iconSize.value = Math.min(clientHeight, clientWidth)
  }

  /** 重新设置图标大小 */
  function resetIconSize(): void {
    watchSilderTimer && clearTimeout(watchSilderTimer)
    watchSilderTimer = setTimeout(() => {
      // 更改icon大小，页面自动重新渲染，触发获取icon元素的函数
      iconSize.value++
      watchSilderTimer = 0
    }, 300) as unknown as number
  }

  /** 初始化的监听事件 */
  function initWatch(): void {
    // 监听侧边栏是否占用位置
    watch(
      silderBarOccupany,
      () => {
        resetIconSize()
      },
      { deep: true, immediate: false }
    )

    removeWindowResize = createListener({
      name: 'resize',
      listener: () => {
        resetIconSize()
        iconEditEl.value && iconEditEl.value.resize()
      }
    })
  }

  /** 搜索 */
  function handleSearch(): void {
    inputTimer && clearTimeout(inputTimer)
    inputTimer = 0
    iconShowList.splice(0)
    iconShowList.push(...iconList.filter((item) => item.includes(searchKey.value)))
  }

  /** 输入框输入值改变, 延时搜索 */
  function handleInputChange(): void {
    inputTimer && clearTimeout(inputTimer)
    inputTimer = setTimeout(() => {
      inputTimer = 0
      handleSearch()
    }, 300) as unknown as number
  }

  /**
   * show icon edit
   * @param { string } iconName 图标名称
   */
  function handleIconEdit(iconName: string): void {
    iconEditEl.value && iconEditEl.value.show(iconName)
  }

  onMounted((): void => {
    getIconList()
    initWatch()
  })

  onBeforeUnmount((): void => {
    removeWindowResize()
    watchSilderTimer && clearTimeout(watchSilderTimer)
  })
</script>

<style lang="scss">
  .icons-page {
    .n-card__content {
      padding: 0 !important;
    }
  }
</style>
