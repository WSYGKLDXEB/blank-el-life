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
      { path: '/video', component: () => import('@/views/Safety/Video.vue') },
      { path: '/door', component: () => import('@/views/Safety/Door.vue') },
      { path: '/parking', component: () => import('@/views/Safety/Parking.vue') },
      { path: '/energy', component: () => import('@/views/Building/Energy.vue') },
      { path: '/stairs', component: () => import('@/views/Building/Stairs.vue') },
      { path: '/configEle', component: () => import('@/views/Building/ConfigEle.vue') },
      { path: '/alarm', component: () => import('@/views/Safety/Alarm.vue') },
      { path: '/fire', component: () => import('@/views/Safety/Fire.vue') },
      { path: '/user', component: () => import('@/views/Tool/User.vue') },
      { path: '/authorit', component: () => import('@/views/Tool/Authorit.vue') },
      { path: '/rights', component: () => import('@/views/Tool/Rights.vue') }
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
