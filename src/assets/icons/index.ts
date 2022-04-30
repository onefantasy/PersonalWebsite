function getAllIcons(): Array<string> {
  const iconKeys = Object.keys(import.meta.globEager('./*.svg'))
  const regName = /(?<=\.\/)[A-Za-z0-9-]+(?=\.svg)/

  return iconKeys.map((item): string => {
    const target = regName.exec(item)
    return target ? target[0] : ''
  })
}

export { getAllIcons }
