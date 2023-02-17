// 企业信息
import { Promise } from 'core-js'
import { enterpriseListApi } from '@/api/enterprise-information-management'
import { userInfoMsg } from '@/api/enterprise-information-management/index'
const enterprise = {
  state: {
    enterpriseName: '', // 企业名称
    enterpriseCertNo: '', // 统一社会信用代码
    enterpriseId: '', // 企业id
    realName: '', // 是否实名
    legelPhone: '', // 法人手机号
    checkStatus: '', // 状态显示
  },

  mutations: {
    SET_ENTERPRISE_NAME(state, data) {
      state.enterpriseName = data
    },
    SET_ENTERPRISE_CERNO(state, data) {
      state.enterpriseCertNo = data
    },
    SET_ENTERPRISE_ID(state, data) {
      state.enterpriseId = data
    },
    // 是否实名
    SET_ISREALNAME: (state, realName) => {
      state.realName = realName
    },
    // 法人手机号
    SET_LEGEL_PHONE(state, data) {
      state.legelPhone = data
    },
    SET_CHECK_STATUS(state, data) {
      state.checkStatus = data
    },
  },

  actions: {
    // 获取用户信息(用户是否实名)
    isRealName({ commit }, state) {
      return new Promise((resolve, reject) => {
        userInfoMsg().then(res => {
          if (res.data.realNameCheck && res.data.faceCheck == 1) {
            commit('SET_ISREALNAME', true)
          } else {
            commit('SET_ISREALNAME', false)
          }
          resolve()
        })
      }).catch(error => {
        reject(error)
      })
    },
    // 是否认证企业
    isEnterprice({ commit }, state) {
      return new Promise((resolve, reject) => {
        enterpriseListApi({
          pageSize: 10,
          pageNum: 1,
          status: '1',
        }).then(res => {
          if (res.code == 200) {
            if (res.data.rows.length > 0) {
              commit('SET_ENTERPRISE_NAME', res.data.rows[0].enterpriseName)
              commit('SET_ENTERPRISE_CERNO', res.data.rows[0].enterpriseCertNo)
              commit('SET_ENTERPRISE_ID', res.data.rows[0].seqNo)
            } else {
              commit('SET_ENTERPRISE_NAME', '')
              commit('SET_ENTERPRISE_CERNO', '')
              commit('SET_ENTERPRISE_ID', '')
            }
          }
          resolve()
        })
      }).catch(error => {
        reject(error)
      })
    },
  },
}

export default enterprise
