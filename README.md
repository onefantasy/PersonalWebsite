# vue3 项目模板

## Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

该模板将帮助您开始使用Vue 3和Vite中的Typescript进行开发。该模板使用Vue 3`<script setup>`SFCs，请查看[文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-脚本设置)了解更多信息。

## 技术选型
  ### 1. 基本框架
  - Vue 3
  - Typescript
  - vite
  - pinia
    > 使用pinia 代替vueX, 可以取得更好typescript支持。
  - vue-router
  - vue-i18n
  ### 2. UI <br />
  本项目主要使用`naive-ui`作为整体页面组件的UI, `tailwindcss`用于处理页面UI细节。<br />
  - [naive-ui](https://www.naiveui.com/zh-CN/os-theme)
    > `Naive UI` 是一个 `Vue3` 的组件库, 全量使用 `TypeScript` 编写, 提供了一个使用 `TypeScript` 构建的先进的类型安全主题系统, 通过配置文件可以指定任何主题;在本项目中主要用于整体页面框架的构建。
  - [tailwindcss](https://www.tailwindcss.cn/)
    > 原子化样式。<br />
    > 响应式功能。<br />
    > 优秀的UI设计, 开发者无需过多的考虑UI细节, 也能制作出不错的页面。<br />

## 开发推荐

### 1. 编辑器
  - [VSCode](https://code.visualstudio.com/)
### 2. 扩展插件
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
  > `Vue3` 开发必备
- [ESLint](https://eslint.org/) + [Prettier - Codeformatter](https://prettier.io/)
  > `javascript`, `typescript` 规范
- [Stylelint](https://stylelint.io/)
  > `css` 规范
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  > `tailwindcss` 智能提示

## 项目运行
将项目clone到本地, 进行如下操作 :
1. 安装依赖
```
npm install
```
2. 开发环境运行
```
npm run dev
```
3. 打包
```
npm run build
```
