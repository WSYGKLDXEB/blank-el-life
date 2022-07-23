import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element.js'
// import './assets/style/blank-px.css'

// 引入全局初始化文件
import 'normalize.css'
import '@/assets/style/global.less'
// 字体样式
import '@/assets/style/iconfont.css'
// 全局注册
import TreeList from '@/components/TreeList.vue'
import Map from '@/components/Map.vue'

// Vue.component('tree-list', TreeList)
Vue.component('TreeList', TreeList)
Vue.component('MapBox', Map)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
