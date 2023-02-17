import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import zqRouter from '@/router/zqRouter'
import cypRouter from '@/router/cypRouter'
import store from '@/store'
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters: [],
    topbarRouters: [],
    defaultRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = constantRoutes.concat(routers)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      let isLocal = true
      isLocal = location.hostname == 'localhost' || location.host.indexOf('192.168.') > -1
      // if (isLocal) {
      //   return new Promise((resolve, reject) => {
      //     try {
      //       const sdata = JSON.parse(JSON.stringify(locaRouters))
      //       const rdata = JSON.parse(JSON.stringify(locaRouters))
      //       const sidebarRoutes = filterAsyncRouter(sdata)
      //       const rewriteRoutes = filterAsyncRouter(rdata, false, true)
      //       rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
      //       commit('SET_ROUTES', rewriteRoutes)
      //       commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
      //       console.log('rewriteRoutes', rewriteRoutes)
      //       resolve(rewriteRoutes)
      //     } catch (error) {
      //       reject(error)
      //     }
      //   })
      // }
      return new Promise(resolve => {
        store.dispatch('isEnterprice').then(() => {
          if (store.state.enterprise.enterpriseId) {
            getRouters('zh').then(res => {
              if (res.data.length == 0) {
                res.data = res.data.concat(zqRouter).concat(cypRouter)
              } else {
                res.data.forEach(item => {
                  if (item.name == 'User-center' && item.children && item.children.length == 0) {
                    res.data = res.data.concat(zqRouter)
                  } else if (
                    item.name == 'Company-manage' &&
                    item.children &&
                    item.children.length == 0
                  ) {
                    res.data = res.data.concat(cypRouter)
                  }
                })
              }
              const sdata = JSON.parse(JSON.stringify(res.data))
              const rdata = JSON.parse(JSON.stringify(res.data))
              const sidebarRoutes = filterAsyncRouter(sdata)
              const rewriteRoutes = filterAsyncRouter(rdata, false, true)
              rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
              commit('SET_ROUTES', rewriteRoutes)
              commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
              commit('SET_TOPBAR_ROUTES', sidebarRoutes)
              commit('SET_DEFAULT_ROUTES', sidebarRoutes)
              resolve(rewriteRoutes)
            })
          } else {
            let data = []
            data = data.concat(zqRouter).concat(cypRouter)
            const sdata = JSON.parse(JSON.stringify(data))
            const rdata = JSON.parse(JSON.stringify(data))
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
            commit('SET_ROUTES', rewriteRoutes)
            commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
            commit('SET_TOPBAR_ROUTES', sidebarRoutes)
            commit('SET_DEFAULT_ROUTES', sidebarRoutes)
            resolve(rewriteRoutes)
          }
        })
        // 向后端请求路由数据
      })
    },
  },
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }

    if (route.meta) {
      route.meta.hidden = route.hidden
    }

    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/views/${view}`], resolve)
}

export default permission
