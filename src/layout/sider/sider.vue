<template>
  <n-menu
    class="sider"
    accordion
    :inverted="true"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    :value="activeRoute"
    default-expand-all
    @update:value="handleUpdateValue"
  />
</template>

<script setup lang="ts">
  import type { menuItem } from './type'
  import type { routeMeta } from '@/router/type'
  import type { RouteRecordRaw } from 'vue-router'
  import { useRouter, useRoute } from 'vue-router'
  import { h, ref, reactive, onMounted, watch } from 'vue'
  import { renderIcon } from '@/utils/render'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const emit = defineEmits(['menuUpdateValue'])

  // router
  const router = useRouter()
  const routes: RouteRecordRaw[] = [...router.options.routes]
  const generateMenu = (routes: RouteRecordRaw[], prefixPath = ''): menuItem[] => {
    const routesLength: number = routes.length
    const menus: menuItem[] = []
    if (routesLength > 0) {
      for (let i = 0; i < routesLength; i++) {
        const { path, meta, children } = routes[i]
        if (!meta || meta.hidden || !meta.title) {
          continue
        }
        const { title, icon } = meta as any as routeMeta
        const menuPath: string = prefixPath + path
        const menu: menuItem = {
          label: () => h('span', null, { default: () => t(title) }),
          key: title,
          path: menuPath
        }
        if (icon && icon.length > 0) {
          menu.icon = renderIcon(icon)
        }
        if (children && children.length > 0) {
          const menuChildren: menuItem[] = generateMenu(children, menuPath + '/')
          menuChildren.length !== 0 && (menu.children = menuChildren)
        }
        menus.push(menu)
      }
    }
    return menus
  }
  // menus
  const menuOptions = reactive<menuItem[]>(generateMenu(routes))

  // 当前路由
  const activeRoute = ref<string>('')
  const route = useRoute()
  // 设置当前菜单
  const setActiveMenu = (): void => {
    activeRoute.value = route.meta && (route.meta.title as string)
  }

  // 点击菜单，路由跳转
  const handleUpdateValue = (key: string, item: menuItem): void => {
    activeRoute.value = key
    router.push(item.path)
    emit('menuUpdateValue')
  }

  // mounted
  onMounted(() => setActiveMenu())
  // 监听路由
  watch(
    () => route.fullPath,
    () => setActiveMenu(),
    { deep: true }
  )
</script>

<style lang="scss">
  .sider .n-menu-item-content__icon {
    margin-top: -4px;
  }
</style>
