// import tab from './tab'
// import auth from './auth'
// import download from './download'
import cache from './cache'
import modal from './model'

export default {
  install(Vue) {
    // // 页签操作
    // Vue.prototype.$tab = tab
    // // 认证对象
    // Vue.prototype.$auth = auth
    // // 下载文件
    // Vue.prototype.$download = download
    // 缓存对象
    Vue.prototype.$cache = cache
    // 模态框对象
    Vue.prototype.$modal = modal
  }
}
