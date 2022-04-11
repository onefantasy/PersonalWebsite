import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 逐步导入mock.ts文件
import tableModule from './table'

export function setupProdMockServer() {
  createProdMockServer([...tableModule])
}
