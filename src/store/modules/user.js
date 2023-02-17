import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getUid, setUid, removeUid } from '@/utils/auth'
import { getAllDictApi } from '@/api/system/dict/data.js'
import { userLoginApi, userLogin, userLoginByThird } from '@/api/user-center'
import Vue from 'vue'
import store from '@/store'
import { Promise } from 'core-js'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    uid: getUid(),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        let requestUrl = userInfo.type == 'first' ? userLoginApi : userLogin
        requestUrl(userInfo)
          .then(res => {
            setToken(res.data.token)
            setUid(res.data.uid)
            commit('SET_TOKEN', res.data.token)
            commit('SET_UID', res.data.uid)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 第三方平台跳转登录
    UserLoginByThird({ commit }, reqParam) {
      return new Promise((resolve, reject) => {
        userLoginByThird(reqParam)
          .then(res => {
            if (res.data.register) {
              setToken(res.data.token)
              setUid(res.data.uid)
              commit('SET_TOKEN', res.data.token)
              commit('SET_UID', res.data.uid)
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 第三方平台跳转登录补充信息注册成功
    UserLoginByThirdPerfectMsgSuccess({ commit }, res) {
      return new Promise((resolve, reject) => {
        setToken(res.data.token)
        setUid(res.data.uid)
        commit('SET_TOKEN', res.data.token)
        commit('SET_UID', res.data.uid)

        resolve()
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      let isLocal = true
      store.dispatch('isEnterprice').then(() => {
        if (store.state.enterprise.enterpriseId) {
          getAllDictApi().then(res => {
            Vue.prototype.$staticData = res.data || []
          })
        }
      })
      // const { data }
      // isLocal = location.hostname == 'localhost' || location.host.indexOf('192.168.') > -1

      if (isLocal) {
        return new Promise((resolve, reject) => {
          try {
            commit('SET_ROLES', ['admin'])
            commit('SET_PERMISSIONS', ['*:*:*'])
            commit('SET_NAME', '本地环境')
            commit('SET_AVATAR', '')
            resolve({
              msg: '操作成功',
              code: 200,
              permissions: ['*:*:*'],
              roles: ['admin'],
              user: {
                createBy: 'admin',
                createTime: '2021-05-19 03:23:29',
                remark: '管理员',
                params: {},
                userId: 1,
                deptId: 103,
                userName: 'admin',
                nickName: 'admin',
                email: 'ry@163.com',
                phonenumber: '15888888888',
                sex: '1',
                avatar: '',
                status: '0',
                delFlag: '0',
                loginIp: '127.0.0.1',
                loginDate: '2021-05-19 03:23:29',
                dept: {
                  params: {},
                  deptId: 103,
                  parentId: 101,
                  deptName: '研发部门',
                  orderNum: '1',
                  leader: '若依',
                  status: '0',
                  children: [],
                },
                roles: [
                  {
                    params: {},
                    roleId: 1,
                    roleName: '超级管理员',
                    roleKey: 'admin',
                    roleSort: '1',
                    dataScope: '1',
                    menuCheckStrictly: false,
                    deptCheckStrictly: false,
                    status: '0',
                    flag: false,
                    admin: true,
                  },
                ],
                admin: true,
              },
            })
          } catch (error) {
            reject(error)
          }
        })
      }
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(res => {
            const user = res.user
            const avatar =
              user.avatar == ''
                ? require('@/assets/images/profile.jpg')
                : process.env.VUE_APP_BASE_API + user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取所有字典
    getAllDict() {
      Vue.prototype.$staticData = {}
      getAllDictApi().then(res => {
        Vue.prototype.$staticData = res.data
      })
    },
    // 退出系统
    LogOut({ commit, state }) {
      let isLocal = true
      // isLocal = location.hostname == "localhost" || location.host.indexOf("192.168.") > -1;
      if (isLocal) {
        return new Promise((resolve, reject) => {
          try {
            commit('SET_TOKEN', '')
            commit('SET_UID', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            removeUid()
            resolve()
          } catch (err) {
            reject(err)
          }
        })
      }
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_UID', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            removeUid()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
  },
}

export default user
