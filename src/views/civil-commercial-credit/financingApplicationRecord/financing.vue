<template>
  <div class="financingApplication">
    <div>
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="160px">
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`民商信编号`" prop="msxId" class="is-required">
              <el-input
                v-model.trim="formData.msxId"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`询价单编号`" prop="RFQNo" class="is-required">
              <el-input
                v-model.trim="formData.RFQNo"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`民商信额度(元)`" prop="msxEdu" class="is-required">
              <el-input
                v-model.trim="formData.msxEdu"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`资金方`" prop="fundSide" class="is-required">
              <el-input
                v-model.trim="formData.fundSide"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`融资金额(元)`" prop="financingAmount" class="is-required">
              <el-input v-model.trim="formData.financingAmount"></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`融资方式`" prop="financingMode" class="is-required">
              <el-input
                v-model.trim="formData.financingMode"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item
              :label="`预计综合融资息费率`"
              prop="estimatedComprehensiveFinancingInterestRate"
              class="is-required"
            >
              <el-input
                v-model.trim="formData.estimatedComprehensiveFinancingInterestRate"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item
              :label="`预计融资息费总额(元)`"
              prop="totalEstimatedFinancingInterestFee"
              class="is-required"
            >
              <el-input v-model.trim="formData.totalEstimatedFinancingInterestFee">
                <el-button type="primary" size="mini" slot="append" @click="seeFeeDetails"
                  >查看详情</el-button
                >
              </el-input>
            </el-form-item></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`预计付款日`" prop="estimatedPaymentDate" class="is-required">
              <el-input
                v-model.trim="formData.estimatedPaymentDate"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`融资到期日`" prop="financingMaturityDate" class="is-required">
              <el-input
                v-model.trim="formData.financingMaturityDate"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`收款账号`" prop="collectionAccountNumber" class="is-required">
              <el-input v-model.trim="formData.collectionAccountNumber"></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`银行账号`" prop="bankAccount" class="is-required">
              <el-input
                v-model.trim="formData.bankAccount"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item :label="`开户银行`" prop="bankDeposit" class="is-required">
              <el-input
                v-model.trim="formData.bankDeposit"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item :label="`开户所在支行`" prop="openedAccountBranch" class="is-required">
              <el-input
                v-model.trim="formData.openedAccountBranch"
                :disabled="disableds"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item
              :label="`融资付息模式`"
              prop="financingInterestPaymentMode"
              class="is-required"
            >
              <el-select
                v-model.trim="formData.financingInterestPaymentMode"
                :placeholder="`请选择融资付息模式`"
                size="small"
                :disabled="disableds"
              >
                <el-option
                  v-for="status in financingInterestPaymentModeList"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="cancel">取消</el-button>
        <el-button type="warning" @click="temporaryStorage">暂存</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </div>
    <fee-details v-if="seeFeeDetailsShow" @sure="sureFeeDetails"></fee-details>
  </div>
</template>
<script>
import feeDetails from './feeDetails.vue'
export default {
  name: 'financingApplicationRecord',
  components: { 'fee-details': feeDetails },
  data() {
    return {
      companyShow: false,
      financingInterestPaymentModeList: [
        {
          dictValue: '1',
          dictLabel: '融资人付息',
        },
        {
          dictValue: '2',
          dictLabel: '买房付息',
        },
      ],
      disableds: true,
      formData: {
        msxId: '123123213123213213', // 民商信编码
        RFQNo: '2343333333333333', // 询价单编号
        msxEdu: '12,314,124,124.24', //民商信额度(元)
        fundSide: '中国民生银行', //资金方
        financingAmount: '', //融资金额(元)
        financingMode: '保理', //融资方式
        estimatedComprehensiveFinancingInterestRate: '6.66%', //预计综合融资息费率
        totalEstimatedFinancingInterestFee: '66.66', //预计融资息费总额(元)
        estimatedPaymentDate: '2015-10-02', //预计付款日
        financingMaturityDate: '2022-11-11', //融资到期日
        collectionAccountNumber: '中国民生银行', //收款账号
        bankAccount: '3333333333333', //银行账号
        bankDeposit: '中国民生银行', //开户银行
        openedAccountBranch: '福田支行', //开户所在支行
        financingInterestPaymentMode: '1', //融资付息模式
      },
      formDataRules: {
        msxId: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        RFQNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        msxEdu: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        fundSide: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        financingAmount: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        financingMode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        estimatedComprehensiveFinancingInterestRate: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        totalEstimatedFinancingInterestFee: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        estimatedPaymentDate: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        financingMaturityDate: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        collectionAccountNumber: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        bankAccount: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        bankDeposit: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        openedAccountBranch: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        financingInterestPaymentMode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
      },
      seeFeeDetailsShow: false,
    }
  },
  mounted: function() {},
  methods: {
    // 查看详情
    seeFeeDetails(v) {
      this.seeFeeDetailsShow = true
    },
    sureFeeDetails() {
      this.seeFeeDetailsShow = false
    },
    // 取消
    cancel() {
      window.history.go(-1)
    },
    // 暂存
    temporaryStorage() {
      this.$confirm('暂存成功, 即将返回列表页?', '提示', {
        confirmButtonText: '确定',
        type: 'success',
        showClose: false,
        showCancelButton: false,
      }).then(() => {
        this.cancel()
      })
    },
    // 下一步
    next() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          this.$router.push({
            name: 'relation',
            query: {},
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.financingApplication {
  padding: 30px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
