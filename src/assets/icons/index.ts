function getAllIcons(): Array<string> {
  const iconKeys = Object.keys(import.meta.glob('./*.svg', { eager: true }))
  const regName = /(?<=\.\/)[A-Za-z0-9-]+(?=\.svg)/

  return iconKeys.map((item): string => {
    const target = regName.exec(item)
    return target ? target[0] : ''
  })
}

export { getAllIcons }
