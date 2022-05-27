import Layout from '@/layout/index.vue'

export default {
  path: '/page',
  name: 'page',
  component: Layout,
  meta: { title: 'route.page', icon: 'page' },
  redirect: '/page/index',
  children: [
    {
      path: 'index',
      name: 'pageIndex',
      component: () => import('@/views/page/personalHomepage/personalHomepage.vue'),
      meta: { title: 'route.PersonalHomepage', icon: 'red-hat' }
    },
    {
      path: 'table',
      name: 'pageTable',
      component: () => import('@/views/page/table/table.vue'),
      meta: { title: 'route.table', icon: 'table' }
    },
    {
      path: 'icons',
      name: 'pageIcons',
      component: () => import('@/views/page/icons/icons.vue'),
      meta: { title: 'route.icons', icon: 'icons' }
    },
    {
      path: 'zongziGame',
      name: 'pageZongziGame',
      component: () => import('@/views/page/zongzi/zongziGame.vue'),
      meta: { title: 'route.zongziGame', icon: 'game' }
    }
  ]
}
