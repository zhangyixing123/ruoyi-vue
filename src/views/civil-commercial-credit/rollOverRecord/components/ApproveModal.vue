<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      title="审核通过"
      :visible.sync="show"
      width="1100px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div>
        <el-form ref="formData" :model="formData" label-width="160px">
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`当前未兑付金额`">
                <el-input v-model.trim="formData.unCashAmt" disabled>
                  <el-button slot="append">元</el-button>
                </el-input>
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`展期费率`">
                <el-input v-model.trim="formData.extensionRate" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`应付展期费用`" prop="extensionAmount">
                <el-input v-model.trim="formData.extensionAmount" disabled>
                  <el-button slot="append">元</el-button>
                </el-input>
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`展期费用支付账户`" prop="accountNo" class="is-required">
                <el-select v-model.trim="accountNo">
                  <el-option
                    v-for="(item, index) of accountList"
                    :key="index"
                    :value="item.accountNo"
                    :label="item.showMsg"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCardList, rollOverRecordApproveApi } from '@/api/civil_and_ommercial_letter/zq'
import { UKeyModal } from '@/utils/business'
export default {
  name: 'approveModal',
  props: {
    formData: {
      type: Object,
    },
    show: {
      type: Boolean,
    },
    getList: {
      type: Function,
    },
  },
  data() {
    return {
      accountList: [],
      accountNo: '',
    }
  },
  created() {
    this.getAccountList()
  },
  computed: {},
  methods: {
    /**确认审核 */
    submitForm() {
      if (!this.accountNo) {
        this.$message({
          message: '请输入展期费用支付账户',
          type: 'error',
        })
        return
      }

      const { unCashAmt, extensionRate, extensionAmount, seqNo, creditCode } = this.formData

      const reqData = {
        accountNo: this.accountNo,
        status: 1, //通过
        unCashAmt,
        extensionRate,
        extensionAmount,
        seqNo,
        creditCode,
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo,
      }
      UKeyModal(this, null, () => {
        rollOverRecordApproveApi(reqData).then(res => {
          if (res.code == 200) {
            this.$message.success('成功')
          }
          this.close()
          this.$emit('getList')
        })
      })
    },
    /**获取账户列表 */
    getAccountList() {
      getCardList({ enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo }).then(res => {
        this.accountList = res.data
      })
    },
    cancel() {
      this.close()
    },
    close() {
      this.$emit('update:show', false)
    },
  },
}
</script>
<style lang="scss" scoped>
.financingFeeRate {
  ::v-deep .el-input-group {
    width: 84%;
  }
}
</style>
