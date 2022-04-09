import axios from '@/utils/axios'
import type { tableListParams } from './model/table'

axios.defaults.baseURL = '/mock'

export const apiGetTableList = (params: tableListParams) =>
  axios({ url: '/page/tableList', method: 'get', params })
