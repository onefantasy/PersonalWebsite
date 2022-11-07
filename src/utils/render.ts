import { h } from 'vue'
import { NIcon } from 'naive-ui'
import SvgIcon from '@/components/svgIcon.vue'

// 渲染图标
export function renderIcon(icon: string) {
  if (!icon) {
    return () => {}
  }
  return () => h(NIcon, null, { default: () => h(SvgIcon, { iconClass: icon }) })
}
