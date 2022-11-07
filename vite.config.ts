import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv) => {
  const env = loadEnv(mode, __dirname)
  // 端口
  const port = +env.VITE_PORT
  // 网站名称
  const appTitle = env.VITE_GLOB_APP_TITLE || 'Vite App'

  return {
    // 打包路径
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      // svg loader
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      // 变量注入html
      createHtmlPlugin({
        inject: { data: { title: appTitle } }
      }),
      // mock
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        // don't inject code to production
        prodEnabled: true
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    // 启动服务配置
    server: {
      host: '0.0.0.0',
      port: isNaN(port) ? 8085 : port,
      open: true,
      https: false,
      proxy: {}
    },
    // 生产环境打包
    build: {
      terserOptions: {
        compress: {
          // 去除console debugger
          // eslint-disable-next-line camelcase
          drop_console: true,
          // eslint-disable-next-line camelcase
          drop_debugger: true
        }
      }
    }
  }
})
