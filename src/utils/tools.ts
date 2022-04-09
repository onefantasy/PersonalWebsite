/**
 * @function getOffsetInfo
 * @param { HTMLElement } el 起始元素
 * @param { HTMLElement } target 结束元素，默认为document.body
 * @description 该函数用于获取元素相对于另一元素的位置
 *  */
export const getElementOffsetInfo = (
  el: HTMLElement,
  target?: HTMLElement
): { top: number; left: number } => {
  let left = 0
  let top = 0
  const body = document.body
  let currentEl = el
  target || (target = body)
  while (target !== currentEl && currentEl !== null) {
    left += currentEl.offsetLeft
    top += currentEl.offsetTop
    // @ts-ignore
    currentEl = currentEl.offsetParent
  }
  return { left, top }
}
