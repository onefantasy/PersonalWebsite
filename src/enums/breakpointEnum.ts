export enum sizeEnum {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  '2XL' = '2XL'
}

export enum screenEnum {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  '2XL' = 1534
}
const screenMap = new Map<sizeEnum, screenEnum>()

screenMap.set(sizeEnum.SM, screenEnum.SM)
screenMap.set(sizeEnum.MD, screenEnum.MD)
screenMap.set(sizeEnum.LG, screenEnum.LG)
screenMap.set(sizeEnum.XL, screenEnum.XL)
screenMap.set(sizeEnum['2XL'], screenEnum['2XL'])

export { screenMap }
