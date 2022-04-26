import axios from '@/utils/axios'
import { curvedSurfaceListParamsTpye } from './type'

axios.defaults.baseURL = '/mock'

export const apiGetCurvedSurfaceList = (params: curvedSurfaceListParamsTpye) =>
  axios({ url: '/three/getCurvedSurfaceList', method: 'get', params })
