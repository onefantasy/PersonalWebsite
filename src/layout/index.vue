<template>
  <n-layout position="absolute" style="height: 100vh" class="layout">
    <n-layout-header
      position="absolute"
      class="shadow layout-header"
      :style="`height:${appStore.headerHeight}px;z-index:1;`"
    >
      <Header />
    </n-layout-header>
    <n-layout
      has-sider
      position="absolute"
      class="layout-content"
      :style="`top:${appStore.headerHeight}px;bottom:0;`"
    >
      <n-layout-sider
        bordered
        :inverted="true"
        collapse-mode="transform"
        :collapsed-width="0"
        show-trigger="bar"
        :collapsed="hiddenSider"
        class="z-50"
        :class="{ 'bar-inner': !hiddenSider }"
        :position="appStore.isMobile ? 'absolute' : 'static'"
        :width="appStore.siderWidth"
        @update:collapsed="hanldeUpdateCollapsed"
      >
        <Sider @menuUpdateValue="handleMenuUpdateValue" />
      </n-layout-sider>
      <n-layout-content :native-scrollbar="false">
        <RouterView v-slot="{ Component }">
          <transition name="rotate-layout">
            <component :is="Component" />
          </transition>
        </RouterView>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
  import Header from '@/layout/header/header.vue'
  import Sider from '@/layout/sider/sider.vue'

  import { screenEnum } from '@/enums/breakpointEnum'
  import { onMounted, ref } from 'vue'
  import { createListener } from '@/utils/listener'
  import { useAppStore } from '@/store/modules/app'

  // store
  const appStore = useAppStore()

  // 是否展开侧边栏
  const hiddenSider = ref<boolean>(false)
  const hanldeUpdateCollapsed = (collapsed: boolean): void => {
    hiddenSider.value = collapsed
    appStore.setIsHiddenSider(collapsed)
  }

  // 处理窗口大小变化
  const hanldeWindowResize = (): void => {
    const isMobile: boolean = window.innerWidth < screenEnum.LG
    hanldeUpdateCollapsed(isMobile)
    appStore.setIsMove(isMobile)
  }

  // 点击菜单处理事件
  const handleMenuUpdateValue = (): void => {
    if (appStore.isMobile) {
      hanldeUpdateCollapsed(true)
    }
  }

  onMounted(() => {
    // init handle window size
    hanldeWindowResize()
    // init resize listener
    createListener({ name: 'resize', listener: hanldeWindowResize })
  })
</script>

<style lang="scss">
  .layout {
    .bar-inner {
      .n-layout-toggle-bar {
        right: 0 !important;
      }
    }
  }
</style>
