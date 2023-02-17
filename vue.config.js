'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '供应链金融平台' // 标题

const port = process.env.port || process.env.npm_config_port || 8080 // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    historyApiFallback: true,
    overlay: {
      error: true,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API + '/cls/credit/']: {
        // 授信
        target: `http://172.30.1.161:9003/cls/credit`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/credit']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/account/']: {
        // 账单
        target: `http://172.30.1.162:9105/cls/account`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/account']: '',
        },
      },
      // image 服务
      [`${process.env.VUE_APP_BASE_API}/cls/passport/`]: {
        target: 'http://172.30.1.161:9005/cls/passport',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}/cls/passport`]: '',
        },
      },
      // core 服务
      [`${process.env.VUE_APP_BASE_API}/cls/core/`]: {
        target: 'http://172.30.1.161:9001/cls/core',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}/cls/core`]: '',
        },
      },
      // bill 服务
      [`${process.env.VUE_APP_BASE_API}/cls/bill/`]: {
        target: 'http://172.30.1.161:9101/cls/bill',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}/cls/bill`]: '',
        },
      },
      // loans 服务
      [`${process.env.VUE_APP_BASE_API}/cls/loans/`]: {
        target: 'http://172.30.1.161:9010/cls/loans',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}/cls/loans`]: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/image']: {
        // 影像件
        target: `http://172.30.1.161:9015/cls/image`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/image']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/msx']: {
        // msx
        target: `http://172.30.1.162:9102/cls/msx`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/msx']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/pay']: {
        // pay
        target: `http://172.30.1.162:9004/cls/pay`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/pay']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/sms']: {
        // sms
        target: `http://172.30.1.161:9007/cls/sms`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/sms']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/contract']: {
        // 合同
        target: `http://172.30.1.162:9008/cls/contract`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/contract']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/passport-funder']: {
        // 用户中心
        target: `http://172.30.1.161:9106/cls/passport-funder`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/passport-funder']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/passport-enterprise']: {
        // 用户中心
        target: `http://172.30.1.161:9005/cls/passport-enterprise`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/passport-enterprise']: '',
        },
      },
      [process.env.VUE_APP_BASE_API + '/cls/passport-personal']: {
        // 用户中心
        target: `http://172.30.9.114:9108/cls/passport-personal`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API + '/cls/passport-personal']: '',
        },
      },
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://172.30.1.161:8088`,
        // target: `http://10.1.4.159:8080`, // 用户中心
        // target: `http://10.3.40.24:8088`, //放款管理
        // target: `http://10.3.80.54:8080`, //核算管理
        // target: `http://172.30.1.161:8080`, //息费减免
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
    },
    disableHostCheck: true,
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        components: resolve('src/components'),
      },
    },
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      config.optimization.runtimeChunk('single'),
        {
          from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
          to: './', //到根目录下
        }
    })
  },
}
