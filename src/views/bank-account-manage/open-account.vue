<template>
  <div class="open-account">
    <div class="form-container">
      <el-form
        :model="accountForm"
        ref="accountForm"
        :rules="accountRules"
        inline
        label-width="220px"
      >
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input
            v-model.trim="accountForm.enterpriseName"
            style="width: 350px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码税务登记证号" prop="authCode">
          <el-input v-model.trim="accountForm.authCode" style="width: 350px" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-select v-model.trim="accountForm.bankCode" style="width: 350px">
            <el-option
              v-for="bank in bankList"
              :key="bank.bankCode"
              :value="bank.bankCode"
              :label="bank.bankLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通账户类型" prop="accountType">
          <el-radio-group v-model.trim="accountForm.accountType">
            <div style="margin-bottom: 20px;">
              <el-radio :label="1">
                一般结算户
                <span style="font-size: 12px;">
                  (可用于线上还款、云信到期收款、函证缴费等)
                </span>
              </el-radio>
            </div>
            <div>
              <el-radio :label="2">
                还款专户
                <span style="font-size: 12px;"> (还款专用账户) </span>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleApply" size="large">
        审核UKey开通
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      accountForm: {
        enterpriseName: '珠海民商企业管理有限中心',
        authCode: '91440400MA4WNE736L',
        bankCode: '01',
        accountType: '',
      },
      accountRules: {
        accountType: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
      },
      bankList: [
        { bankCode: '01', bankLabel: '中信银行' },
        { bankCode: '02', bankLabel: '民生银行' },
        { bankCode: '03', bankLabel: '中国银行' },
        { bankCode: '04', bankLabel: '工商银行' },
      ],
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleApply() {
      this.$refs.accountForm.validate(val => {
        if (val) {
          const loading = this.$loading({
            lock: true,
            text: 'Ukey审核中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          setTimeout(() => {
            loading.close()
            this.$store.commit('SET_ACCOUNT', this.accountForm)
            localStorage.setItem('account', JSON.stringify(this.accountForm))
            this.$router.push({
              name: 'bank-account-manage',
              query: { type: 'bindAccount' },
            })
            this.msgSuccess('审核成功！')
          }, 1000)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.open-account {
  .form-container {
    width: 600px;
    height: 400px;
    margin: 150px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
