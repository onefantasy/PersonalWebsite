/**
 * 剪切板功能
 * 需要在使用剪切板函数的html标签上添加以下:
 * 操作类型
 * data-clipboard-action="copy"
 * 操作内容
 * :data-clipboard-text="item"
 */

import ClipboardJS from 'clipboard'
import i18n from '@/language/index'

let clipboard: ClipboardJS | null = null
const message = window.$message
// @ts-ignore
const { t } = i18n.global

/**
 * 复制
 * @param { string } selector html选择器
 * @param { string } containerSelector 动态框等容器选择器，因为在动态框中修改焦点，没有此参数会失效
 * @returns { void } void
 */
export function clipboardCopy(selector: string, containerSelector = ''): void {
  /**
   * 第一次点击，创建对应的clipboard, 注册成功与失败事件，通过模拟点击触发事件
   * 触发事件后，销毁clipboard
   */
  if (clipboard) {
    return
  }
  const copyBtn = document.querySelector(selector) as HTMLElement | null
  const container = containerSelector
    ? (document.querySelector(containerSelector) as HTMLElement | null)
    : false
  if (!copyBtn) {
    message.warning(t('currency.copyFail'))
    return
  }

  const options: ClipboardJS.Options = {}
  container && (options.container = container)

  function destroyClipboard(): void {
    clipboard && clipboard.destroy()
    clipboard = null
  }

  // 挂载剪切板
  clipboard = new ClipboardJS(copyBtn, options)
  clipboard.on('success', function (e) {
    e.clearSelection()
    destroyClipboard()
    message.success(t('currency.copySuccess'))
  })
  clipboard.on('error', function (e) {
    destroyClipboard()
    e.clearSelection()
    message.warning(t('currency.copyFail'))
  })

  // 模拟点击
  copyBtn.click()
}
