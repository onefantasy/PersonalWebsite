import type { MockMethod } from 'vite-plugin-mock'
import { Random, mock } from 'mockjs'

export default [
  {
    url: '/mock/three/getCurvedSurfaceList',
    method: 'get',
    timeout: 100,
    statusCode: 200,
    response: ({ query }: { query: { pageSize: number; pageNumber: number } }) => {
      const { pageSize } = query
      const list = []
      const bigImgNum = Math.floor(Math.sqrt(pageSize / 4))
      for (let i = 0, len = +pageSize - bigImgNum * 3; i < len; i++) {
        const isBig = i < bigImgNum
        list.push({
          url: Random.image('100x100', Random.color(), Random.color(), Random.first()),
          isBig
        })
      }
      return { code: 200, list, message: 'mock curved suffave success !' }
    }
  }
] as Array<MockMethod>
