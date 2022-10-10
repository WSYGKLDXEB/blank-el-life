const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // AMap: 'AMap',
  // publicPath: './',
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  devServer: {
    host: 'localhost',
    //  port: 8080,//本地运行的端口
    // 配置自动启动浏览器
    // open: true,
    // 接口代理
    proxy: {
      '/cdn': {
        target: 'https://cdn.bootcdn.net/ajax/libs', // 设置要代理访问的接口
        changeOrigin: true,
        pathRewrite: {
          '^/cdn': '' // 重写访问地址，在请求时可以省略target的地址，直接以/shop开头
        }
      }
    }
  },

  // 配置不同环境下的打包入口
  chainWebpack: (config) => {
    // 图片缩略限制
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap((options) => Object.assign(options, { limit: 5 * 1024 }))

    // console.log(process.env.NODE_ENV)
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // 声明
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        // 'vue-echarts': 'VueECharts',
        // echarts: 'echarts',
        axios: 'axios',
        nprogress: 'NProgress',
        zrender: 'zrender'
      })
      config.plugin('html').tap((args) => {
        args[0].isProd = true
        return args
      })
      config.entry('app').clear().add('./src/main-prod.js')
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.plugin('html').tap((args) => {
        args[0].isProd = false
        return args
      })
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
})
