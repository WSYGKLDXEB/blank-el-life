import Vue from 'vue'
import VueRouter from 'vue-router'
// 路径数组
import pathArr from './pathArr'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/exhibit',
    component: () => import('@/views/Exhibit.vue')
  },
  {
    path: '/layout',
    component: () => import('@/views/Layout.vue'),
    children: [
      { meta: { name: '设备平面' }, path: '/equipment', component: () => import('@/views/Building/Equipment.vue') },
      { meta: { name: '视频监控' }, path: '/video', component: () => import('@/views/Safety/Video.vue') },
      { meta: { name: '门禁管理' }, path: '/door', component: () => import('@/views/Safety/Door.vue') },
      { meta: { name: '停车管理' }, path: '/parking', component: () => import('@/views/Safety/Parking.vue') },
      { meta: { name: '能源管理' }, path: '/energy', component: () => import('@/views/Building/Energy.vue') },
      { meta: { name: '梯控管理' }, path: '/stairs', component: () => import('@/views/Building/Stairs.vue') },
      { meta: { name: '高压配电' }, path: '/configEle', component: () => import('@/views/Building/ConfigEle.vue') },
      { meta: { name: '入侵报警' }, path: '/alarm', component: () => import('@/views/Safety/Alarm.vue') },
      { meta: { name: '火灾报警' }, path: '/fire', component: () => import('@/views/Safety/Fire.vue') },
      { meta: { name: '用户管理' }, path: '/user', component: () => import('@/views/Tool/User.vue') },
      { meta: { name: '权限管理' }, path: '/authorit', component: () => import('@/views/Tool/Authorit.vue') }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 路由导航守卫
// beforeEach(将要访问的地址， 从何路径而来， 放行 => next('/xxxx')强制跳转)
router.beforeEach((to, from, next) => {
  if (pathArr.indexOf(to.path) !== -1) {
    const token = sessionStorage.getItem('token')
    // const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
