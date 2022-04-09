import { RendererElement, RendererNode, VNode } from 'vue'

export interface menuItem {
  label: () => VNode<RendererNode, RendererElement, { [key: string]: any }> | string
  key: string
  path: string
  icon?: any
  hidden?: boolean
  children?: menuItem[]
}
