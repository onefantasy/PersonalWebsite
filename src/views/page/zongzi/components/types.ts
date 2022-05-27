import type { ComponentPublicInstance } from 'vue'

export interface droppedObjectType {
  startPosition: { top: number; left: number }
  endPosition: { top: number; left: number }
  objectName: string
  id: number
}

export interface droppedObjectRefType extends ComponentPublicInstance {
  computeNewPosition: () => { top: number; left: number }
  destroyedDroppedObject: () => {}
  isShow: boolean
  objectName: string
}
