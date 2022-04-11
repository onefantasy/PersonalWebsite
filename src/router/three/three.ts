import Layout from '@/layout/index.vue'

export default {
  path: '/three',
  name: 'three',
  component: Layout,
  meta: { title: 'route.three', icon: '3D-cube' },
  redirect: '/three/demo',
  children: [
    {
      path: 'demo',
      name: 'threeDemo',
      component: () => import('@/views/three/demo.vue'),
      meta: { title: 'route.threeDemo', icon: 'three-cube' }
    },
    {
      path: 'demo2',
      name: 'threeDemo2',
      component: () => import('@/views/three/demo2.vue'),
      meta: { title: 'route.threeDemo2', icon: 'three-cube' }
    },
    {
      path: 'skybox',
      name: 'threeSkyBox',
      component: () => import('@/views/three/skyBox.vue'),
      meta: { title: 'route.threeSkyBox', icon: 'blocks' }
    },
    {
      path: 'maze',
      name: 'threeMaze',
      component: () => import('@/views/three/maze.vue'),
      meta: { title: 'route.threeMaze', icon: 'maze' }
    },
    {
      path: 'curvedSurface',
      name: 'threeCurvedSurface',
      component: () => import('@/views/three/curvedSurface.vue'),
      meta: { title: 'route.threeCurvedSurface', icon: 'curvedSurface' }
    }
  ]
}
