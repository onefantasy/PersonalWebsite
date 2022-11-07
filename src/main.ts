import { createApp } from 'vue'
import App from '@/App.vue'
// plugins
import router from '@/router'
import i18n from '@/language'
import { createPinia } from 'pinia'
// ui
import '@/style/index.css'
import { naive } from '@/utils/naive'
// svg loader
import 'virtual:svg-icons-register'
import svgIcon from './components/svgIcon.vue'
// directibe
import { directiveLoading } from '@/components/loading/directive'

// mock
// 若是不需要在product环境使用mock，可以删除以下两行代码
import { setupProdMockServer } from '../mock/mockProdServer'
setupProdMockServer()

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(naive)
  .directive('loading', directiveLoading)
  .component('SvgIcon', svgIcon)
  .mount('#app')
