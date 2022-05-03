import Layout from '@/layout/index.vue'

export default {
  path: '/CSS',
  name: 'CSS',
  component: Layout,
  meta: { title: 'route.css', icon: 'css' },
  redirect: '/CSS/passThrough',
  children: [
    {
      path: 'passThrough',
      name: 'cssPassThrough',
      component: () => import('@/views/css/passThrough/passThrough.vue'),
      meta: { title: 'route.cssPassThrough', icon: 'sparkles' }
    },
    {
      path: 'loading',
      name: 'cssLoading',
      component: () => import('@/views/css/loading/loading.vue'),
      meta: { title: 'route.cssLoading', icon: '', hidden: true }
    }
  ]
}
