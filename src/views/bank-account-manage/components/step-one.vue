<template>
  <div class="out-account-step-one">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="1.填写银行账号"></el-step>
      <el-step title="2.账号实名验证"></el-step>
      <el-step title="3.签署绑定协议"></el-step>
      <el-step title="4.绑定成功"></el-step>
    </el-steps>
    <div class="form-container">
      <div class="tips">
        <img src="../../../assets/images/error.png" alt="" />
        <span> 为保障贵公司资金安全，请正确填写贵公司对公银行账户,核实无误后确认提交 </span>
      </div>
      <el-form :model="bankForm" :rules="bankRules" ref="bankForm" inline label-width="150px">
        <el-form-item label="银行账户类型">
          <el-input
            v-model.trim="bankForm.bankAccountType"
            disabled
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行开户名">
          <el-input
            v-model.trim="bankForm.bankAccountName"
            disabled
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankCode">
          <el-input
            v-model.trim="bankForm.confirmAccountNo"
            style="width:350px;"
            placeholder="请输入银行账户"
          ></el-input>
        </el-form-item>
        <el-form-item label="请再次输入账号" prop="repeatCode">
          <el-input
            v-model.trim="bankForm.repeatCode"
            style="width:350px;"
            placeholder="请再次输入确认银行账户"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button @click="handleSubmit" type="primary">确认提交</el-button>
    </div>
  </div>
</template>

<script>
import { bindOuterAccountApi } from '@/api/amount-management/index'
import { Encrypt } from '@/utils/jsencrypt'

export default {
  props: {},
  data() {
    const checkRepeat = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入银行账号'))
      }
      setTimeout(() => {
        if (value === this.bankForm.confirmAccountNo) {
          callback()
        } else {
          callback(new Error('两次输入的银行账号不一致！'))
        }
      }, 0)
    }
    return {
      active: 0,
      bankForm: {
        bankAccountType: '对公银行账户',
        bankAccountName: '',
        confirmAccountNo: '',
        repeatCode: '',
      },
      bankRules: {
        confirmAccountNo: [
          {
            required: true,
            message: '请输入银行账户',
            trigger: ['change', 'blur'],
          },
        ],
        repeatCode: [
          {
            required: true,
            trigger: 'blur',
            validator: checkRepeat,
          },
        ],
      },
    }
  },
  computed: {
    enterpriseInfo() {
      return this.$store.state.enterprise
    },
  },
  created() {
    this.bankForm.bankAccountName = this.$store.state.bankInfo.accountName
  },
  mounted() {},
  watch: {},
  methods: {
    handleSubmit() {
      this.$refs.bankForm.validate(val => {
        if (val) {
          const { confirmAccountNo } = this.bankForm
          const query = {
            accountNo: Encrypt(confirmAccountNo),
            confirmAccountNo: Encrypt(confirmAccountNo),
            plantform: '1',
            ...this.enterpriseInfo,
          }
          this.$store.commit('SET_AccountNo', confirmAccountNo)
          // this.$store.commit('SET_BANKACCOUNT', this.bankForm.bankCode)
          // const loading = this.$loading({
          //   lock: true,
          //   text: 'Ukey审核中...',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0, 0, 0, 0.7)',
          // })
          bindOuterAccountApi(query).then(res => {
            if (res.data) {
              this.msgSuccess('提交成功！')
              this.$emit('nextStep', 1)
            }
          })
          // setTimeout(() => {
          //   loading.close()

          // }, 1000)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.out-account-step-one {
  .form-container {
    width: 600px;
    margin: 150px auto;
    .tips {
      height: 30px;
      display: flex;
      align-items: center;
      color: #ccc;
      margin-bottom: 15px;
      font-size: 14px;
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
  .btn-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
