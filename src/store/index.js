import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import enterprise from './modules/enterprise'
import msx from './modules/msx'
import bankInfo from './modules/bankInfo'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    bankInfo,
    enterprise,
    msx,
  },
  getters,
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer(val) {
        return {
          // 只储存state中的token
          enterprise: val.enterprise,
        }
      },
    }),
  ],
})

export default store
