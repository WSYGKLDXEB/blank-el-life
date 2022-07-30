// 发布模式

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
// import './plugins/element.js'
// import './assets/style/blank-px.css'
// 网页加载插件 https://github.com/rstacruz/nprogress
import NProgress from 'nprogress'
// 引入全局初始化文件
import 'normalize.css'
import '@/assets/style/global.less'
// 字体样式
import '@/assets/style/iconfont.css'
// 全局注册
import TreeList from '@/components/TreeList.vue'
import Map from '@/components/Map.vue'
// / 请求拦截器
// 在request 拦截器中，显示进度条 NProgress.start();
axios.interceptors.request.use((config) => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response 拦截器中，隐藏进度条 NProgress.done();
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
// Vue.component('tree-list', TreeList)
Vue.component('TreeList', TreeList)
Vue.component('MapBox', Map)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
