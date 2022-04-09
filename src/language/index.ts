import { createI18n } from 'vue-i18n'

// 自定义语言
const messageFiles = import.meta.globEager('./*/index.ts')
const regFileName = /[A-Za-z]+(?=\/)/
const messages = Object.keys(messageFiles).reduce(
  (msgs: { [key: string]: any }, path: string): { [key: string]: any } => {
    const name: RegExpExecArray | null = regFileName.exec(path)
    if (name) {
      const value = messageFiles[path]
      msgs[name[0]] = value.default
    }
    return msgs
  },
  {}
)

const i18n = createI18n({
  globalInjection: true,
  // 定义语言
  locale: 'zh',
  // message 决定 i18n.global.locale 的类型
  messages
})

export default i18n
