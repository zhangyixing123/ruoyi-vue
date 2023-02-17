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
        <span> 您绑定的银行账户暂不支持实名签服务，请确保账户信息无误后，点击"下一步"继续 </span>
      </div>
      <el-form :model="bankForm" ref="bankForm" inline label-width="150px">
        <el-form-item label="开户银行">
          <el-input
            v-model.trim="bankForm.bankName"
            placeholder="请输入开户银行"
            disabled
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行账号">
          <el-input
            v-model.trim="bankForm.accountNo"
            placeholder="请输入银行账号"
            disabled
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户银行支行名称">
          <el-input
            v-model.trim="bankForm.accountBankName"
            style="width:350px;"
            placeholder="请输入银行账户"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button @click="handleSubmit" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { queryOuterAccountInfoApi } from '@/api/amount-management/index'
import { Encrypt } from '@/utils/jsencrypt'
export default {
  props: {},
  data() {
    return {
      active: 1,
      bankForm: {},
    }
  },
  computed: {
    enterpriseInfo() {
      return this.$store.state.enterprise
    },
  },
  created() {
    const confirmAccountNo = this.$store.state.bankInfo.accountNo
    const query = {
      ...this.enterpriseInfo,
      plantform: '1',
      accountNo: Encrypt(confirmAccountNo),
      confirmAccountNo: Encrypt(confirmAccountNo),
    }
    queryOuterAccountInfoApi(query).then(res => {
      this.bankForm = res.data
      this.$store.commit('SET_AccountRecordId', res.data.accountRecordId)
    })
  },
  mounted() {},
  watch: {},
  methods: {
    handleSubmit() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Ukey审核中...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      // })
      // setTimeout(() => {
      //   loading.close()
      //   this.msgSuccess('提交成功！')
      //   localStorage.setItem('outAccount', JSON.stringify(this.bankForm))
      //   this.$emit('nextStep', 2)
      // }, 1000)

      this.$emit('nextStep', 2)
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
