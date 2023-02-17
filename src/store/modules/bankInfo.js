const bankInfo = {
  state: {
    account: null,
    // 外部账户信息

    accountName: '',
    accountNo: '',
    accountRecordId: '',
  },

  mutations: {
    SET_ACCOUNT(state, data) {
      state.account = data
    },
    SET_AccountName(state, data) {
      state.accountName = data
    },
    SET_AccountNo(state, data) {
      state.accountNo = data
    },
    SET_AccountRecordId(state, data) {
      state.accountRecordId = data
    },
  },

  actions: {},
}

export default bankInfo
