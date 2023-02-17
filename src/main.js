import Vue from 'vue'
import Cookies from 'js-cookie'

import Element, { TabPane } from 'element-ui'
import './assets/styles/element-variables.scss'
import NProgress from 'nprogress'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import '@/common/css/diy.css'

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getToken } from './utils/auth'
import { getConfigKey } from '@/api/system/config'
import plugins from './components/plugins' // plugins
import moment from 'moment'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  selectComLabel,
  changeComLabel,
  download,
  handleTree,
} from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'

import { showMessage, showInvalidMessage, Storage } from '@/common/js/utils.js'
// 全局方法挂载
Vue.prototype.$showMessage = showMessage
Vue.prototype.$showInvalidMessage = showInvalidMessage
Vue.prototype.$Storage = Storage

// import { ElValidation } from '@/common/js/verify.js'
// Vue.prototype.$ElValidation = ElValidation

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.selectComLabel = selectComLabel
Vue.prototype.changeComLabel = changeComLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.moment = moment

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)
Vue.use(plugins)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})

router.beforeEach((to, from, next) => {
  if (to.path != '/login' && to.path != '/registerPerfectMsg') {
    if (!store.state.enterprise.realName) {
      store.dispatch('isRealName').then(() => {
        if (!store.state.enterprise.realName) {
          if (to.path == '/company-manage/company-manage-list') {
            Element.MessageBox('用户须先完成实名认证！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                next('/user-center/certification-info')
              })
              .catch(() => {
                next('/user-center/certification-info')
              })
          } else {
            next()
          }
        } else if (store.state.enterprise.realName) {
          if (!store.state.enterprise.enterpriseId) {
            store.dispatch('isEnterprice').then(() => {
              next()
              if (to.path == '/index' && !store.state.enterprise.enterpriseId) {
                Element.MessageBox('用户须先完成企业认证！', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                })
                  .then(() => {
                    next('/company-manage/company-manage-list')
                  })
                  .catch(() => {
                    next('/company-manage/company-manage-list')
                  })
              } else {
                next()
              }
            })
          }
          next()
        }
      })
    }
    next()
  }
  next()
})

Vue.config.productionTip = false

window.vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
