import { createApp } from 'vue'
import App from '@/App.vue'
// plugins
import router from '@/router'
import i18n from '@/language'
import { createPinia } from 'pinia'
// ui
import '@/style/index.css'
import { naive } from '@/utils/native'
// svg loader
import 'vite-plugin-svg-icons/register'
import svgIcon from './components/svgIcon.vue'
// directibe
import { directiveLoading } from '@/components/loading/directive'

// mock
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
