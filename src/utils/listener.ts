//  listener of change window size
import type { Ref } from 'vue'

export interface eventParams {
  el?: Element | Ref<Element | undefined> | Window | any
  name: string
  listener: EventListener | Function
  options?: boolean | AddEventListenerOptions
}

export function createListener({
  el = window,
  name,
  listener,
  options = false
}: eventParams): () => void {
  let removeListener = () => {}
  if (el) {
    el.addEventListener(name, listener, options)
    removeListener = () => el.removeEventListener(name, listener, options)
  }
  return removeListener
}
