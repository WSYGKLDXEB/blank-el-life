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
      { path: '/time', component: () => import('@/views/Monitor/Time.vue') },
      { path: '/video', component: () => import('@/views/Monitor/Video.vue') },
      { path: '/page', component: () => import('@/views/Monitor/Page.vue') },
      { path: '/history', component: () => import('@/views/Datas/History.vue') },
      { path: '/error', component: () => import('@/views/Datas/Error.vue') },
      { path: '/notice', component: () => import('@/views/Datas/Notice.vue') },
      { path: '/user', component: () => import('@/views/Tool/User.vue') },
      { path: '/equipment', component: () => import('@/views/Tool/Equipment.vue') },
      { path: '/log', component: () => import('@/views/Tool/Log.vue') }
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
