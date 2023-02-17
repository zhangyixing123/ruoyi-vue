<template>
  <div class="financingApplication">
    <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="160px">
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`民商信编号`" prop="msxId" class="is-required">
            <el-input v-model.trim="formData.msxId" :disabled="disabled"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`询价单编号`" prop="RFQNo" class="is-required">
            <el-input v-model.trim="formData.RFQNo" :disabled="disabled"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`民商信额度(元)`" prop="msxEdu" class="is-required">
            <el-input v-model.trim="formData.msxEdu" :disabled="disabled"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`资金方`" prop="fundSide" class="is-required">
            <el-input
              v-model.trim="formData.fundSide"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`融资金额(元)`" prop="availableAmount" class="is-required">
            <el-input
              v-model.trim="formData.financingAmount"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`融资方式`" prop="financingMode" class="is-required">
            <el-select
              v-model.trim="formData.financingMode"
              :placeholder="`请选择融资付息模式`"
              :disabled="disabled"
              size="small"
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
      <el-row>
        <el-col :span="12"
          ><el-form-item
            :label="`预计综合融资息费率`"
            prop="estimatedComprehensiveFinancingInterestRate"
            class="is-required"
          >
            <el-input
              v-model.trim="formData.estimatedComprehensiveFinancingInterestRate"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item
            :label="`预计融资息费总额(元)`"
            prop="totalEstimatedFinancingInterestFee"
            class="is-required"
          >
            <el-input
              v-model.trim="formData.totalEstimatedFinancingInterestFee"
              :disabled="disabled"
              ><el-button type="primary" size="mini" slot="append" @click="seeFeeDetails"
                >查看详情</el-button
              ></el-input
            >
          </el-form-item></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`预计付款日`" prop="estimatedPaymentDate" class="is-required">
            <el-input
              v-model.trim="formData.estimatedPaymentDate"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`融资到期日`" prop="financingMaturityDate" class="is-required">
            <el-input
              v-model.trim="formData.financingMaturityDate"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`收款账号`" prop="collectionAccountNumber" class="is-required">
            <el-input
              v-model.trim="formData.collectionAccountNumber"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`银行账号`" prop="bankAccount" class="is-required">
            <el-input
              v-model.trim="formData.bankAccount"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="`开户银行`" prop="bankDeposit" class="is-required">
            <el-input
              v-model.trim="formData.bankDeposit"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="`开户所在支行`" prop="openedAccountBranch" class="is-required">
            <el-input
              v-model.trim="formData.openedAccountBranch"
              :disabled="disabled"
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
            <el-input
              v-model.trim="formData.financingInterestPaymentMode"
              :disabled="disabled"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <!-- 关联发票 -->
    <div>
      <p>关联发票</p>
      <div class="flex1 over-hidden">
        <el-table height="300" v-loading="loading" :data="invoiceList" ref="data2">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="id" />
          <el-table-column label="发票代码" align="center" prop="invoiceCode" />
          <el-table-column label="发票号码" align="center" prop="invoiceNumber" />
          <el-table-column label="购买方" align="center" prop="purchaser" />
          <el-table-column label="发票含税金额" align="center" prop="invoiceAmountIncludingTax" />
          <el-table-column label="发票不含税金额" align="center" prop="invoiceAmountExcludingTax" />
          <el-table-column label="开票日期" align="center" prop="billingDate" />
          <el-table-column label="合同编码" align="center" prop="contractCode" />
          <el-table-column label="可用金额(元)" align="center" prop="availableAmount" />
          <el-table-column label="本次占用金额(元)" align="center" prop="amountOccupiedThisTime" />
        </el-table>
      </div>
    </div>
    <!-- 关联合同 -->
    <div>
      <p>关联合同</p>
      <div class="flex1 over-hidden">
        <el-table height="300" v-loading="loading" :data="contractList" ref="data1">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="id" />
          <el-table-column label="合同编码" align="center" prop="contractCode" />
          <el-table-column label="合同名称" align="center" prop="contractName" />
          <el-table-column label="合同金额" align="center" prop="contractAmount" />
          <el-table-column label="可用金额" align="center" prop="availableAmount" />
          <el-table-column label="合同生效日期" align="center" prop="contractCommencementDate" />
          <el-table-column label="合同附件" align="center" prop="appendicesContract" />
          <el-table-column label="上传时间" align="center" prop="uploadTime" />
        </el-table>
      </div>
    </div>
    <div slot="footer" class="footer dialog-footer text-center" v-if="isAddOrAudit == 1">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">提交审批</el-button>
    </div>

    <div slot="footer" class="footer dialog-footer text-center" v-if="isAddOrAudit == 2">
      <el-button type="primary" @click="adopt">审批通过</el-button>
      <el-button type="danger" @click="refuse">审批拒绝</el-button>
      <el-button type="success" @click="cancel">取消</el-button>
    </div>
    <fee-details v-if="seeFeeDetailsShow" @sure="sureFeeDetails"></fee-details>
    <Ukey v-if="ukeyShow" @sure="sureFun" @cancel="cancelFun"></Ukey>
    <examine v-if="examineShow" @sure="examineSure" @cancel="examineCancel"></examine>
  </div>
</template>
<script>
import feeDetails from './feeDetails.vue'
import Ukey from '@/views/components/ukey.vue'
import examine from '@/views/components/examine.vue'
import { financingCheck } from '@/api/civil-commercial-credit/financingApplicationRecord'

export default {
  name: 'financingApplicationRecord',
  components: { 'fee-details': feeDetails, Ukey, examine },
  data() {
    return {
      isAddOrAudit: 1, // 1新增  2 审核
      disabled: true,
      seeFeeDetailsShow: false,
      title: '融资申请',
      open: true,
      companyShow: false,
      loading: false,
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
      formData: {
        msxId: '123123213123213213', // 民商信编码
        RFQNo: '2343333333333333', // 询价单编号
        msxEdu: '12,314,124,124.24', //民商信额度(元)
        fundSide: '中国民生银行', //资金方
        financingAmount: '1000', //融资金额(元)
        financingMode: '保理', //融资方式
        estimatedComprehensiveFinancingInterestRate: '6.66%', //预计综合融资息费率
        totalEstimatedFinancingInterestFee: '66.66', //预计融资息费总额(元)
        estimatedPaymentDate: '2015-10-02', //预计付款日
        financingMaturityDate: '2022-11-11', //融资到期日
        collectionAccountNumber: '中国民生银行', //收款账号
        bankAccount: '3333333333333', //银行账号
        bankDeposit: '中国民生银行', //开户银行
        openedAccountBranch: '福田支行', //开户所在支行
        financingInterestPaymentMode: '付息', //融资付息模式
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

      invoiceList: [
        {
          id: '1', //序号
          invoiceCode: '123456', //发票代码
          invoiceNumber: '25', //发票号码
          purchaser: '万科', //购买方
          invoiceAmountIncludingTax: '10000', // 发票含税金额
          invoiceAmountExcludingTax: '20', // 发票不含税金额
          billingDate: '2021-10-10', // 开票日期
          contractCode: '456165', // 合同编码
          availableAmount: '10000', // 可用金额(元)
          amountOccupiedThisTime: '5000', // 本次占用金额(元)
        },
      ],
      contractList: [
        {
          id: '1', //序号
          contractCode: '123456', //合同编码
          contractName: '25', //合同名称
          contractAmount: '万科', //合同金额
          availableAmount: '10000', // 可用金额
          contractCommencementDate: '20', // 合同生效日期
          appendicesContract: '2021-10-10', // 合同附件
          uploadTime: '456165', // 上传时间
        },
      ],
      ukeyShow: false,
      type: 1, // 1 提交审批 2 审批通过
      examineShow: false,
    }
  },
  mounted: function() {},
  created() {
    this.isAddOrAudit = this.$route.query.isAddOrAudit
    this.inquiryNo = this.$route.query.inquiryNo
  },
  watch: {
    '$route.query.isAddOrAudit': {
      immediate: true,
      handler(val) {
        this.isAddOrAudit = val
      },
    },
  },

  methods: {
    // 查看详情
    seeFeeDetails(v) {
      this.seeFeeDetailsShow = true
    },
    sureFeeDetails() {
      this.seeFeeDetailsShow = false
    },
    submitForm() {
      this.type = 1
      this.ukeyShow = true
    },
    cancel() {
      this.$router.push({
        path: '/lcivil-commercial-credit/financingApplicationRecord/index',
        query: {},
      })
    },

    // 审批拒绝
    refuse() {
      this.ukeyShow = true
    },
    //审批通过
    adopt() {
      this.type = 2
      this.examineShow = true
    },
    cancelFun() {
      this.ukeyShow = false
    },
    sureFun() {
      this.ukeyShow = false
      this.cancel()

      if (this.type == 1) {
        // 1 提交审批
      }
      if (this.type == 2) {
        // 2 审批通过
      }
    },
    examineSure(formData) {
      const { remarks, result } = formData
      console.log(formData)
      const query = {
        verifyType: result,
        supplierAuditOpinion: remarks,
        // 	询价编号
        inquiryNo: this.inquiryNo,
      }
      financingCheck(query).then(res => {
        res.success && this.msgSuccess('操作成功！')
        this.examineShow = false
      })

      // this.cancel()
    },
    examineCancel() {
      this.examineShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
.financingApplication {
  padding: 20px 50px;
  width: 100%;
  height: 100%;
  margin: 30px;
  display: flex;
  flex-direction: column;
  .footer {
    margin-top: 20px;
  }
}
</style>
