import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/upload',
    method: 'post',
    timeout: 500,
    statusCode: 200,
    response: (options) => {
      return { code: 200, options, message: 'Upload success !' }
    }
  }
] as Array<MockMethod>
