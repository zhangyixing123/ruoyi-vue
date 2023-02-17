<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="transferShow"
      :before-close="close"
      width="40%"
      center
    >
      <div class="header">
        {{ title }}
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="平台账户:" prop="accountNo">
          <el-input
            v-model.trim="amountData.accountNo"
            :disabled="disabled || approvalDisabled"
            maxlength="255"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台账户名:" prop="accountName">
          <el-input
            v-model.trim="amountData.accountName"
            :disabled="disabled || approvalDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户余额:" prop="balance">
          <el-input
            v-model.trim="amountData.balance"
            maxlength="64"
            :disabled="disabled || approvalDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款账户:" prop="toAccountName">
          <el-select
            v-model.trim="ruleForm.toAccountName"
            :placeholder="`请选择收款账户`"
            size="small"
            @change="tradeAccountChange"
            :disabled="approvalDisabled"
          >
            <el-option
              v-for="item in amountList"
              :key="item.accountName"
              :label="item.accountName"
              :value="item.accountName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款账号:" prop="toTradeAccount">
          <el-input
            v-model.trim="ruleForm.toTradeAccount"
            :disabled="disabled || approvalDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="转出金额（元）:" prop="tradeAmount">
          <el-input v-model.trim="ruleForm.tradeAmount" :disabled="approvalDisabled"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="tradeExplain">
          <el-input v-model.trim="ruleForm.tradeExplain" :disabled="approvalDisabled"></el-input>
        </el-form-item>
        <el-form-item label="审批意见:" prop="approveExplain" v-if="isApprovel">
          <el-input type="textarea" v-model.trim="ruleForm.approveExplain"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="m-t-20" v-if="!isApprovel">
        <el-button type="primary" size="small" @click="applyTransfer('ruleForm')"
          >申请转出</el-button
        >
      </span>
      <span slot="footer" class="m-t-20" v-else>
        <el-button type="primary" size="small" @click="agreeFn('ruleForm')">同 意</el-button>
        <el-button type="primary" size="small" @click="disagreeFn('ruleForm')">不同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { UKeyModal } from '@/utils/ukey'
import {
  transferOutApplyApi,
  transferOutApproveApi,
  transferOutDetailApi,
  enterpriseAccountListApi,
} from '@/api/amount-management/index'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
export default {
  props: {
    transferShow: {
      type: Boolean,
    },
    isApprovel: {
      type: String,
    },
    hideTransferDialog: {
      type: Function,
    },
    amountInfo: {
      type: Array,
      default: [],
    },
    // amountList: {
    //   type: Array,
    //   default: [],
    // },
    row: {
      type: Object,
    },
  },
  data() {
    return {
      amountList: null,
      amountData: {},
      approvalDisabled: null,
      disabled: null,
      ruleForm: {
        platform: 1,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
      },
      rules: {
        toAccountName: [{ required: true, message: '请选择收款账户', trigger: ['blur', 'change'] }],
        tradeAmount: [{ required: true, message: '请输入转出金额', trigger: 'blur' }],
        tradeExplain: [{ required: true, message: '请输入说明', trigger: 'blur' }],
        approveExplain: [{ required: true, message: '请填写审批意见', trigger: 'blur' }],
      },
      title: '转出',
      submitData: {},
    }
  },
  watch: {
    transferShow(change) {
      if (change) {
        if (this.isApprovel) {
          this.title = '转出审批'
          this.amountData = this.amountInfo[0]
          this.approvalDisabled = true
          this.getDetails()
        } else {
          this.title = '转出'
          this.amountData = this.amountInfo[0]
          this.disabled = true
          this.getAmountList()
        }
      }
    },
  },
  computed: {},
  created() {},
  methods: {
    // 查询收款账号
    getAmountList() {
      enterpriseAccountListApi({
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        type: 2,
      }).then(res => {
        if (res.code == 200) {
          this.amountList = res.data
        }
      })
    },
    // 详情
    getDetails() {
      transferOutDetailApi({ seqNo: this.row.seqNo }).then(res => {
        if (res.code == 200) {
          this.ruleForm = { ...res.data }
          this.ruleForm.toTradeAccount = Decrypt(res.data.toTradeAccount)
        }
      })
    },
    applyTransfer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          UKeyModal(this, null, () => {
            this.submitDataFn()
            this.ruleForm = {
              platform: 1,
              tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
            }
            this.amountData = {}
            this.$emit('hideTransferDialog')
          })
        } else {
          return false
        }
      })
    },

    submitDataFn() {
      this.submitData = { ...this.ruleForm }
      this.submitData.fromTradeAccount = Encrypt(this.amountData.accountNo) // 提交的时候先加密
      this.submitData.fromName = this.amountData.accountName //平台账户名
      this.submitData.toTradeAccount = Encrypt(this.ruleForm.toTradeAccount) //收款账号
      this.submitData.beforeTradeBalance = this.amountData.balance //账户余额
      transferOutApplyApi(this.submitData).then(res => {
        if (res.code == 200) {
          this.$message.success('成功')
          this.$parent.getInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 收款账户改变
    tradeAccountChange() {
      const newArr = this.amountList.filter(item => item.accountName == this.ruleForm.toAccountName)
      this.ruleForm.toTradeAccount = Decrypt(newArr[0].accountNo)
    },
    close() {
      this.ruleForm = {
        platform: 1,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
      }
      this.amountData = {}
      this.$emit('hideTransferDialog')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.transferShow = false
    },
    // 同意
    agreeFn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          UKeyModal(this, null, () => {
            this.submitData.tradeStatus = 3
            this.submitData.seqNo = this.row.seqNo
            this.submitData.approveExplain = this.ruleForm.approveExplain
            transferOutApproveApi(this.submitData).then(res => {
              if (res.code == 200) {
                this.$message.success('成功')
                this.$emit('hideTransferDialog')
              } else {
                this.$message.error(res.msg)
                this.$emit('hideTransferDialog')
              }
            })
            // this.submitDataFn()
          })
        } else {
          return false
        }
      })
    },
    // 不同意
    disagreeFn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          UKeyModal(this, null, () => {
            this.submitData.tradeStatus = 2
            this.submitData.seqNo = this.row.seqNo
            this.submitData.approveExplain = this.ruleForm.approveExplain
            transferOutApproveApi(this.submitData).then(res => {
              if (res.code == 200) {
                this.$message.success('成功')
                this.$emit('hideTransferDialog')
              } else {
                this.$message.error(res.msg)
                this.$emit('hideTransferDialog')
              }
            })
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
.header {
  background: #f2f2f2;
  padding: 10px;
  color: #000;
  font-weight: 600;
  font-size: 16px;
}
.demo-ruleForm {
  padding: 20px 40px 20px 20px;
}
</style>
