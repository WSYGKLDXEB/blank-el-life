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
    path: '/layout',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: '/home', component: () => import('@/views/Home.vue') },
      { path: '/equipment', component: () => import('@/views/Building/Equipment.vue') },
      { path: '/video', component: () => import('@/views/Building/Video.vue') },
      { path: '/electricity', component: () => import('@/views/Building/Electricity.vue') },
      { path: '/door', component: () => import('@/views/Building/Door.vue') },
      { path: '/parking', component: () => import('@/views/Building/Parking.vue') },
      { path: '/energy', component: () => import('@/views/Building/Energy.vue') },
      { path: '/stairs', component: () => import('@/views/Building/Stairs.vue') },
      { path: '/invasion', component: () => import('@/views/Alarm/Invasion.vue') },
      { path: '/fire', component: () => import('@/views/Alarm/Fire.vue') },
      { path: '/record', component: () => import('@/views/Alarm/Record.vue') },
      { path: '/user', component: () => import('@/views/Tool/User.vue') },
      { path: '/authorit', component: () => import('@/views/Tool/Authorit.vue') }
    ]
  }
]

const router = new VueRouter({
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
