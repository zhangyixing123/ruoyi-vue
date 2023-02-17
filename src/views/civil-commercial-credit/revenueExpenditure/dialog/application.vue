<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="1100px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div>
        <el-form ref="formData" :model="formData" label-width="160px">
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`民商信编号`" class="is-required">
                <el-input
                  v-model.trim="formData.commercialCreditNo"
                  disabled
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`询价单编号`" class="is-required">
                <el-input v-model.trim="formData.inquiryNo" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item
                :label="`民商信金额(元)`"
                prop="commercialCreditAmt"
                class="is-required"
              >
                <el-input v-model.trim="formData.commercialCreditAmt" disabled>
                  <el-button slot="append">元</el-button>
                </el-input>
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`资金方`" prop="fundSide" class="is-required">
                <el-input v-model.trim="formData.fundSide" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`融资金额(元)`" prop="fnAmt" class="is-required">
                <el-input v-model.trim="formData.fnAmt" disabled
                  ><el-button slot="append">元</el-button></el-input
                >
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`融资方式`" prop="fnModel" class="is-required">
                <el-select
                  v-model.trim="formData.fnModel"
                  disabled
                  :placeholder="`请选择融资方式`"
                  size="small"
                >
                  <el-option
                    v-for="status in $staticData.fn_model"
                    :key="status.dictValue"
                    :label="status.dictLabel"
                    :value="status.dictValue"
                  ></el-option> </el-select></el-form-item
            ></el-col>
          </el-row>
          <el-row class="financingFeeRate">
            <el-col :span="12"
              ><el-form-item
                :label="`预计综合融资息费率`"
                prop="financingFeeRate"
                class="is-required"
              >
                <el-input
                  v-model.trim="formData.financingFeeRate"
                  disabled
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item
                :label="`预计融资息费总额(元)`"
                prop="financingFee	"
                class="is-required"
              >
                <el-input v-model.trim="formData.financingFee" disabled
                  ><el-button slot="append">元</el-button></el-input
                >
                <span class="c-1890ff cur-pointer" @click="details">查看详情</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`预计付款日`" prop="payDay" class="is-required">
                <el-input disabled v-model.trim="formData.payDay"></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`融资到期日`" prop="payDay" class="is-required">
                <el-input disabled v-model.trim="formData.payDay"></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`收款账号`" prop="accountNumber" class="is-required">
                <el-input disabled v-model.trim="formData.accountNumber"></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`开户银行`" prop="openBank" class="is-required">
                <el-input disabled v-model.trim="formData.openBank"></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`开户所在支行`" prop="openBankSubbranch" class="is-required">
                <el-input
                  disabled
                  v-model.trim="formData.openBankSubbranch"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`融资付息模式`" prop="fnInterestModel" class="is-required">
                <el-select
                  v-model.trim="formData.fnInterestModel"
                  disabled
                  :placeholder="`请选择融资付息模式`"
                  size="small"
                >
                  <el-option
                    v-for="status in $staticData.msx_interet_type"
                    :key="status.dictValue"
                    :label="status.dictLabel"
                    :value="status.dictValue"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`平台手续费金额(元)`" prop="handlingFee" class="is-required">
                <el-input disabled v-model.trim="formData.handlingFee"
                  ><el-button slot="append">元</el-button></el-input
                >
              </el-form-item></el-col
            >
          </el-row>
          <el-row class="text-center">
            <el-col :span="24">
              <el-form-item :label="``" label-width="0" class="is-required">
                <el-checkbox v-model.trim="check">我已阅读并同意</el-checkbox>
                <span
                  class="c-1890ff cur-pointer m-l-5"
                  @click="viewPdfFn(item)"
                  v-for="(item, index) in contractList"
                  :key="index"
                  >{{ item.displayName }}</span
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary" @click="submitForm">下一步</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <intersetDetails ref="intersetDetails" :tableData="tableData"></intersetDetails>
    <relation ref="relation" :inquiryNo="inquiryNo"></relation>
    <viewContract
      v-if="showContract"
      @hideDialog="hideDialog"
      :contractFile="contractFile"
    ></viewContract>
  </div>
</template>
<script>
import { getFeeInformationApi, contractAgreementApi } from '@/api/civil-commercial-credit/financing'
import intersetDetails from './interest-Details.vue'
import relation from './relation.vue'
import viewContract from '../../../components/viewContract.vue'
export default {
  props: {
    formData: {
      type: Object,
    },
  },
  components: {
    intersetDetails,
    relation,
    viewContract,
  },
  data() {
    return {
      title: '融资申请',
      open: false,
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
      tableData: [],
      inquiryNo: '',
      check: false,
      contractList: [],
      contractFile: {},
      showContract: false,
    }
  },
  watch: {
    open() {
      // FEE_TYPE
      this.getContractList()
    },
  },
  created() {
    this.getContractList()
  },
  computed: {},
  methods: {
    submitForm() {
      // if (!this.formData.accountNumber) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请在银行账户管理绑定外部户',
      //   })
      //   return
      // }
      if (!this.check) {
        this.$message({
          type: 'warning',
          message: '请阅读并同意协议',
        })
        return
      }
      this.inquiryNo = this.formData.inquiryNo
      this.$refs.relation.open = true
    },
    cancel() {
      this.open = false
    },
    getContractList() {
      contractAgreementApi().then(res => {
        if (res.code == 200) {
          this.contractList = res.data
        }
      })
    },
    viewPdfFn(item) {
      this.contractFile = item
      this.showContract = true
    },
    details() {
      getFeeInformationApi({
        inquiryNo: this.formData.inquiryNo,
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.$refs.intersetDetails.open = true
        }
      })
    },
    hideDialog() {
      this.showContract = false
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
