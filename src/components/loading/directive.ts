import type { ComponentPublicInstance, DirectiveBinding, ObjectDirective } from 'vue'

import loading from './loading.vue'
import { createApp } from 'vue'

interface bindingType {
  withProgress: boolean
  progressValue: number
  isShow: boolean
}

interface instanceType extends ComponentPublicInstance {
  execUnmount?: (callback: () => void) => void
}

interface elType extends HTMLElement {
  instance?: instanceType
}

const appendNode = (el: elType): void => {
  if (el.instance) {
    return
  }
  // 创建由loading组成的app对象
  const app = createApp(loading)
  //动态创建一个div节点，将app挂载在div上
  const instance: instanceType = app.mount(document.createElement('div'))
  // 因为在updated也需要用到 instance 所以将 instance 添加在el上 ，在updated中通过el.instance 可访问到
  el.instance = instance
  const parentStyle = getComputedStyle(el)
  if (!parentStyle || !parentStyle.position || parentStyle.position === 'static') {
    el.style.position = 'relative'
  }
  el.appendChild(el.instance.$el)
}

const removeNode = (el: elType): void => {
  if (!el.instance || !el.instance.execUnmount) {
    return
  }
  el.instance.execUnmount(() => {
    el.instance && el.removeChild(el.instance.$el)
    delete el.instance
  })
}

export const directiveLoading: ObjectDirective<any, any> = {
  updated(el: elType, binding: DirectiveBinding<bindingType | boolean>): void {
    if (typeof binding.value === 'boolean' && binding.value) {
      appendNode(el)
    } else if (typeof binding.value === 'boolean') {
      removeNode(el)
    }
  }
}
