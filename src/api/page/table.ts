import axios from '@/utils/axios'
import type { tableListParams } from './type'

axios.defaults.baseURL = '/mock'

export const apiGetTableList = (params: tableListParams) =>
  axios({ url: '/page/tableList', method: 'get', params })
