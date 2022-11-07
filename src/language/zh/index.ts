const messageFiles: Record<string, any> = import.meta.glob('./message/*ts', { eager: true })
const regFileName = /[A-Za-z]+(?=\.)/
const messages = Object.keys(messageFiles).reduce(
  (messages: { [key: string]: any }, path: string): { [key: string]: any } => {
    const fileName: RegExpExecArray | null = regFileName.exec(path)
    if (fileName) {
      const value = messageFiles[path]
      messages[fileName[0]] = value.default
    }
    return messages
  },
  {}
)

const message = {
  webTitle: '个人网站',
  ...messages
}

export default message

export const zh = message
