<template>
  <div class="bank-account">
    <el-button size="small" @click="back">返回</el-button>
    <el-row :gutter="10" class="flex m-t-20">
      <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="9">
        <div class="bankInfo account">
          <span class="f-s-16 f-weight-bold">选择企业对公账户</span>
          <div
            v-for="(item, index) in listCapital"
            :key="index"
            class="item"
            @click="chooseBank(item, index)"
            :class="chooseIndex == index ? 'itemChoose' : ''"
          >
            <div class="flex align-center just-between">
              <div class="header1 flex align-center">
                <div><img :src="getBankImgUrl(item.bankCode)" alt="" /></div>
                <div class="bankName">
                  <div>{{ item.bankName }}</div>
                  <div>{{ item.maskAccountNo }}</div>
                </div>
              </div>
              <span class="f-s-14">对公账户</span>
            </div>
          </div>
          <div
            @click="readdFn"
            class="item readd f-weight-bold"
            :class="chooseIndex == 'readd' ? 'itemChoose' : ''"
          >
            重新添加
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <div></div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="9">
        <div class="bankInfo">
          <span
            ><span class="icon">!</span
            >为验证企业账户真实性，我们将向您进行小额打款，请您输入打款金额，进行信息认证！</span
          >
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm m-t-20"
          >
            <el-form-item label="账户类型" prop="accountTypeName">
              <el-input v-model.trim="ruleForm.accountTypeName" disabled></el-input>
            </el-form-item>
            <el-form-item label="银行开户名" prop="enterpriseName">
              <el-input v-model.trim="ruleForm.enterpriseName" disabled></el-input>
            </el-form-item>
            <el-form-item label="开户银行名称" prop="bankName">
              <el-input v-model.trim="ruleForm.bankName" disabled></el-input>
            </el-form-item>
            <el-form-item label="开户支行名称" prop="accountBankName">
              <el-select
                v-model.trim="ruleForm.accountBankName"
                filterable
                remote
                :remote-method="remoteMethod"
                clearable
                placeholder="请输入开户支行关键字"
                :loading="loading"
                @change="bankNameChange(ruleForm.accountBankName)"
                :disabled="chooseIndex != 'readd'"
              >
                <el-option
                  v-for="item in options"
                  :key="item.seqNo"
                  :label="item.accBchName"
                  :value="item.accBchName"
                >
                </el-option>
              </el-select>
              <!-- <el-input
                v-model.trim="ruleForm.accountBankName"
                :disabled="chooseIndex != 'readd'"
              ></el-input> -->
            </el-form-item>
            <el-form-item label="开户行行号" prop="accountBankCode">
              <el-input v-model.trim="ruleForm.accountBankCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="maskAccountNo">
              <el-input
                v-model.trim="ruleForm.maskAccountNo"
                :disabled="chooseIndex != 'readd'"
              ></el-input>
            </el-form-item>
            <el-form-item label="打款金额" prop="transAmtMax">
              <div class="flex">
                <el-input v-model.trim="ruleForm.transAmtMax"></el-input>
                <el-button
                  size="mini"
                  :disabled="codeTime > 0"
                  @click="sureOpen"
                  class="m-l-10"
                  v-hasPermi="['account:open:fundPennyVerify']"
                  >{{ codeTime > 0 ? codeTime + 's后重新获取' : '获取金额' }}</el-button
                >
              </div>
            </el-form-item>
            <div class="text-center">
              <el-button
                type="primary"
                @click="saveAccount"
                :disabled="!ruleForm.transAmtMax"
                v-hasPermi="['account:open:saveAccount']"
                >确认开通</el-button
              >
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="flex just-between">
      <div class="bank account">
        选择企业对公账户
        <div
          v-for="(item, index) in listCapital"
          :key="index"
          class="item"
          @click="chooseBank(item, index)"
          :class="chooseIndex == index ? 'itemChoose' : ''"
        >
          <div class="flex align-center just-between">
            <div class="header1 flex align-center">
              <div><img :src="img1" alt="" /></div>
              <div class="bankName">
                <div>{{ item.bankName }}</div>
                <div>{{ item.accountBankCode }}</div>
              </div>
            </div>
            <span>对公账户</span>
          </div>
        </div>
      </div>
      <div class="bank"></div>
    </div> -->
  </div>
</template>
<script>
import { saveAccountApi, fundPennyVerifyApi, listCapitalAccountApi } from '@/api/amount-management'
import { sAccBankBchListApi } from '@/api/enterprise-information-management/index'
import { mapState } from 'vuex'
import { Encrypt } from '@/utils/jsencrypt'
export default {
  props: {
    hideAccount: {
      type: Function,
    },
  },
  data() {
    return {
      img1: require('@/assets/images/unSign.png'),
      chooseIndex: -1,
      ruleForm: {
        accountTypeName: '',
        enterpriseName: '',
        bankName: '',
        accountBankName: '',
        accountBankCode: '',
        maskAccountNo: '',
        transAmtMax: '',
      },
      rules: {
        accountTypeName: [{ required: true, message: '请输入账户类型', trigger: 'blur' }],
        enterpriseName: [{ required: true, message: '请输入银行开户名', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户银行名称', trigger: 'blur' }],
        accountBankName: [{ required: true, message: '请输入开户支行关键字', trigger: 'blur' }],
        accountBankCode: [{ required: true, message: '请输入开户行行号', trigger: 'blur' }],
        maskAccountNo: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        transAmtMax: [{ required: true, message: '请输入打款金额', trigger: 'blur' }],
      },
      options: [],
      loading: false,
      codeTime: '',
      codeTimer: null,
      listCapital: [],
    }
  },
  created() {
    this.getInfo()
  },
  computed: {
    ...mapState({
      enterpriseName: state => state.enterprise.enterpriseName,
      enterpriseCertNo: state => state.enterprise.enterpriseCertNo,
    }),
  },
  methods: {
    back() {
      this.$emit('hideAccount')
    },
    // 查询对公账户信息
    getInfo() {
      listCapitalAccountApi({}).then(res => {
        if (res.code == 200) {
          this.listCapital = res.data
        }
      })
    },
    remoteMethod(query) {
      this.options = []
      if (query !== '') {
        this.loading = true
        sAccBankBchListApi({
          pageSize: 50,
          accBchName: query,
        }).then(res => {
          this.options = res.data.rows
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    bankNameChange(val) {
      if (!val) {
        this.options = []
        this.ruleForm.bankName = this.ruleForm.accountBankCode = ''
      } else {
        this.options.forEach(v => {
          if (v.accBchName == val) {
            this.ruleForm.bankName = v.accBankName
            this.ruleForm.accountBankCode = v.accBchCde
            this.ruleForm.bankCode = v.accBankCde
          }
        })
      }
    },
    // 选中项
    chooseBank(item, index) {
      this.chooseIndex = index
      this.$refs.ruleForm.clearValidate()
      this.ruleForm = item
      this.$set(this.ruleForm, 'transAmtMax', '')

      this.ruleForm.accountTypeName = '对公账户'
    },
    getBankImgUrl(bankCode) {
      try {
        return require(`../../assets/bankCard/0${bankCode}0000.png`)
      } catch (e) {
        return require(`../../assets/bankCard/zgc.png`)
      }
    },
    // 重新添加
    readdFn() {
      this.ruleForm = {
        accountTypeName: '',
        enterpriseName: this.enterpriseName,
        bankName: '',
        accountBankName: '',
        accountBankCode: '',
        maskAccountNo: '',
        transAmtMax: '',
        accountNo: '',
        enterpriseCertNo: this.enterpriseCertNo,
        accountName: this.enterpriseName,
      }
      this.options = []
      this.chooseIndex = 'readd'
      this.ruleForm.accountTypeName = '对公账户'
      this.$set(this.ruleForm, 'transAmtMax', '')
    },
    // 确认开通
    saveAccount() {
      this.rules.transAmtMax = [{ required: true, message: '请输入打款金额', trigger: 'blur' }]
      let params = JSON.parse(JSON.stringify(this.ruleForm))
      params.platform = '1'
      params.thirdChannel = 'zgc'
      params.accountSeqNo = params.seqNo
      console.log(params.maskAccountNo)
      console.log(params.accountNo)
      params.accountNo =
        this.chooseIndex == 'readd' ? Encrypt(params.maskAccountNo) : params.accountNo
      delete params.maskAccountNo
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          saveAccountApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('开通成功')
              this.$emit('hideAccount')
            }
          })
        }
      })
    },
    // 获取金额
    sureOpen() {
      this.rules.transAmtMax = []
      let params = JSON.parse(JSON.stringify(this.ruleForm))
      params.accountNo =
        this.chooseIndex == 'readd' ? Encrypt(params.maskAccountNo) : params.accountNo
      params.thirdChannel = 'zgc'
      params.accountSeqNo = params.seqNo
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.codeTime = 180
          if (this.codeTimer) {
            clearInterval(this.codeTimer)
            this.codeTimer = null
          }
          this.codeTimer = setInterval(() => {
            this.codeTime--
            if (this.codeTime <= 0) {
              clearInterval(this.codeTimer)
              this.codeTimer = null
            }
          }, 1000)
          fundPennyVerifyApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('获取成功')
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.bank-account {
  padding: 20px !important;
  // .account {
  //   margin-left: 10%;
  // }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .bankInfo {
    padding: 20px 30px 10px !important;
    border: 1px solid #bbb;
    border-radius: 3px;
    height: 580px;
    overflow-y: auto;
    // min-width: 400px;
    & > span {
      font-size: 13px;
    }
    .icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: red;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      line-height: 18px;
      margin-right: 3px;
    }
  }
  .readd {
    line-height: 42px;
    text-align: center;
  }
  .item {
    border: 1px solid #bbb;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    cursor: pointer;
    box-shadow: 7px 7px 7px #ddd;
  }
  .itemChoose {
    border: 1px solid #1890ff;
  }
  .header1 {
    img {
      width: 30px;
    }
    .bankName {
      margin-left: 10px;
      & > div:first-child {
        font-size: 16px;
        font-weight: bold;
      }
      & > div:last-child {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
}
</style>
