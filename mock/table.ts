import type { MockMethod } from 'vite-plugin-mock'
import { Random, mock } from 'mockjs'

Random.extend({
  phone: function () {
    return '1' + mock(/\d{10}/)
  }
})

export default [
  {
    url: '/mock/page/tableList',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: ({ query }) => {
      const { pageNumber, pageSize, filters } = query
      const { sex, address } = JSON.parse(filters)
      const list = []
      let id = pageSize * (pageNumber - 1) + 1
      let sexCondition = false
      if (sex && sex instanceof Array && sex.length === 1) {
        sexCondition = true
      }

      for (let i = 0; i < +pageSize; i++) {
        list.push({
          id,
          idNumber: Random.id(),
          address: address ? '@city(true)' + address + Random.cword() + '区' : '@county(true)',
          name: '@cname()',
          age: Random.integer(20, 50),
          birthday: `@date('yyyy-MM-dd')`,
          phone: Random.phone(),
          sex: sexCondition ? sex[0] : Random.integer(0, 1),
          avatar: Random.image('400x400', Random.color(), Random.color(), Random.first())
        })
        id++
      }
      return { code: 200, list, query, total: 1000, message: 'mock table success !' }
    }
  }
] as Array<MockMethod>
