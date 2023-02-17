<template>
  <div>
    <div>
      <el-dialog :modal-append-to-body="false" :visible.sync="show" width="33%" center>
        <div class="header">融资申请</div>
        <div class="subtitle">
          发起融资申请后，金融机构进行审批，审批通过后，您还需要在平台上确认转让，才能完成整个融资业务
        </div>
        <div class="content">
          <p>账单总额：¥{{ applyData.billAmount }}元</p>
          <p>融资方式：应收账款转让</p>
          <p>融资金额：以系统审批为准</p>
          <p>融资主体：{{ applyData.companyName }}</p>
          <p>收款账户：{{ applyData.accountNo }}</p>
          <el-checkbox v-model.trim="checked">我已阅读并同意</el-checkbox>
          <span
            class="c-1890ff cur-pointer m-l-5"
            @click="viewPdfFn(item)"
            v-for="(item, index) in contractList"
            :key="index"
            >《{{ item.displayName }}》</span
          >
        </div>
        <span slot="footer" class="m-t-20">
          <el-button type="primary" @click="applyFinance" size="small" :disabled="!checked"
            >申请融资</el-button
          >
          <el-button @click="handleClose" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <viewContract
      v-if="showContract"
      @hideDialog="hideDialog"
      :contractFile="contractFile"
      :lessTime="lessTime"
    ></viewContract>
  </div>
</template>
<script>
import { financialApi, creditPreApi } from '@/api/money-raise-management'
import viewContract from '../../components/viewContract.vue'
export default {
  props: {
    applyData: {
      type: Object,
    },
    queryParams: {
      type: Object,
    },
    hideDetails: {
      type: Function,
    },
    billCount: {
      type: Number,
      default: 0,
    },
  },
  components: {
    viewContract,
  },
  data() {
    return {
      show: false,
      checked: false,
      ukeyShow: false,
      ukey: '',
      contractList: [],
      resultShow: false,
      radioValue: '',
      ruleForm: {
        bankName: '',
        branchName: '',
        unionNumber: '',
        bankCode: '',
      },
      rules: {
        bankName: [{ required: true, message: '请选择基本户开户银行', trigger: 'blur' }],
        branchName: [{ required: true, message: '请选择支行名称', trigger: 'blur' }],
        unionNumber: [{ required: true, message: '请填写联行号', trigger: 'blur' }],
        bankCode: [{ required: true, message: '请填写基本户银行账号', trigger: 'blur' }],
      },
      dialogWidth: '26%',
      lessTime: '',
      showContract: false,
      isReadFinish: false,
      contractFile: {},
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.creditPre()
        // if (Array.isArray(this.applyData.tempList) && this.applyData.tempList.length > 0) {
        //   this.contractList = this.applyData.tempList
        // }
      }
    },
    ukeyShow() {
      this.ukey = ''
    },
  },
  computed: {},
  methods: {
    handleClose() {
      this.show = false
      this.checked = false
    },
    applyFinance() {
      if (!this.isReadFinish) {
        this.$message({
          type: 'warning',
          message: '阅读协议时间不足',
        })
        return false
      }
      this.checked = false
      this.ukeyShow = true
      this.show = false
    },
    // 上一步
    prevStep() {
      this.ukeyShow = false
    },
    // 预授信
    creditPre() {
      creditPreApi({
        billRemainPeriod: Number(this.applyData.billRemainPeriod), //账单剩余账期
        billTotalAmt: this.applyData.billAmount, //账单总金额
        businessType: 'yszk', //业务类型
        companyCode: this.$store.state.enterprise.enterpriseCertNo, //供应商编码
        companyName: this.$store.state.enterprise.enterpriseName, //供应商名称
        financeAmt: '以系统审批为准', //融资金额
        financeMode: 'yszk', //融资模式
        financeSubject: this.applyData.companyName, //融资主体
        ordersNum: this.billCount, //订单数量
        receiveAccNo: this.applyData.accountNo, //收款账户
      }).then(res => {
        if (res.code == 200) {
          this.contractList = res.data.tempInfoList || []
          let timeArr = []
          let lessTimeArr = []
          timeArr = this.contractList.filter(v => {
            return v.forceReadTime > 0
          })
          if (timeArr.length > 0) {
            timeArr.forEach(item => {
              lessTimeArr.push(item.forceReadTime)
            })
            this.lessTime = Math.min(...lessTimeArr)
          }
        }
      })
    },
    // 预览pdf
    viewPdfFn(item) {
      this.isReadFinish = false
      this.contractFile = item
      this.showContract = true
    },
    hideDialog(data) {
      this.contractFile = {}
      this.showContract = false
      if (data) this.isReadFinish = true
    },
    ukeyFn() {
      this.queryParams.billIds = this.queryParams.billsIds
      financialApi(this.queryParams)
        .then(res => {
          if (res.code == 200 && res.success) {
            this.ukeyShow = false
            this.ukey = ''
          }
          this.$emit('hideDetails', {
            flag: 'getList',
            result: '3',
          })
        })
        .catch(err => {
          this.ukeyShow = false
          this.ukey = ''
          // this.$emit('hideDetails', {
          //   flag: 'getList',
          //   result: '2',
          //   message: err.msg,
          // })
        })
    },
    radioChange() {
      this.checked = false
      this.dialogWidth = this.radioValue == 2 ? '50%' : '26%'
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
  padding: 16px 10px;
  color: #000;
  font-weight: 600;
  font-size: 14px;
}
.subtitle {
  color: #e6a23c;
  background: #fdf6ec;
  padding: 5px 20px;
}
.content {
  padding: 0 20px;
}
.ukey {
  & > .title {
    background: #f2f2f2;
    color: #333;
    padding: 10px;
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
  }
}
.icon {
  font-size: 52px;
}
.success {
  color: #50bf19;
}
li {
  list-style-type: none;
}
ul {
  padding: 0;
}
</style>
